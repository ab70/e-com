import app from "../../app";
import { z } from "@hono/zod-openapi";
import { checkVendor } from "../../middlewares/authMiddleware";
import { Get, Patch, Post } from "../../utils/swagger/methods"


import financeControllers from "../../controllers/financeControllers/financeController";
import { FinancePostSchema } from "../../models/Finance";

// Create finance request
app.openapi(Post({ path: "/finance/craete", tags: ["Finance Request"], schema: FinancePostSchema }), financeControllers().createFinance);
// Get all finance requests
app.openapi(Get({ path: "/finance/get", tags: ["Finance Request"], middleware: [checkVendor] }), financeControllers().getAllFinances);
// Edit finance request
app.openapi(Patch({ path: "/finance/edit", query: z.object({ id: z.string() }), tags: ["Finance Request"], middleware: [checkVendor], schema: FinancePostSchema }), financeControllers().updateFinance);
