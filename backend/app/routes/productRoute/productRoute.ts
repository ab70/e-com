import app from "../../app";
import { z } from "@hono/zod-openapi";
import { checkVendor } from "../../middlewares/authMiddleware";
import { contentType, Delete, Get, Patch, Post } from "../../utils/swagger/methods"
import { ProductPostSchema } from "../../models/Product";
import productControllers from "../../controllers/productControllers/productController";

// Create Product
app.openapi(Post({ path: "/product/craete", tags: ["Product"], middleware: [checkVendor], schema: ProductPostSchema, type: contentType.multipartFormData }), productControllers().newProduct);
// Get All product
app.openapi(Get({
    path: "/product/get",
    query: z.object({
        page: z.string().default("1"),
        pageSize: z.string().default("10"),
        all: z.string().optional().default("false"),
        query: z.object({
            category: z.string().optional(),
            brand: z.string().optional(),
            vendor: z.string().optional()
        }).optional().default({})
    }), tags: ["Product"]
}), productControllers().getAllProducts);
// Edit product
app.openapi(Patch({ path: "/product/edit", query: z.object({ id: z.string() }), tags: ["Product"], middleware: [checkVendor], schema: ProductPostSchema, type: contentType.multipartFormData }), productControllers().updateProduct);
// Delete product
app.openapi(Delete({ path: "/product/delete", query: z.object({ id: z.string() }), tags: ["Product"], middleware: [checkVendor] }), productControllers().deleteProduct);
