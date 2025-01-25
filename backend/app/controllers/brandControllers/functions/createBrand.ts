import mongoose from "mongoose";
import { Brand, type IBrand } from "../../../models/Brand";
import type { IUser } from "../../../models/User";
import { handleError } from "../../../utils/types/errorHandle";
import { saveFile } from "../../../middlewares/upload";

export async function createBrand_func(userInfo: IUser, data: IBrand, logo?: any) {
    try {
        const categoryExists = await Brand.findById(data.category);
        if (!categoryExists) {
            return { success: false, message: "Category not found.", data: null };
        }
        if (logo) {
            data.logo = await saveFile(logo);
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
