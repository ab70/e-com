import type { IUser } from "../../../models/User";
import { Vendor } from "../../../models/Vendor";
import { handleError } from "../../../utils/types/errorHandle";

export const getAllVendors_func = async (userInfo: IUser, pagination: any) => {
    try {
        const { page, pageSize, all } = pagination;
        const query = all === "true" ? {} : { };

        const vendors = await Vendor.find(query)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .exec();

        const total = await Vendor.countDocuments(query).exec();

        return {
            success: true,
            message: "Vendors retrieved successfully",
            data: { vendors, total, page, pageSize },
        };
    } catch (err: any) {
        return handleError(err);
    }
};
