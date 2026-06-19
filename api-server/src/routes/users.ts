import { Router } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, requireRole } from "../middleware/auth";
import { uploadSingle, uploadToCloudinary } from "../middleware/upload";
import { User } from "../models/User";

const router = Router();

router.get("/", authenticate, requireRole("admin"), async (_req: any, res: any) => {
  try {
    const users = await User.find().sort({ joinedAt: -1 });
    return res.json(users);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/:id", authenticate, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.put(
  "/profile",
  authenticate,
  [
    body("name").optional().trim().isLength({ min: 2, max: 100 }),
    body("location").optional().trim(),
    body("bio").optional().trim().isLength({ max: 1000 }),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, location, bio } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user!.id,
        { ...(name && { name }), ...(location !== undefined && { location }), ...(bio !== undefined && { bio }) },
        { new: true }
      );
      return res.json(user);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
);

router.post(
  "/avatar",
  authenticate,
  uploadSingle,
  uploadToCloudinary,
  async (req: any, res: any) => {
    const url = (req as any).uploadedUrl;
    if (!url) return res.status(400).json({ message: "No image uploaded" });
    try {
      const user = await User.findByIdAndUpdate(req.user!.id, { avatar: url }, { new: true });
      return res.json({ avatar: url, user });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
);

router.patch("/:id/status", authenticate, requireRole("admin"), async (req: any, res: any) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", authenticate, requireRole("admin"), async (req: any, res: any) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: "User deleted" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
