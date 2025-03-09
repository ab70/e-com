import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";

export interface IBanner extends Document {
    name: string;
    image?: string;
    createdBy: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
}

const bannerSchema: Schema<IBanner> = new Schema(
    {
        name: { type: String, trim: true, required: true, unique: true },
        image: { type: String, trim: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    },
    {
        timestamps: true,
    }
);


export const Banner = mongoose.model<IBanner>("Banner", bannerSchema);

// Validation Schemas using Zod
export const BannerPostSchema = z.object({
    name: z.string().min(1, { message: "Banner name is required" }),
    image: z.string()
});
