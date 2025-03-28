import mongoose from "mongoose";
import { Brand, type IBrand } from "../../../models/Brand";
import type { IUser } from "../../../models/User";
import { handleError } from "../../../utils/types/errorHandle";
import { Category } from "../../../models/Category";

export async function createBrand_func(userInfo: IUser, data: IBrand) {
    try {
        const categoryId = new mongoose.Types.ObjectId(data.category);
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return { success: false, message: "Category not found.", data: null };
        }
        data.createdBy = new mongoose.Types.ObjectId(userInfo._id as string);
        data.updatedBy = new mongoose.Types.ObjectId(userInfo._id as string);
        const brand = new Brand(data);
        const savedBrand = await brand.save();

        return { success: true, message: "Brand created successfully", data: savedBrand };
    } catch (error: any) {
        return handleError(error);
    }
}
