import type { Context } from "hono";
import { createFeature_func } from "./functions/createFeature";
import { getAllFeatures_func } from "./functions/getAllFeature";
import { updateFeature_func } from "./functions/editFeature";
import { deleteFeature_func } from "./functions/deleteFeature";

function featureControllers() {
    return {
        async createFeature(c: Context) {
            try {
                const featureData = await c.req.json();
                const result = await createFeature_func(featureData);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        async getAllFeatures(c: Context) {
            try {
                const result = await getAllFeatures_func();
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        async updateFeature(c: Context) {
            try {
                const id = c.req.query("id") as string;
                const featureData = await c.req.json();
                const result = await updateFeature_func(id, featureData);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        async deleteFeature(c: Context) {
            try {
                const id = c.req.query("id") as string;
                const result = await deleteFeature_func(id);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },
    };
}

export default featureControllers;
