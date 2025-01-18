import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";

export enum VendorTypeEnum {
    Manufacturer = "Manufacturer",
    Distributor = "Distributor",
    Retailer = "Retailer",
    Wholesaler = "Wholesaler",
    ServiceProvider = "ServiceProvider",
}

export interface IVendor extends Document {
    vendorName: string;
    vendorDetails?: string;
    logo?: string; // URL for vendor logo
    vendorAddress: {
        street: string;
        city: string;
        state?: string;
        country: string;
        postalCode?: string;
    }[];
    vendorType: VendorTypeEnum;
    createdBy: mongoose.Types.ObjectId; // Reference to User schema
    updatedBy: mongoose.Types.ObjectId; // Reference to User schema
}

const vendorSchema = new Schema<IVendor>(
    {
        vendorName: { type: String, trim: true, required: true },
        vendorDetails: { type: String, trim: true },
        logo: { type: String, trim: true },
        vendorAddress: [
            {
                street: { type: String, trim: true, required: true },
                city: { type: String, trim: true, required: true },
                state: { type: String, trim: true },
                country: { type: String, trim: true, required: true },
                postalCode: { type: String, trim: true },
            },
        ],
        vendorType: {
            type: String,
            enum: Object.values(VendorTypeEnum),
            default: VendorTypeEnum.Manufacturer,
            required: true,
        },
        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

export const Vendor = mongoose.model<IVendor>("Vendor", vendorSchema);

export const VendorPostSchema = z.object({
    vendorName: z.string().min(1, { message: "Vendor name is required" }),
    vendorDetails: z.string().optional(),
    logo: z.any().openapi({ type: "string", format: "binary" }).optional(),
    vendorAddress: z
        .preprocess((value) => {
            if (typeof value === "string") {
                try {
                    return JSON.parse(value);
                } catch {
                    throw new Error("Invalid JSON format for vendorAddress.");
                }
            }
            return value;
        },
            z.array(
                z.object({
                    street: z.string().min(1, { message: "Street is required" }),
                    city: z.string().min(1, { message: "City is required" }),
                    state: z.string().optional(),
                    country: z.string().min(1, { message: "Country is required" }),
                    postalCode: z.string().optional(),
                })
            ).min(1, { message: "At least one address is required" })
        ),
    vendorType: z.nativeEnum(VendorTypeEnum).optional(),
    // createdBy: z.string().min(1, { message: "CreatedBy (user ID) is required" }),
});