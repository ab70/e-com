import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";


export interface IReview extends Document {
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    review: string;
    reply?: {
        vendor: mongoose.Types.ObjectId;
        replyText: string; 
        repliedAt: Date; 
    };
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        review: { type: String, required: true, trim: true },
        reply: {
            vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
            replyText: { type: String, trim: true },
            repliedAt: { type: Date },
        },
    },
    {
        timestamps: true,
    }
);

export const Review = mongoose.model<IReview>("Review", reviewSchema);

export const ReviewPostSchema = z.object({
    product: z.string().min(1, { message: "Product ID is required" }),
    user: z.string().min(1, { message: "User ID is required" }),
    rating: z.number().min(1).max(5).int({ message: "Rating must be an integer between 1 and 5" }),
    review: z.string().min(1, { message: "Review text is required" }),
});

export const ReplySchema = z.object({
    vendor: z.string().min(1, { message: "Vendor ID is required" }),
    replyText: z.string().min(1, { message: "Reply text is required" }),
});