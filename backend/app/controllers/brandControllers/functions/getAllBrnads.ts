import { Brand } from "../../../models/Brand";
import { handleError } from "../../../utils/types/errorHandle";

export async function getAllBrands_func() {
    try {
        const brand = await Brand.find({}).populate("category");
        if (!brand) {
            return { success: false, message: "Brand not found.", data: null };
        }

        return { success: true, message: "Brand found", data: brand };
    } catch (error: any) {
        return handleError(error);
    }
}
