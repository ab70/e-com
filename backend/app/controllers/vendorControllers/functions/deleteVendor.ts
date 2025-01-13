import type { IUser } from "../../../models/User";
import { Vendor } from "../../../models/Vendor";
import { handleError } from "../../../utils/types/errorHandle";

export const deleteVendor_func = async (userInfo: IUser, id: string) => {
    try {
        const deletedVendor = await Vendor.findByIdAndDelete(id);

        if (!deletedVendor) {
            throw new Error("Vendor not found");
        }

        return { success: true, message: "Vendor deleted successfully" };
    } catch (err: any) {
        return handleError(err);
    }
};
