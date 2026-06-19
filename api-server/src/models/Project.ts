import mongoose, { Document, Schema } from "mongoose";

export type ProjectStatus = "Pending" | "Accepted" | "In Progress" | "Completed" | "Delivered" | "Cancelled";

export interface IProject extends Document {
  customerId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  title: string;
  requirements: string;
  budget: number;
  deadline: Date;
  status: ProjectStatus;
  statusHistory: Array<{ status: ProjectStatus; changedAt: Date; note?: string }>;
}

const ProjectSchema = new Schema<IProject>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    requirements: { type: String, required: true, maxlength: 5000 },
    budget: { type: Number, required: true, min: 1 },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "In Progress", "Completed", "Delivered", "Cancelled"],
      default: "Pending",
    },
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

ProjectSchema.index({ customerId: 1 });
ProjectSchema.index({ providerId: 1 });
ProjectSchema.index({ serviceId: 1 });
ProjectSchema.index({ status: 1 });

ProjectSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
