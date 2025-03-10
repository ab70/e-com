import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";

export interface IBrand extends Document {
    name: string;
    logo?: string;
    category: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
}

const brandSchema: Schema<IBrand> = new Schema(
    {
        name: { type: String, trim: true, required: true, unique: true },
        logo: { type: String, trim: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: false },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    },
    {
        timestamps: true,
    }
);

// Middleware to validate the `category` reference
brandSchema.pre<IBrand>("save", async function (next) {
    const category = await mongoose.model("Category").findById(this.category);
    if (!category) {
        return next(new Error("Invalid category: Category not found."));
    }
    next();
});

export const Brand = mongoose.model<IBrand>("Brand", brandSchema);

// Validation Schemas using Zod
export const BrandPostSchema = z.object({
    name: z.string().min(1, { message: "Brand name is required" }),
    logo: z.string().optional(),
    category: z.string().min(1, { message: "Category ID is required" })
});
