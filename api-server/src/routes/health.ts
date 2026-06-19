import { Router } from "express";
import { getIsConnected } from "../lib/db";

const router = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok", db: getIsConnected() ? "connected" : "disconnected" });
});

export default router;
