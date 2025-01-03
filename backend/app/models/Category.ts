import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";

export interface ICategory extends Document {
    name: string;
    description?: string;
    parentCategory?: mongoose.Types.ObjectId; // Reference to another category
}

const categorySchema: Schema<ICategory> = new Schema(
    {
        name: { type: String, trim: true, required: true, unique: true },
        description: { type: String, trim: true },
        parentCategory: { 
            type: mongoose.Types.ObjectId, 
            ref: "Category", // Reference to the same collection
            default: null 
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Middleware to validate the parentCategory reference (optional)
categorySchema.pre<ICategory>("save", async function (next) {
    if (this.parentCategory) {
        const parent = await mongoose.model<ICategory>("Category").findById(this.parentCategory);
        if (!parent) {
            return next(new Error("Invalid parentCategory: Category not found."));
        }
    }
    next();
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);

// Validation Schemas using zod
export const CategoryPostSchema = z.object({
    name: z.string().min(1, { message: "Category name is required" }),
    description: z.string().optional(),
    parentCategory: z.string().optional().default("")
});
