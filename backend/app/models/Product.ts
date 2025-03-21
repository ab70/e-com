import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";
import { FieldTypes, type ICustomField, type IFeature } from "./Features";
export interface IProduct extends Document {
    name: string;
    description?: string;
    featured?: boolean;
    brand?: mongoose.Types.ObjectId;
    price?: number;
    stock?: number;
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
    features?: ICustomField[];
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
}

const productSchema = new Schema(
    {
        name: { type: String, trim: true, required: true },
        description: { type: String, trim: true },
        featured: { type: Boolean, default: false },
        brand: { type: mongoose.Types.ObjectId, ref: "Brand", required: false },
        price: { type: Number, required: false },
        stock: { type: Number, required: false, },
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
        varients: {
            label: { type: String, },
            varient: [{
                name: { type: String, default: "" },
                price: { type: Number, default: 0 },
                stock: { type: Number, default: 0 },
                description: { type: String, default: "" },
                images: { type: [String], default: [] },
            }]
        },
        features: [
            {
                fieldName: { type: String, trim: true },
                fieldLabel: { type: String, trim: true },
                fieldType: {
                    type: String,
                    enum: Object.values(FieldTypes)
                },
                options: [
                    {
                        value: { type: String, trim: true },
                        label: { type: String, trim: true },
                    },
                ],
                fieldValue: { type: String, trim: true },
                defaultValue: { type: String, trim: true },
            },
        ],
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
    featured: z.boolean().default(false).optional(),
    brand: z.string().min(1, { message: "Brand ID is required" }),
    price: z.number().min(0),
    stock: z.number().min(0),
    discount: z.object(
        {
            price: z.preprocess((val) => parseFloat(val as string), z.number()),
            startAt: z.string(),
            endAt: z.string(),
        }
    ).optional(),
    category: z.string().min(1, { message: "Category ID is required" }),
    images: z.array(z.any().openapi({ type: "string", format: "binary" })),
    varients: z.object({
        label: z.string().optional(),
        varient: z.array(
            z.object({
                name: z.string(),
                price: z.number(),
                stock: z.number(),
                description: z.string(),
                images: z.array(z.string()).optional(),
            })
        ).optional().default([]),
    }).optional(),
    features: z.array(
        z.object({
            fieldName: z.string().min(1, { message: "Field name is required" }),
            fieldLabel: z.string().min(1, { message: "Field label is required" }),
            fieldType: z.nativeEnum(FieldTypes),
            options: z.array(
                z.object({
                    value: z.string().min(1, { message: "Option value is required" }),
                    label: z.string().min(1, { message: "Option label is required" }),
                })
            ).optional(),
            fieldValue: z.string().optional(),
            defaultValue: z.string().optional(),
        })
    ).optional().default([]),
});
