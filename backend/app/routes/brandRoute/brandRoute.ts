import app from "../../app";
import { z} from "@hono/zod-openapi";
import categoryControllers from "../../controllers/categoryControllers/categoryControllers";
import { checkUser } from "../../middlewares/authMiddleware";
import { CategoryPostSchema } from "../../models/Category";
import { Delete, Get, Patch, Post } from "../../utils/swagger/methods"
import brandControllers from "../../controllers/brandControllers/brandController";
// Create brand
app.openapi(Post({ path: "/brand/craete", tags: ["Brand"], middleware:[checkUser], schema: CategoryPostSchema }), brandControllers().createBrand);
// Get brand
app.openapi(Get({ path: "/brand/get", tags: ["Brand"] }), brandControllers().getAllBrands);
// Edit brand
app.openapi(Patch({ path: "/brand/edit", query: z.object({ id: z.string() }),  tags: ["Brand"], middleware:[checkUser], schema: CategoryPostSchema }), brandControllers().updateBrand);
// Delete brand
app.openapi(Delete({ path: "/brand/delete", query: z.object({ id: z.string() }), tags: ["Brand"], middleware:[checkUser] }), brandControllers().deleteBrand);
