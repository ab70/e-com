import type { Context } from "hono";
import { parseToObject } from "../../utils/common/parseToObject";
import { createVendor_func } from "./functions/createVendor";
import { getAllVendors_func } from "./functions/getAllVendors";
import { updateVendor_func } from "./functions/editVendor";
import { deleteVendor_func } from "./functions/deleteVendor";

function vendorControllers() {
    return {
        // Create a new vendor
        async newVendor(c: Context) {
            try {
                const { logo, ...others } = await c.req.parseBody({ all: true });
                console.log("others", others);

                const data = parseToObject(others);
                const userInfo = c.get("user");
                const result = await createVendor_func(userInfo, data, logo);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json(err.message, 500);
            }
        },
        // GET all vendors
        async getAllVendors(c: Context) {
            try {
                const page = parseInt(c.req.query("page") as string) || 1;
                const pageSize = parseInt(c.req.query("pageSize") as string) || 10;
                const all = c.req.query("all") as string || "false";
                const pagination = { page, pageSize, all };
                const userInfo = c.get("user");
                const result = await getAllVendors_func(userInfo, pagination);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json(err.message, 500);
            }
        },
        // Update a vendor
        async updateVendor(c: Context) {
            try {
                const data = await c.req.json();
                const id = c.req.query("id") as string;
                const userInfo = c.get("user");
                const result = await updateVendor_func(userInfo, id, data);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json(err.message, 500);
            }
        },
        // Delete a vendor
        async deleteVendor(c: Context) {
            try {
                const id = c.req.query("id") as string;
                const userInfo = c.get("user");
                const result = await deleteVendor_func(userInfo, id);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json(err.message, 500);
            }
        },
    };
}

export default vendorControllers;
