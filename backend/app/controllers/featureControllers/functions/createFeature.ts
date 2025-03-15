import { Feature, type IFeature } from "../../../models/Features";

export const createFeature_func = async (featureData: IFeature) => {
    try {
        const newFeature = new Feature(featureData);
        await newFeature.save();
        return { success: true, message: "Feature created successfully", data: newFeature, };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};
