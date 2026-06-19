import mongoose from "mongoose";
import { logger } from "./logger";

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const uri = process.env["MONGODB_URI"];
  if (!uri) {
    logger.warn("MONGODB_URI not set — database features unavailable");
    return;
  }

  try {
    await mongoose.connect(uri, { dbName: "servicehub" });
    isConnected = true;
    logger.info("MongoDB connected");

    mongoose.connection.on("error", (err) => {
      logger.error({ err }, "MongoDB connection error");
    });
    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      logger.warn("MongoDB disconnected");
    });
  } catch (err) {
    logger.error({ err }, "MongoDB connection failed");
  }
}

export function getIsConnected(): boolean {
  return isConnected;
}
