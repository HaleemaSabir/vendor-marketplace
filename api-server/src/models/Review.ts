import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  serviceId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 2000 },
  },
  { timestamps: true }
);

ReviewSchema.index({ serviceId: 1 });
ReviewSchema.index({ providerId: 1 });

ReviewSchema.post("save", async function () {
  const Service = mongoose.model("Service");
  const reviews = await mongoose.model<IReview>("Review").find({ serviceId: this.serviceId });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Service.findByIdAndUpdate(this.serviceId, {
    rating: Math.round(avg * 10) / 10,
    reviewCount: reviews.length,
  });
});

ReviewSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Review = mongoose.model<IReview>("Review", ReviewSchema);
