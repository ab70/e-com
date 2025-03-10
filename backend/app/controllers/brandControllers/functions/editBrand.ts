import mongoose from "mongoose";
import { Brand, type IBrand } from "../../../models/Brand";
import type { IUser } from "../../../models/User";
import { handleError } from "../../../utils/types/errorHandle";

export async function updateBrand_func(userInfo: IUser, id: string, data: Partial<IBrand>, logo?: any) {
    try {
        const brandId = new mongoose.Types.ObjectId(id);
        const findBrnad = await Brand.findById(brandId);
        if (!findBrnad) {
            return { success: false, message: "Brand not found.", data: null };
        }
        
        data.updatedBy = new mongoose.Types.ObjectId(userInfo._id as string);
        console.log("daata", data);
        const updatedBrand = await Brand.findByIdAndUpdate(brandId, data, { new: true });
        return { success: true, message: "Brand updated successfully", data: updatedBrand };
    } catch (error: any) {
        return handleError(error);
    }
}
