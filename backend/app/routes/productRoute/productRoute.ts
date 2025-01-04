import app from "../../app";
import { z} from "@hono/zod-openapi";
import { checkUser } from "../../middlewares/authMiddleware";
import { contentType, Delete, Get, Patch, Post } from "../../utils/swagger/methods"
import { ProductPostSchema } from "../../models/Product";
import productControllers from "../../controllers/productControllers/productController";

// Create Product
app.openapi(Post({ path: "/product/craete", tags: ["Product"], middleware:[checkUser], schema: ProductPostSchema, type: contentType.multipartFormData }), productControllers().newProduct);
// Get All product
app.openapi(Get({ path: "/product/get", query: z.object({ page: z.number().min(1), pageSize: z.number().min(1), all: z.string().optional().default("false") }), tags: ["Product"] }), productControllers().getAllProducts);
// Edit product
app.openapi(Patch({ path: "/product/edit", query: z.object({ id: z.string() }),  tags: ["Product"], middleware:[checkUser], schema: ProductPostSchema, type: contentType.multipartFormData }), productControllers().updateProduct);
// Delete product
app.openapi(Delete({ path: "/product/delete", query: z.object({ id: z.string() }), tags: ["Product"], middleware:[checkUser] }), productControllers().deleteProduct);
