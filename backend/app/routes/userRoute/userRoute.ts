import app from "../../app";
import { z } from "@hono/zod-openapi";
import { checkUser } from "../../middlewares/authMiddleware";
import { Get } from "../../utils/swagger/methods"
import vendorControllers from "../../controllers/vendorControllers/vendorController";
import userControllers from "../../controllers/userControllers/userController";

// Get users
app.openapi(Get({
    path: "/user/get",
    query: z.object({
        page: z.string().default("1"),
        pageSize: z.string().min(1).default("10"),
        all: z.string().optional().default("false"),
        vendor: z.string().optional(),
        role: z.string().optional(),
    }),
    tags: ["User"],
    middleware: [checkUser]
}),
    userControllers().getUsers
);
app.openapi(Get({ path: "/vendor/get", query: z.object({ page: z.string().default("1"), pageSize: z.string().min(1).default("10"), all: z.string().optional().default("false") }), tags: ["Vendor"] }), vendorControllers().getAllVendors);
