import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";

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
    vendorType: "Manufacturer" | "Distributor" | "Retailer" | "Wholesaler" | "ServiceProvider";
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
            enum: ["Manufacturer", "Distributor", "Retailer", "Wholesaler", "ServiceProvider"],
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
    logo: z.string().url({ message: "Logo must be a valid URL" }).optional(),
    vendorAddress: z
        .array(
            z.object({
                street: z.string().min(1, { message: "Street is required" }),
                city: z.string().min(1, { message: "City is required" }),
                state: z.string().optional(),
                country: z.string().min(1, { message: "Country is required" }),
                postalCode: z.string().optional(),
            })
        )
        .min(1, { message: "At least one address is required" }),
    vendorType: z.enum([
        "Manufacturer",
        "Distributor",
        "Retailer",
        "Wholesaler",
        "ServiceProvider",
    ]),
    createdBy: z.string().min(1, { message: "CreatedBy (user ID) is required" }),
});