import app from "../../app";
import { z} from "@hono/zod-openapi";
import { checkUser } from "../../middlewares/authMiddleware";
import { contentType, Delete, Get, Patch, Post } from "../../utils/swagger/methods"
import { OrderPostSchema } from "../../models/Order";
import orderControllers from "../../controllers/orderControllers/orderController";

// Create order
app.openapi(Post({ path: "/order/craete", tags: ["Order"], middleware:[checkUser], schema: OrderPostSchema }), orderControllers().createOrder);
// Get all orders
app.openapi(Get({ path: "/order/get", query: z.object({ page: z.number().min(1), pageSize: z.number().min(1), all: z.string().optional().default("false") }), tags: ["Order"] }), orderControllers().getAllOrders);
// Get order info
app.openapi(Get({ path: "/order/info", query: z.object({ id: z.string() }), tags: ["Order"] }), orderControllers().getOrderInfo);
// Modify order by super admin
app.openapi(Patch({ path: "/order/modify", query: z.object({ id: z.string() }),  tags: ["Order"], middleware:[checkUser], schema: OrderPostSchema }), orderControllers().adminModifyOrder);

