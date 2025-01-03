import app from "../../app";
import { z} from "@hono/zod-openapi";
import categoryControllers from "../../controllers/categoryControllers/categoryControllers";
import { checkUser } from "../../middlewares/authMiddleware";
import { CategoryPostSchema } from "../../models/Category";
import { Delete, Get, Patch, Post } from "../../utils/swagger/methods"
// Create category
app.openapi(Post({ path: "/category/craete", tags: ["Category"], middleware:[checkUser], schema: CategoryPostSchema }), categoryControllers().createCategory);
// Get category
app.openapi(Get({ path: "/category/get", tags: ["Category"] }), categoryControllers().getCategories);
// Edit category
app.openapi(Patch({ path: "/category/edit", query: z.object({ id: z.string() }),  tags: ["Category"], middleware:[checkUser], schema: CategoryPostSchema }), categoryControllers().updateCategory);
// Delete category
app.openapi(Delete({ path: "/category/delete", query: z.object({ id: z.string() }), tags: ["Category"], middleware:[checkUser] }), categoryControllers().deleteCategory);
