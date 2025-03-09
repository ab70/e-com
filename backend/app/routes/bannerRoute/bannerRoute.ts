import app from "../../app";
import { z } from "@hono/zod-openapi";
import { checkAdmin, checkVendor } from "../../middlewares/authMiddleware";
import { BannerPostSchema } from "../../models/Banner";
import bannerControllers from "../../controllers/bannerControllers/bannerControllers";
import { Delete, Get, Post } from "../../utils/swagger/methods";
//***** */ Replace check vendor to checkAdmin ******
// Create brand
app.openapi(Post({ path: "/banner/craete", tags: ["Banner"], middleware: [checkVendor], schema: BannerPostSchema }), bannerControllers().createBanner);
// Get brand
app.openapi(Get({ path: "/banner/get", tags: ["Banner"] }), bannerControllers().getAllBanners);
// Delete brand
app.openapi(Delete({ path: "/banner/delete", query: z.object({ id: z.string() }), tags: ["Banner"], middleware: [checkVendor] }), bannerControllers().deleteBanner);
