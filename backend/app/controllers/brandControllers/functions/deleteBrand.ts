import mongoose from "mongoose";
import { Brand } from "../../../models/Brand";
import { handleError } from "../../../utils/types/errorHandle";

export async function deleteBrand_func(id: string) {
    try {
        const brandId = new mongoose.Types.ObjectId(id);
        const deletedBrand = await Brand.findByIdAndDelete(id);
        if (!deletedBrand) {
            return { success: false, message: "Brand not found." };
        }

        return { success: true, message: "Brand deleted successfully" };
    } catch (error: any) {
        return handleError(error);
    }
}
