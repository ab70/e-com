import type { Context } from "hono";
import { getAllFinanceReq_func } from "./functions/getFinanceReq";
import { createFinanceReq_func } from "./functions/createFinanceReq";
import { updateFinanceReq_func } from "./functions/editFinanceReq";

function financeControllers() {
    return {
        async createFinance(c: Context) {
            try {
                const userInfo = c.get("user");
                const requestData = await c.req.json();
                const result = await createFinanceReq_func(userInfo, requestData);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        async getAllFinances(c: Context) {
            try {
                const pagination = c.req.query();
                const result = await getAllFinanceReq_func(pagination);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        async updateFinance(c: Context) {
            try {
                const id = c.req.query("id") as string;
                const userInfo = c.get("user");
                const requestData = await c.req.json();
                const result = await updateFinanceReq_func(userInfo, id, requestData);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },
    };
}

export default financeControllers;
