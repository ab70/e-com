import type { Context } from "hono";

import type { IBanner } from "../../models/Banner";
import { parseToObject } from "../../utils/common/parseToObject";
import { createBanner_func } from "./functions/createBanner";
import { getAllBanners_func } from "./functions/getAllBanner";
import { deleteBanner_func } from "./functions/deleteBanner";

function bannerControllers() {
    return {
        async createBanner(c: Context) {
            try {
                const userInfo = c.get("user");
                const others = await c.req.json();
                const result = await createBanner_func(userInfo, others);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        async getAllBanners(c: Context) {
            try {
                const result = await getAllBanners_func();
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        async deleteBanner(c: Context) {
            try {
                const id = c.req.query("id") as string;
                const result = await deleteBanner_func(id);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },
    };
}

export default bannerControllers;
