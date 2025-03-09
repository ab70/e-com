import { Banner } from "../../../models/Banner";
import { handleError } from "../../../utils/types/errorHandle";

export async function getAllBanners_func() {
    try {
        const banners = await Banner.find().lean();
        return { success: true, message: "Banners found", data: banners };
    } catch (error: any) {
        return handleError(error);
    }
}
