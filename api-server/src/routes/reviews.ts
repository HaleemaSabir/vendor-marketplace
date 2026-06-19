import { Router } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, requireRole } from "../middleware/auth";
import { Review } from "../models/Review";
import { Project } from "../models/Project";

const router = Router();

router.get("/service/:serviceId", async (req: any, res: any) => {
  try {
    const reviews = await Review.find({ serviceId: req.params.serviceId })
      .populate("customerId", "name avatar")
      .sort({ createdAt: -1 });
    return res.json(reviews);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/provider/:providerId", async (req: any, res: any) => {
  try {
    const reviews = await Review.find({ providerId: req.params.providerId })
      .populate("customerId", "name avatar")
      .populate("serviceId", "title")
      .sort({ createdAt: -1 });
    const avg = reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;
    return res.json({ reviews, averageRating: Math.round(avg * 10) / 10, total: reviews.length });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.post(
  "/",
  authenticate,
  requireRole("customer"),
  [
    body("projectId").notEmpty(),
    body("rating").isInt({ min: 1, max: 5 }),
    body("comment").trim().isLength({ min: 5, max: 2000 }),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { projectId, rating, comment } = req.body;
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ message: "Project not found" });
      if (project.customerId.toString() !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      if (!["Completed", "Delivered"].includes(project.status)) {
        return res.status(400).json({ message: "Can only review completed/delivered projects" });
      }

      const existing = await Review.findOne({ projectId });
      if (existing) return res.status(409).json({ message: "Already reviewed this project" });

      const review = await Review.create({
        serviceId: project.serviceId,
        projectId,
        customerId: req.user!.id,
        providerId: project.providerId,
        rating: Number(rating),
        comment,
      });

      const populated = await review.populate("customerId", "name avatar");
      return res.status(201).json(populated);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
);

export default router;
