import app from "../../app";
import { z } from "@hono/zod-openapi";
import categoryControllers from "../../controllers/categoryControllers/categoryControllers";
import { checkAdmin } from "../../middlewares/authMiddleware";
import { CategoryPostSchema } from "../../models/Category";
import { Delete, Get, Patch, Post } from "../../utils/swagger/methods"
//***** */ Replace checkVendor to checkAdmin ******
// Create category
app.openapi(Post({ path: "/category/craete", tags: ["Category"], middleware: [checkAdmin], schema: CategoryPostSchema }), categoryControllers().createCategory);
// Get category
app.openapi(Get({ path: "/category/get", tags: ["Category"] }), categoryControllers().getCategories);
// Edit category
app.openapi(Patch({ path: "/category/edit", query: z.object({ id: z.string() }), tags: ["Category"], middleware: [checkAdmin], schema: CategoryPostSchema }), categoryControllers().updateCategory);
// Delete category
app.openapi(Delete({ path: "/category/delete", query: z.object({ id: z.string() }), tags: ["Category"], middleware: [checkAdmin] }), categoryControllers().deleteCategory);
