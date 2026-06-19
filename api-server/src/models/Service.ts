import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  providerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryDays: number;
  image?: string;
  tags: string[];
  isPopular: boolean;
  rating: number;
  reviewCount: number;
  isActive: boolean;
}

const ServiceSchema = new Schema<IService>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 5000 },
    category: {
      type: String,
      required: true,
      enum: [
        "Website Development",
        "Logo Design",
        "Social Media Management",
        "Content Writing",
        "Mobile Development",
        "SEO & Marketing",
      ],
    },
    price: { type: Number, required: true, min: 5 },
    deliveryDays: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
    tags: [{ type: String, trim: true }],
    isPopular: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ServiceSchema.index({ title: "text", description: "text", tags: "text" });
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ providerId: 1 });

ServiceSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Service = mongoose.model<IService>("Service", ServiceSchema);
