import mongoose, { Document, Schema } from "mongoose";
import { z } from "@hono/zod-openapi";

export enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    VENDOR_ADMIN = "VENDOR_ADMIN",
    MANAGER = "MANAGER",
    EMPLOYEE = "EMPLOYEE",
    USER = "USER"
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNo?: string;
    password: string;
    mfaEnabled: boolean;
    vendor?: mongoose.Types.ObjectId; // Reference to Vendor schema
    mfaSecret?: string;
    role?: string;
}

const userSchema: Schema<IUser> = new Schema(
    {
        firstName: { type: String, trim: true, required: true },
        lastName: { type: String, trim: true, required: true },
        email: { type: String, trim: true, required: true, unique: true },
        phoneNo: { type: String, trim: true, default: "" },
        password: { type: String, required: true, trim: true, select: false },
        mfaEnabled: { type: Boolean, default: false },
        vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: false, default: null },
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
        this.password = await Bun.password.hash(this.password, {
            algorithm: "bcrypt",
            cost: 4,
          });
    }
    next();
});

export const User = mongoose.model<IUser>("User", userSchema);

export const loginPostSchema = z.object({
    email: z.string().email().default("admin@ecom.com"),
    password: z.string().default("12345678"),
})
export const UserPostSchema = z.object({
    firstName: z.string(), // Optional for modification
    lastName: z.string(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    phoneNo: z.string().optional(),
    // mfaEnabled: z.boolean().optional().default(false),
    // mfaSecret: z.string().optional(),
    // role: z.nativeEnum(UserRole).optional().default(UserRole.USER), // Optional role modification
});

export const modifyUserSchema = z.object({
    firstName: z.string().optional(), // Optional for modification
    lastName: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }).optional(),
    phoneNo: z.string().optional(),
    mfaEnabled: z.boolean().optional().default(false),
});

// vendorAdmin signup
export const vendorAdminSignupSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    firstName: z.string(),
    lastName: z.string(),
    phoneNo: z.string().optional(),
    vendor: z.string().optional(),
    role: z.nativeEnum(UserRole)
        .optional()
        .default(UserRole.VENDOR_ADMIN)
        .refine(
            (role) => role !== UserRole.SUPER_ADMIN,
            { message: "SUPER_ADMIN role is not allowed" }
        ),
});