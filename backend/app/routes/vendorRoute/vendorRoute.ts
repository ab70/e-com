import app from "../../app";
import { z } from "@hono/zod-openapi";
import { checkAdmin, checkUser, checkVendor } from "../../middlewares/authMiddleware";
import { contentType, Delete, Get, Patch, Post } from "../../utils/swagger/methods"
import { VendorPostSchema } from "../../models/Vendor";
import vendorControllers from "../../controllers/vendorControllers/vendorController";

// Create Vendor
app.openapi(Post({ path: "/vendor/craete", tags: ["Vendor"], middleware: [checkAdmin], schema: VendorPostSchema, type: contentType.multipartFormData }), vendorControllers().newVendor);
// Get all vendor
app.openapi(Get({ path: "/vendor/get", query: z.object({ page: z.string().default("1"), pageSize: z.string().min(1).default("10"), all: z.string().optional().default("false") }), tags: ["Vendor"] }), vendorControllers().getAllVendors);
// Edit vendor
app.openapi(Patch({ path: "/vendor/edit", query: z.object({ id: z.string() }), tags: ["Vendor"], middleware: [checkVendor], schema: VendorPostSchema, type: contentType.multipartFormData }), vendorControllers().updateVendor);
// Delete vendor
app.openapi(Delete({ path: "/vendor/delete", query: z.object({ id: z.string() }), tags: ["Vendor"], middleware: [checkAdmin] }), vendorControllers().deleteVendor);
