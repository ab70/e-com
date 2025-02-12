import { saveFile } from "../../../middlewares/upload";
import { Vendor } from "../../../models/Vendor";
import { handleError } from "../../../utils/types/errorHandle";
import type { IUser } from "../../../models/User";

export const createVendor_func = async (userInfo: IUser, data: any, logo?: any) => {
    try {
        // Populate createdBy and updatedBy
        data.createdBy = userInfo._id;
        data.updatedBy = userInfo._id;

        const newVendor = new Vendor(data);
        await newVendor.save();

        return { success: true, message: "Vendor created successfully", data: newVendor };
    } catch (err: any) {
        return handleError(err);
    }
};
