import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";
export enum OrderStatus {
    PENDING = "PENDING",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELLED = "CANCELLED",
}
export enum PaymentMethod {
    COD = "COD",
    ONLINE_PAYMENT = "ONLINE_PAYMENT",
}
export enum DeliveryStatus {
    PENDING = "PENDING",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
}
export interface IOrder extends Document {
    customer: mongoose.Types.ObjectId;
    products: {
        product: mongoose.Types.ObjectId;
        name: string; 
        price: number;
        quantity: number;
        images?: string[];
    }[];
    totalPrice: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    deliveryStatus?: DeliveryStatus;
    deliveryAddress?: string;
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
}

const orderSchema: Schema<IOrder> = new Schema(
    {
        customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
        products: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                discountedPrice: { type: Number, required: true },
                quantity: { type: Number, required: true },
                images: { type: [String], default: [] }
            },
        ],
        totalPrice: { type: Number, required: true , min: 0 },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.PENDING,
        },
        paymentMethod: {
            type: String,
            enum: Object.values(PaymentMethod),
            default: PaymentMethod.COD,
        },
        deliveryStatus: {
            type: String,
            enum: Object.values(DeliveryStatus),
            default: DeliveryStatus.PENDING,
        },
        deliveryAddress: { type: String, default: "" },
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
    products: z.array(
        z.object({
            product: z.string().min(1, { message: "Product ID is required" }),
            quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
        })
    ),
    deliveryAddress: z.string().min(1, { message: "Delivery address is required" }),
    paymentMethod: z.nativeEnum(PaymentMethod).optional(),
});
