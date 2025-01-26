import app from "../../app";
import { z} from "@hono/zod-openapi";
import { checkAdmin } from "../../middlewares/authMiddleware";
import { contentType, Delete, Get, Patch, Post } from "../../utils/swagger/methods"
import brandControllers from "../../controllers/brandControllers/brandController";
import { BrandPostSchema } from "../../models/Brand";
// Create brand
app.openapi(Post({ path: "/brand/craete", tags: ["Brand"], middleware:[checkAdmin], schema: BrandPostSchema, type: contentType.multipartFormData }), brandControllers().createBrand);
// Get brand
app.openapi(Get({ path: "/brand/get", tags: ["Brand"] }), brandControllers().getAllBrands);
// Edit brand
app.openapi(Patch({ path: "/brand/edit", query: z.object({ id: z.string() }),  tags: ["Brand"], middleware:[checkAdmin], schema: BrandPostSchema }), brandControllers().updateBrand);
// Delete brand
app.openapi(Delete({ path: "/brand/delete", query: z.object({ id: z.string() }), tags: ["Brand"], middleware:[checkAdmin] }), brandControllers().deleteBrand);
