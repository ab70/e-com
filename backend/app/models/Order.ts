import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";

export interface IOrder extends Document {
    customer: mongoose.Types.ObjectId; // Reference to User schema
    products: {
        product: mongoose.Types.ObjectId; // Reference to Product schema
        name: string; // Static product data
        price: number;
        quantity: number;
        images?: string[]; // Static product data
    }[];
    totalPrice: number;
    status: "Pending" | "Approved" | "Rejected";
    createdBy: mongoose.Types.ObjectId; // Reference to User schema
    updatedBy: mongoose.Types.ObjectId; // Reference to User schema
}

const orderSchema: Schema<IOrder> = new Schema(
    {
        customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
        products: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                images: { type: [String], default: [] },
            },
        ],
        totalPrice: { type: Number, required: true },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);

// Validation Schemas using zod
export const OrderPostSchema = z.object({
    customer: z.string().min(1, { message: "Customer ID is required" }),
    products: z.array(
        z.object({
            product: z.string().min(1, { message: "Product ID is required" }),
            quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
        })
    ),
    status: z.enum(["Pending", "Approved", "Rejected"]).optional(),
});
