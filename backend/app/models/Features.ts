import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";
export interface ICustomField {
    fieldName: string;
    fieldLabel: string;
    fieldType: FieldTypes;
    options?: {
        value: string;
        label: string;
    }[];
    required?: boolean;
    fieldValue?: string;
    defaultValue?: string;
}
export interface IFeature extends Document {
    name: string;
    description?: string;
    category?: mongoose.Types.ObjectId;
    customFields?: ICustomField[];
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
            required: true
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


featuresSchema.index({ category: 1, }, { unique: true });
export const Feature = mongoose.model<IFeature>("Feature", featuresSchema);

// Validation Schemas using zod
export const FeaturesPostSchema = z.object({
    name: z.string().min(1, { message: "Feature name is required" }),
    description: z.string().optional(),
    category: z.string().min(1, { message: "Category ID is required" }).optional(),
    customFields: z.array(
        z.object({
            fieldName: z.string().min(1, { message: "Field name is required" }),
            fieldLabel: z.string().min(1, { message: "Field label is required" }),
            fieldType: z.enum(Object.values(FieldTypes) as [FieldTypes, ...FieldTypes[]]),
            options: z.array(
                z.object({
                    value: z.string().min(1, { message: "Option value is required" }),
                    label: z.string().min(1, { message: "Option label is required" }),
                })
            ).optional(),
            required: z.boolean().optional().default(false),
            fieldValue: z.string().optional(),
            defaultValue: z.string().optional(),
        })
    ).optional(),
});

