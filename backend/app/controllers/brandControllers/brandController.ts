import type { Context } from "hono";
import { createBrand_func } from "./functions/createBrand";
import { getAllBrands_func } from "./functions/getAllBrnads";
import { updateBrand_func } from "./functions/editBrand";
import { deleteBrand_func } from "./functions/deleteBrand";
import type { IBrand } from "../../models/Brand";
import { parseToObject } from "../../utils/common/parseToObject";

function brandControllers() {
    return {
        async createBrand(c: Context) {
            try {
                const userInfo = c.get("user");
                const others = await c.req.json();
                const result = await createBrand_func(userInfo, others);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        async getAllBrands(c: Context) {
            try {
                const result = await getAllBrands_func();
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        async updateBrand(c: Context) {
            try {
                const id = c.req.query("id") as string;
                const userInfo = c.get("user");
                const others = await c.req.json();
                // const data: IBrand = parseToObject(others) as IBrand;
                const result = await updateBrand_func(userInfo, id, others);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        async deleteBrand(c: Context) {
            try {
                const id = c.req.query("id") as string;
                const result = await deleteBrand_func(id);
                return c.json(result, result.success ? 200 : 400);

            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },
    };
}

export default brandControllers;
