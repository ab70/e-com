import type { Context } from "hono";
import { createOrder_func } from "./functions/createOrder";
import { getAllOrders_func } from "./functions/getAllOrders";
import { getOrderInfo_func } from "./functions/getOrderInfo";
import { adminModifyOrder_func } from "./functions/adminModifyOrder";

function orderControllers() {
    return {
        async createOrder(c: Context) {
            try {
                const data = await c.req.json();
                const userInfo = await c.get("user");
                const result = await createOrder_func(userInfo, data);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },
        // GET ALL ORDERS
        async getAllOrders(c: Context) {
            try {
                const page = parseInt(c.req.query("page") || "1", 10);
                const pageSize = parseInt(c.req.query("pageSize") || "10", 10);
                const result = await getAllOrders_func(page, pageSize);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        async getOrderInfo(c: Context) {
            try {
                const id = c.req.query("id") as string;
                const result = await getOrderInfo_func(id);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        async adminModifyOrder(c: Context) {
            try {
                const id = c.req.query("id") as string;
                const data = await c.req.json();
                const result = await adminModifyOrder_func(id, data);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },
    };
}

export default orderControllers;
