import mongoose from "mongoose";
import { Category, type ICategory } from "../../../models/Category";

export async function createCategory_func(data: ICategory) {
    try {
        const parentCat = mongoose.isValidObjectId(data.parentCategory);
        if (parentCat) {
            const parentExists = await Category.findById(parentCat);
            if (!parentExists) {
                return { success: false, message: "Parent category not found." };
            }
        }else {
            delete data.parentCategory
        }

        const category = new Category(data);
        const savedCategory = await category.save();

        return { success: true, data: savedCategory };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
