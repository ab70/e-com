import mongoose, { Schema, Document } from "mongoose";
import { z } from "@hono/zod-openapi";
import { UserRole } from "./User";

export interface IFile extends Document {
    serverPath: string;
    filename: string;
    userId: mongoose.Types.ObjectId;
    vendorId?: mongoose.Types.ObjectId;
    role: UserRole;
    createdAt: Date;
}

const fileSchema = new Schema<IFile>(
    {
        serverPath: { type: String, trim: true, required: false, default: "" },
        filename: { type: String, trim: true, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        vendorId: { type: mongoose.Types.ObjectId, ref: "Vendor" },
        role: { type: String, enum: Object.values(UserRole), required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const File = mongoose.model<IFile>("File", fileSchema);

export const filePostSchema = z.object({
    assets: z
        .union([
            z.array(z.any().openapi({ type: "string", format: "binary" })),
            z.any().openapi({ type: "string", format: "binary" }),
        ])
        .transform((value) => (Array.isArray(value) ? value : [value]))
        .optional()
});
export const deleteFilesPostSchema = z.object({
    fileNames: z.array(z.string()).optional()
});

