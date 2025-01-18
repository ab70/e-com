import type { Context } from "hono";
import { createCategory_func } from "./functions/createCategory";
import { updateCategory_func } from "./functions/editCategory";
import { deleteCategory_func } from "./functions/deletecategory";
import { getCategory_func } from "./functions/getCategoryById";
import { getAllCategory_func } from "./functions/getAllCategory";

function categoryControllers() {
    return {
        // Create Category
        async createCategory(c: Context) {
            try {
                const data = await c.req.json();
                console.log("data", data)
                
                const result = await createCategory_func(data);
                if (!result.success) {
                    return c.json({ success: false, message: result.message }, 400);
                }
                return c.json({ success: true, message: "Category created successfully", category: result.data || null });
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        // Get Category by ID
        async getCategory(c: Context) {
            try {
                const id = c.req.param("id");
                const result = await getCategory_func(id);

                if (!result.success) {
                    return c.json({ success: false, message: result.message }, 404);
                }

                return c.json({ success: true, message: "Category found", category: result.data });
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        // Update Category
        async updateCategory(c: Context) {
            try {
                const id = c.req.param("id");
                const data = await c.req.json();
                const result = await updateCategory_func(id, data);

                if (!result.success) {
                    return c.json({ success: false, message: result.message }, 400);
                }

                return c.json({ success: true, message: "Category updated successfully", category: result.data });
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        // Delete Category
        async deleteCategory(c: Context) {
            try {
                const id = c.req.param("id");
                const result = await deleteCategory_func(id);

                if (!result.success) {
                    return c.json({ success: false, message: result.message }, 404);
                }

                return c.json({ success: true, message: "Category deleted successfully" });
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },
        // get all categories
        async getCategories(c: Context) {
            try {
                // const id = c.req.param("id");
                const result = await getAllCategory_func();

                if (!result.success) {
                    return c.json({ success: false, message: result.message }, 404);
                }

                return c.json({ success: true, message: "Category found", category: result.data });
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },
    };
}

export default categoryControllers;
