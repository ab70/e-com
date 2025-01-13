import type { IUser } from "../../../models/User";
import { Vendor } from "../../../models/Vendor";
import { handleError } from "../../../utils/types/errorHandle";

export const updateVendor_func = async (userInfo: IUser, id: string, data: any) => {
    try {
        const updatedVendor = await Vendor.findByIdAndUpdate(
            id,
            { ...data, updatedBy: userInfo._id },
            { new: true }
        );

        if (!updatedVendor) {
            throw new Error("Vendor not found");
        }

        return { success: true, message: "Vendor updated successfully", data: updatedVendor };
    } catch (err: any) {
        return handleError(err);
    }
};
