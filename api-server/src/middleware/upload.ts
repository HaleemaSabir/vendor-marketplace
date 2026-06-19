import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { cloudinary, isCloudinaryConfigured } from "../lib/cloudinaryConfig";
import { logger } from "../lib/logger";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export const uploadSingle = upload.single("image");

export async function uploadToCloudinary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.file) return next();

  if (!isCloudinaryConfigured()) {
    (req as any).uploadedUrl = `https://picsum.photos/seed/${Date.now()}/400/400`;
    return next();
  }

  try {
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "servicehub", resource_type: "image", transformation: [{ width: 400, height: 400, crop: "fill" }] },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file!.buffer);
    });
    (req as any).uploadedUrl = result.secure_url;
    next();
  } catch (err) {
    logger.error({ err }, "Cloudinary upload failed");
    res.status(500).json({ message: "Image upload failed" });
  }
}
