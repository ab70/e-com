import type { Context } from "hono";
import { parseToObject } from "../../utils/common/parseToObject";
import type { IProduct } from "../../models/Product";
import { createProduct_func } from "./functions/createProduct";
import { getAllProducts_func } from "./functions/getAllProducts";
import { updateProduct_func } from "./functions/editProduct";
import { deleteProduct_func } from "./functions/deleteProduct";

function productControllers() {
    return {
        // Create a new product
        async newProduct(c: Context) {
            try {
                const data = await c.req.json();
                const userInfo = c.get("user");
                const result = await createProduct_func(userInfo, data);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json(err.message, 500);
            }
        },
        // GET all products
        async getAllProducts(c: Context) {
            try {
                const page = parseInt(c.req.query("page") as string) || 1;
                const pageSize = parseInt(c.req.query("pageSize") as string) || 10;
                const all = c.req.query("all") as string || "false";
                const name = c.req.query("name") as string || "";
                const category = c.req.query("category") as string || "";
                const brand = c.req.query("brand") as string || "";
                const vendor = c.req.query("vendor") as string || "";
                const pagination = {
                    page,
                    pageSize,
                    all,
                    name,
                    category,
                    brand,
                    vendor,
                };
                // const userInfo = c.get("user");
                const result = await getAllProducts_func(pagination);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json(err.message, 500);
            }
        },
        // Update a product
        async updateProduct(c: Context) {
            try {
                const data: IProduct = await c.req.json();
                const id = c.req.query("id") as string;
                const userInfo = c.get("user");
                const result = await updateProduct_func(userInfo, id, data);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json(err.message, 500);
            }
        },
        // Delete a product
        async deleteProduct(c: Context) {
            try {
                const id = c.req.query("id") as string;
                const userInfo = c.get("user");
                const result = await deleteProduct_func(userInfo, id);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json(err.message, 500);
            }
        },
    };
}

export default productControllers;
