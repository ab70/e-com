import mongoose from "mongoose";
import { Banner } from "../../../models/Banner";
import { handleError } from "../../../utils/types/errorHandle";

export async function deleteBanner_func(bannerId: string) {
    try {
        if (!mongoose.Types.ObjectId.isValid(bannerId)) {
            return { success: false, message: "Invalid banner ID" };
        }

        const banner = await Banner.findByIdAndDelete(bannerId);
        if (!banner) {
            return { success: false, message: "Banner not found" };
        }

        return { success: true, message: "Banner deleted successfully" };
    } catch (error: any) {
        return handleError(error);
    }
}
