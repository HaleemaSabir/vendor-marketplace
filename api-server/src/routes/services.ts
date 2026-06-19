import { Router } from "express";
import { body, query, validationResult } from "express-validator";
import { authenticate, requireRole } from "../middleware/auth";
import { uploadSingle, uploadToCloudinary } from "../middleware/upload";
import { Service } from "../models/Service";

const router = Router();

router.get(
  "/",
  [
    query("category").optional().isString(),
    query("search").optional().isString(),
    query("minPrice").optional().isNumeric(),
    query("maxPrice").optional().isNumeric(),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
  ],
  async (req: any, res: any) => {
    try {
      const { category, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
      const filter: any = { isActive: true };

      if (category && category !== "All") filter.category = category;
      if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
      if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
      if (search) filter.$text = { $search: search as string };

      const skip = (Number(page) - 1) * Number(limit);
      const [services, total] = await Promise.all([
        Service.find(filter).populate("providerId", "name avatar location").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        Service.countDocuments(filter),
      ]);

      return res.json({ services, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
);

router.get("/my", authenticate, requireRole("provider"), async (req: any, res: any) => {
  try {
    const services = await Service.find({ providerId: req.user!.id }).sort({ createdAt: -1 });
    return res.json(services);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req: any, res: any) => {
  try {
    const service = await Service.findById(req.params.id).populate("providerId", "name avatar location bio joinedAt");
    if (!service) return res.status(404).json({ message: "Service not found" });
    return res.json(service);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.post(
  "/",
  authenticate,
  requireRole("provider"),
  uploadSingle,
  uploadToCloudinary,
  [
    body("title").trim().isLength({ min: 5, max: 200 }).withMessage("Title must be 5–200 chars"),
    body("description").trim().isLength({ min: 20, max: 5000 }).withMessage("Description must be 20–5000 chars"),
    body("category").isIn(["Website Development", "Logo Design", "Social Media Management", "Content Writing", "Mobile Development", "SEO & Marketing"]),
    body("price").isFloat({ min: 5 }).withMessage("Price must be at least $5"),
    body("deliveryDays").isInt({ min: 1 }).withMessage("Delivery days must be at least 1"),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { title, description, category, price, deliveryDays, tags } = req.body;
      const image = (req as any).uploadedUrl || "";
      const service = await Service.create({
        providerId: req.user!.id,
        title, description, category,
        price: Number(price),
        deliveryDays: Number(deliveryDays),
        image,
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map((t: string) => t.trim())) : [],
      });
      return res.status(201).json(service);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
);

router.put(
  "/:id",
  authenticate,
  requireRole("provider", "admin"),
  uploadSingle,
  uploadToCloudinary,
  async (req: any, res: any) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) return res.status(404).json({ message: "Service not found" });
      if (req.user!.role !== "admin" && service.providerId.toString() !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const { title, description, category, price, deliveryDays, tags, isActive } = req.body;
      const image = (req as any).uploadedUrl || service.image;

      const updated = await Service.findByIdAndUpdate(
        req.params.id,
        {
          ...(title && { title }),
          ...(description && { description }),
          ...(category && { category }),
          ...(price && { price: Number(price) }),
          ...(deliveryDays && { deliveryDays: Number(deliveryDays) }),
          ...(tags && { tags: Array.isArray(tags) ? tags : tags.split(",").map((t: string) => t.trim()) }),
          ...(isActive !== undefined && { isActive }),
          image,
        },
        { new: true }
      );
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
);

router.delete("/:id", authenticate, requireRole("provider", "admin"), async (req: any, res: any) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    if (req.user!.role !== "admin" && service.providerId.toString() !== req.user!.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Service.findByIdAndUpdate(req.params.id, { isActive: false });
    return res.json({ message: "Service deleted" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
