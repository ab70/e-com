import mongoose from "mongoose";
import { Feature, type IFeature } from "../../../models/Features";

export const updateFeature_func = async (id: string, updateData: Partial<IFeature>) => {
    try {
        const fid = new mongoose.Types.ObjectId(id);
        const updatedFeature = await Feature.findByIdAndUpdate(fid, updateData, { new: true });
        if (!updatedFeature) {
            return { success: false, message: "Feature not found" };
        }
        return { success: true, data: updatedFeature, message: "Feature updated successfully" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};
