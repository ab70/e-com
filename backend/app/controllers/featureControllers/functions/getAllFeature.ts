import { Feature } from "../../../models/Features";

export const getAllFeatures_func = async () => {
    try {
        const features = await Feature.find().populate("category");
        return { success: true, message: "Found features", data: features };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};
