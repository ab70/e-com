import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";

export interface IFinance extends Document {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    sin: string;
    gender: string;
    maritalStatus: string;
    treatyCard: boolean;
    birthday: Date;
    email: string;
    heardAboutUs?: string;
    address: {
        country: string;
        streetAddress: string;
        city: string;
        postalCode: string;
        housingStatus: string;
        durationAtResidence: string;
        rentOrMortgage?: number;
    };
    employment: {
        employer: string;
        position: string;
        grossIncome: number;
        timeEmployed: string;
        additionalIncome?: {
            source: string;
            amount: number;
        }[];
    };
    product: {
        productId: mongoose.Types.ObjectId;
        type: string;
        specificRequirements?: string;
        tradeInVehicle?: {
            year: number;
            make: string;
            model: string;
            trim: string;
            amountOwed: number;
        };
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const financeSchema: Schema<IFinance> = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        phoneNumber: { type: String, required: true, trim: true },
        sin: { type: String, trim: true },
        gender: { type: String, required: true, trim: true },
        maritalStatus: { type: String, required: true, trim: true },
        treatyCard: { type: Boolean, required: true },
        birthday: { type: Date, required: true },
        email: { type: String, required: true, trim: true, unique: true },
        heardAboutUs: { type: String, trim: true },
        address: {
            country: { type: String, required: true, trim: true },
            streetAddress: { type: String, required: true, trim: true },
            city: { type: String, required: true, trim: true },
            postalCode: { type: String, required: true, trim: true },
            housingStatus: { type: String, required: true, trim: true },
            durationAtResidence: { type: String, required: true, trim: true },
            rentOrMortgage: { type: Number },
        },
        employment: {
            employer: { type: String, required: true, trim: true },
            position: { type: String, required: true, trim: true },
            grossIncome: { type: Number, required: true },
            timeEmployed: { type: String, required: true, trim: true },
            additionalIncome: [{
                source: { type: String, required: true, trim: true },
                amount: { type: Number, required: true }
            }],
        },
        product: {
            productId: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
            type: { type: String, required: true, trim: true },
            specificRequirements: { type: String, trim: true },
            tradeInVehicle: {
                year: { type: Number },
                make: { type: String, trim: true },
                model: { type: String, trim: true },
                trim: { type: String, trim: true },
                amountOwed: { type: Number },
            },
        },
    },
    {
        timestamps: true,
    }
);

export const Finance = mongoose.model<IFinance>("Finance", financeSchema);

// Validation Schema using Zod
export const FinancePostSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    sin: z.string().min(1, { message: "S.I.N is required" }),
    gender: z.string().min(1, { message: "Gender is required" }),
    maritalStatus: z.string().min(1, { message: "Marital Status is required" }),
    treatyCard: z.boolean(),
    birthday: z.string().min(1, { message: "Birthday is required" }),
    email: z.string().email({ message: "Invalid email format" }),
    heardAboutUs: z.string().optional(),
    address: z.object({
        country: z.string().min(1, { message: "Country is required" }),
        streetAddress: z.string().min(1, { message: "Address is required" }),
        city: z.string().min(1, { message: "City is required" }),
        postalCode: z.string().min(1, { message: "Postal code is required" }),
        housingStatus: z.string().min(1, { message: "Housing status is required" }),
        durationAtResidence: z.string().min(1, { message: "Duration is required" }),
        rentOrMortgage: z.number().optional(),
    }),
    employment: z.object({
        employer: z.string().min(1, { message: "Employer is required" }),
        position: z.string().min(1, { message: "Position is required" }),
        grossIncome: z.number().min(1, { message: "Gross income is required" }),
        timeEmployed: z.string().min(1, { message: "Time employed is required" }),
        additionalIncome: z.array(
            z.object({
                source: z.string().min(1, { message: "Income source is required" }),
                amount: z.number().min(1, { message: "Income amount is required" }),
            })
        ).optional(),
    }),
    product: z.object({
        productId: z.string().min(1, { message: "Product ID is required" }),
        type: z.string().min(1, { message: "Vehicle type is required" }),
        specificRequirements: z.string().optional(),
        tradeInVehicle: z.object({
            year: z.number(),
            make: z.string().min(1, { message: "Make is required" }),
            model: z.string().min(1, { message: "Model is required" }),
            trim: z.string().min(1, { message: "Trim is required" }),
            amountOwed: z.number(),
        }).optional(),
    }),
});