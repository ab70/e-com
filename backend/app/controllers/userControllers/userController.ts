import type { Context } from "hono";
import { getUsers_func } from "./functions/getUsers";

function userControllers() {
    return {
        //get users
        async getUsers(c: Context) {
            try {
                const userInfo = await c.get("user");
                const queries = {
                    vendor: c.req.query("vendor") as string,
                    role: c.req.query("role") as string,
                }
                const pagination = {
                    page: parseInt(c.req.query("page") as string) || 1,
                    pageSize: parseInt(c.req.query("pageSize") as string) || 10,
                    all: c.req.query("all") as string || "false",
                }

                const result = await getUsers_func(userInfo, queries, pagination);

                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

    }
}

export default userControllers;