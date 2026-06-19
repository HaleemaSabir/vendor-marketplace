import { Router } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/User";
import { signToken } from "../lib/jwt";

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be 2–100 chars"),
    body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
    body("role").isIn(["customer", "provider"]).withMessage("Role must be customer or provider"),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ message: "Email already registered" });

      const user = await User.create({ name, email, password, role });
      const token = signToken({ id: user.id as string, role: user.role });
      return res.status(201).json({ token, user });
    } catch (err: any) {
      return res.status(500).json({ message: "Registration failed", error: err.message });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email, isActive: true });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      const ok = await user.comparePassword(password);
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });

      const token = signToken({ id: user.id as string, role: user.role });
      return res.json({ token, user });
    } catch (err: any) {
      return res.status(500).json({ message: "Login failed", error: err.message });
    }
  }
);

router.get("/me", async (req: any, res: any) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });
  try {
    const { verifyToken } = await import("../lib/jwt");
    const payload = verifyToken(header.slice(7));
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
