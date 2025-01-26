import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";

export interface IProduct extends Document {
    name: string;
    description?: string;
    brand?: mongoose.Types.ObjectId;
    price: number;
    stock: number;
    discount: {
        price: number;
        startAt: Date;
        endAt: Date;
    };
    category: mongoose.Types.ObjectId;
    images?: string[];
    vendor: mongoose.Types.ObjectId;
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
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
}

const productSchema = new Schema(
    {
        name: { type: String, trim: true, required: true },
        description: { type: String, trim: true },
        brand: { type: mongoose.Types.ObjectId, ref: "Brand", required: false },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0 },
        discount: {
            price: { type: Number, default: 0 },
            startAt: { type: Date, default: null },
            endAt: { type: Date, default: null }
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: "Category",
            required: true,
            default: null,
        },
        images: { type: [String], default: [] },
        vendor: {
            type: Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
            default: null,
        },
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
    brand: z.string().min(1, { message: "Brand ID is required" }),
    price: z.preprocess((val) => parseFloat(val as string), z.number().min(0)),
    stock: z.preprocess((val) => parseInt(val as string, 10), z.number().min(0)),
    discount: z.object({
        price: z.preprocess((val) => parseFloat(val as string), z.number().min(0)),
        startAt: z.preprocess((val) => new Date(val as string), z.string().min(1)).optional(),
        endAt: z.preprocess((val) => new Date(val as string), z.string().min(1)).optional(),
    }),
    category: z.string().min(1, { message: "Category ID is required" }),
    images: z.array(z.any().openapi({ type: "string", format: "binary" })),
    varient: z
        .preprocess((val) => {
            if (typeof val === "string") {
                try {
                    return JSON.parse(val);
                } catch (error) {
                    return {};
                }
            }
            return val;
        },
            z.object({
                label: z.string().optional(),
                varients: z.array(
                    z.object({
                        name: z.string(),
                        price: z.number(),
                        stock: z.number(),
                        description: z.string(),
                        images: z.array(z.string()).optional(),
                    })
                ).optional().default([]),
            }).optional()),
});
