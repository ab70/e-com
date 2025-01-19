import mongoose from "mongoose";
import { User, UserRole, type IUser } from "../../../models/User";
import { Vendor } from "../../../models/Vendor";

export const vendorAdminSignup_func = async (userInfo: IUser, data: any) => {
    try {
        const user = await User.findOne({ email: data.email || "vendor@ecom.com" });

        if (user) {
            return { success: false, message: "User already exists" };
        }
        if (userInfo.role === UserRole.SUPER_ADMIN && !data.vendor) {
            return { success: false, message: "Super admin must provide vendorId" };
        }
        const vendorId = new mongoose.Types.ObjectId(data.vendor || userInfo.vendor)
        const findVendor = await Vendor.findById(vendorId);
        if (!findVendor) {
            return { success: false, message: "Vendor not found" };
        }
        data.vendor = findVendor._id;
        const newUser = new User(data);

        await newUser.save();
        return { success: true, data: newUser };
    } catch (err: any) {
        console.log("err", err)

        return { success: false, message: err.message };
    }
};