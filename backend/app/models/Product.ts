import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";

export interface IProduct extends Document {
    name: string;
    description?: string;
    price: number;
    stock: number;
    category: mongoose.Types.ObjectId; // Reference to Category schema
    images?: string[]; // Array of image URLs
    varient?: {
        label: string;
        varients: {
            name: string;
            price: number;
            stock: number;
            description: string;
            images: string[];
        }[];
    };
    createdBy: mongoose.Types.ObjectId; // Reference to User schema
    updatedBy: mongoose.Types.ObjectId; // Reference to User schema
}

const productSchema = new Schema(
    {
        name: { type: String, trim: true, required: true },
        description: { type: String, trim: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0 },
        category: {
            type: mongoose.Types.ObjectId,
            ref: "Category",
            required: true,
            default: null,
        },
        images: { type: [String], default: [] },
        varient: {
            label: { type: String, },
            varients: [{
                name: { type: String, default: "" },
                price: { type: Number, default: 0 },
                stock: { type: Number, default: 0 },
                description: { type: String, default: "" },
                images: { type: [String], default: [] },
            }]
        },
        createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
        updatedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

// Middleware to validate the category reference
productSchema.pre<IProduct>("save", async function (next) {
    if (this.category) {
        const category = await mongoose.model("Category").findById(this.category);
        if (!category) {
            return next(new Error("Invalid category: Category not found."));
        }
    }
    next();
});

export const Product = mongoose.model<IProduct>("Product", productSchema);

// Validation Schemas using zod
export const ProductPostSchema = z.object({
    name: z.string().min(1, { message: "Product name is required" }),
    description: z.string().optional(),
    price: z.number().min(0, { message: "Price must be non-negative" }),
    stock: z.number().min(0, { message: "Stock must be non-negative" }),
    category: z.string().min(1, { message: "Category ID is required" }),
    images: z.array(z.any().openapi({type: "string", format: "binary"})),
    varient: z.object({
        label: z.string(),
        varients: z.array(
            z.object({
                name: z.string(),
                price: z.number(),
                stock: z.number(),
                description: z.string(),
                images: z.array(z.any().openapi({type: "string", format: "binary"})).optional().default([]),
            })
        ),
    }),
});
