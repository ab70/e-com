import mongoose from "mongoose";
import { Category, type ICategory } from "../../../models/Category";
import { handleError } from "../../../utils/types/errorHandle";

export async function createCategory_func(data: ICategory) {
    try {
        const parentCat = mongoose.isValidObjectId(data.parentCategory);
        console.log("parentCat", parentCat)

        if (parentCat) {
            const parentExists = await Category.findById(new mongoose.Types.ObjectId(data.parentCategory));
            if (!parentExists) {
                return { success: false, message: "Parent category not found.", data: null };
            }
        } else {
            delete data.parentCategory
        }

        const category = new Category(data);
        const savedCategory = await category.save();

        return { success: true, message: "Category created successfully", data: savedCategory };
    } catch (error: any) {
        return handleError(error);
    }
}
