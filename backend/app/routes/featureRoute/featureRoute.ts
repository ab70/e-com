import app from "../../app";
import { z } from "@hono/zod-openapi";
import { checkAdmin, checkVendor } from "../../middlewares/authMiddleware";
import { BannerPostSchema } from "../../models/Banner";
import bannerControllers from "../../controllers/bannerControllers/bannerControllers";
import { Delete, Get, Patch, Post } from "../../utils/swagger/methods";
import { FeaturesPostSchema } from "../../models/Features";
import featureControllers from "../../controllers/featureControllers/featureController";
//***** */ Replace check vendor to checkAdmin ******
// Create feature
app.openapi(Post({ path: "/feature/craete", tags: ["Feature"], middleware: [checkVendor], schema: FeaturesPostSchema }), featureControllers().createFeature);
// Update feature
app.openapi(Patch({ path: "/feature/update", query: z.object({ id: z.string() }), tags: ["Feature"], middleware: [checkVendor], schema: FeaturesPostSchema }), featureControllers().updateFeature);
// Get feature
app.openapi(Get({ path: "/feature/get", tags: ["Feature"] }), featureControllers().getAllFeatures);
// Delete feature
app.openapi(Delete({ path: "/feature/delete", query: z.object({ id: z.string() }), tags: ["Feature"], middleware: [checkVendor] }), featureControllers().deleteFeature);

