import type { Context } from "hono";
import { createContactUs_func } from "./functions/createContactUs";
import { getAllContactUs_func } from "./functions/getAllContactUs";
import { updateContactUs_func } from "./functions/editContactUs";

function contactUsControllers() {
    return {
        async createContactUs(c: Context) {
            try {
                const requestData = await c.req.json();
                const result = await createContactUs_func(requestData);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        async getAllContactUs(c: Context) {
            try {
                const page = parseInt(c.req.query("page") as string) || 1;
                const pageSize = parseInt(c.req.query("pageSize") as string) || 10;
                const all = c.req.query("all") as string || "false";
                const pagination = {
                    page,
                    pageSize,
                    all
                };
                const result = await getAllContactUs_func(pagination);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        async updateContactUs(c: Context) {
            try {
                const id = c.req.query("id") as string;
                const userInfo = c.get("user");
                const requestData = await c.req.json();
                const result = await updateContactUs_func(userInfo, id, requestData);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },
    };
}

export default contactUsControllers;
