import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";

export interface IFeature extends Document {
    name: string;
    description?: string;
    category?: mongoose.Types.ObjectId;
    customFields?: any[];
}

export enum FieldTypes {
    TEXT = "text",
    SELECT = "select",
    NUMBER = "number",
    DATE = "date",
    TEXTAREA = "textarea",
    RADIO = "radio",
}

const featuresSchema: Schema<IFeature> = new Schema(
    {
        name: { type: String, trim: true, required: true },
        description: { type: String, trim: true, default: "" },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            default: null
        },
        customFields: [{
            fieldName: { type: String, trim: true },
            fieldLabel: { type: String, trim: true },
            fieldType: {
                type: String,
                enum: Object.values(FieldTypes), // Enum for fieldType
            },
            options: [
                {
                    value: { type: String, trim: true },
                    label: { type: String, trim: true },
                },
            ],
            required: { type: Boolean, default: false },
            fieldValue: { type: String, trim: true },
            defaultValue: { type: String, trim: true },
        },]
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);



export const Feature = mongoose.model<IFeature>("Feature", featuresSchema);

// Validation Schemas using zod
export const FeaturesPostSchema = z.object({
    name: z.string().min(1, { message: "Category name is required" }),
    description: z.string().optional(),
    parentCategory: z.string().optional().default("")
});
