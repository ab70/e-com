import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";

export enum ContactUsTypeEnum {
    TEST_DRIVE = "TEST_DRIVE",
    MORE_INFO = "MORE_INFO",
    BOOKING = "BOOKING",
}
// Contact Us form schema
export interface IContactUs extends Document {
    type: ContactUsTypeEnum;
    preferredDate: Date;
    preferredTime: string;
    product?: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: {
        street: string;
        city: string;
        zipCode: string;
    };
    additionalComments?: string;
    status?: {
        status: string;
        note: string;
    }[];
}

const contactUsSchema = new Schema<IContactUs>(
    {
        type: { type: String, enum: Object.values(ContactUsTypeEnum), required: true },
        preferredDate: { type: Date },
        preferredTime: { type: String, trim: true },
        product: { type: mongoose.Types.ObjectId, ref: "Product", default: null },
        firstName: { type: String, trim: true, required: true },
        lastName: { type: String, trim: true, required: true },
        email: { type: String, trim: true, required: true },
        phoneNumber: { type: String, trim: true, required: true },
        address: {
            street: { type: String, trim: true, required: true },
            city: { type: String, trim: true, required: true },
            zipCode: { type: String, trim: true, required: true },
        },
        additionalComments: { type: String, trim: true },
        status: [{
            status: { type: String, trim: true },
            note: { type: String, trim: true },
        }]
    },
    {
        timestamps: true,
    }
);

export const ContactUs = mongoose.model<IContactUs>("ContactUs", contactUsSchema);

// Zod Validation for Contact Us API request
export const ContactUsPostSchema = z.object({
    type: z.nativeEnum(ContactUsTypeEnum),
    product: z.string().optional(),
    preferredDate: z.string().optional(),
    preferredTime: z.string().optional(),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Valid email is required" }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    address: z.object({
        street: z.string().min(1, { message: "Street is required" }),
        city: z.string().min(1, { message: "City is required" }),
        zipCode: z.string().min(1, { message: "Zip code is required" }),
    }),
    additionalComments: z.string().optional(),
    status: z.array(
        z.object({
            status: z.string().min(1, { message: "Status is required" }),
            note: z.string().min(1, { message: "Note is required" }),
        })
    ).optional(),
});

