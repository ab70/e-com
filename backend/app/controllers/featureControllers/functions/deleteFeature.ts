import mongoose from "mongoose";
import { Feature } from "../../../models/Features";

export const deleteFeature_func = async (id: string) => {
    try {
        const fid = new mongoose.Types.ObjectId(id);
        const deletedFeature = await Feature.findByIdAndDelete(fid);
        if (!deletedFeature) {
            return { success: false, message: "Feature not found" };
        }
        return { success: true, message: "Feature deleted successfully", data: deleteFeature_func };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};
