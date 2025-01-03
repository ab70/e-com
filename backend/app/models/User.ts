import mongoose, { Document, Schema } from "mongoose";
// import bcrypt from "bcrypt";
import { z } from "@hono/zod-openapi";

export enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    USER = "USER"
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNo?: string;
    password: string;
    mfaEnabled: boolean;
    mfaSecret?: string;
    role: string;
}

const userSchema: Schema<IUser> = new Schema(
    {
        firstName: { type: String, trim: true, required: true },
        lastName: { type: String, trim: true, required: true },
        email: { type: String, trim: true, required: true, unique: true },
        phoneNo: { type: String, trim: true, default: "" },
        password: { type: String, required: true, trim: true, select: false },
        mfaEnabled: { type: Boolean, default: false },
        mfaSecret: { type: String, select: false },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: "USER",
        },
    },
    {
        timestamps: true,
    }
);

// Hash the password before saving
userSchema.pre<IUser>("save", async function (next) {
    if (this.isModified("password")) {
        // const salt = await bcrypt.genSalt(10);
        // this.password = await bcrypt.hash(this.password, salt);
        this.password = await Bun.password.hash(this.password, {
            algorithm: "bcrypt",
            cost: 4,
          });
    }
    next();
});

export const User = mongoose.model<IUser>("User", userSchema);

export const loginPostSchema = z.object({
    email: z.string().email().default("user@example.com"),
    password: z.string().default("stringst"),
})
export const UserPostSchema = z.object({
    firstName: z.string(), // Optional for modification
    lastName: z.string(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    phoneNo: z.string().optional(),
    mfaEnabled: z.boolean().optional().default(false),
    mfaSecret: z.string().optional(),
    // role: z.nativeEnum(UserRole).optional().default(UserRole.USER), // Optional role modification
});

export const modifyUserSchema = z.object({
    firstName: z.string().optional(), // Optional for modification
    lastName: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }).optional(),
    phoneNo: z.string().optional(),
    mfaEnabled: z.boolean().optional().default(false),
    mfaSecret: z.string().optional(),
    // role: z.nativeEnum(UserRole).optional().default(UserRole.USER), // Optional role modification
});