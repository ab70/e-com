import mongoose from "mongoose";
import { Category } from "../../../models/Category";

export async function getCategory_func(id: string) {
    try {
        const catId = new mongoose.Types.ObjectId(id);
        const category = await Category.findById(id).populate("parentCategory");

        if (!category) {
            return { success: false, message: "Category not found." };
        }

        return { success: true, data: category };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
