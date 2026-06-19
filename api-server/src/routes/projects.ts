import { Router } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, requireRole } from "../middleware/auth";
import { Project } from "../models/Project";
import { Service } from "../models/Service";

const router = Router();

router.get("/", authenticate, async (req: any, res: any) => {
  try {
    const filter: any = {};
    if (req.user!.role === "customer") filter.customerId = req.user!.id;
    else if (req.user!.role === "provider") filter.providerId = req.user!.id;

    const projects = await Project.find(filter)
      .populate("customerId", "name avatar email")
      .populate("providerId", "name avatar email")
      .populate("serviceId", "title category price")
      .sort({ createdAt: -1 });

    return res.json(projects);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/:id", authenticate, async (req: any, res: any) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("customerId", "name avatar email")
      .populate("providerId", "name avatar email")
      .populate("serviceId", "title category price image");
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isOwner =
      project.customerId._id?.toString() === req.user!.id ||
      project.providerId._id?.toString() === req.user!.id;
    if (!isOwner && req.user!.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    return res.json(project);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.post(
  "/",
  authenticate,
  requireRole("customer"),
  [
    body("serviceId").notEmpty().withMessage("serviceId required"),
    body("title").trim().isLength({ min: 3, max: 200 }),
    body("requirements").trim().isLength({ min: 10, max: 5000 }),
    body("budget").isFloat({ min: 1 }),
    body("deadline").isISO8601().toDate(),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { serviceId, title, requirements, budget, deadline } = req.body;
      const service = await Service.findById(serviceId);
      if (!service) return res.status(404).json({ message: "Service not found" });

      const project = await Project.create({
        customerId: req.user!.id,
        providerId: service.providerId,
        serviceId,
        title,
        requirements,
        budget: Number(budget),
        deadline,
        statusHistory: [{ status: "Pending", changedAt: new Date() }],
      });
      return res.status(201).json(project);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
);

const STATUS_TRANSITIONS: Record<string, string[]> = {
  Pending: ["Accepted", "Cancelled"],
  Accepted: ["In Progress", "Cancelled"],
  "In Progress": ["Completed"],
  Completed: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

router.patch("/:id/status", authenticate, async (req: any, res: any) => {
  try {
    const { status, note } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const allowed = STATUS_TRANSITIONS[project.status] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Cannot transition from ${project.status} to ${status}` });
    }

    const isProvider = project.providerId.toString() === req.user!.id;
    const isCustomer = project.customerId.toString() === req.user!.id;

    if (!isProvider && !isCustomer && req.user!.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    project.status = status;
    project.statusHistory.push({ status, changedAt: new Date(), note });
    await project.save();
    return res.json(project);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/admin/all", authenticate, requireRole("admin"), async (_req: any, res: any) => {
  try {
    const projects = await Project.find()
      .populate("customerId", "name avatar")
      .populate("providerId", "name avatar")
      .populate("serviceId", "title category")
      .sort({ createdAt: -1 });
    return res.json(projects);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
