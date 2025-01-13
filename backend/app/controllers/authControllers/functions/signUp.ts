import type { Types } from "mongoose";
import { User, UserRole, type IUser } from "../../../models/User";
import { Vendor } from "../../../models/Vendor";

export async function signupUser_func(data: IUser) {
    try {
        const { firstName, lastName, email, password, phoneNo, role } = data;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return { success: false, message: "User already exists with this email." };
        }

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password, // Hash password
            phoneNo,
            role,
        });
        let vendorInfo = null;
        if (role !== UserRole.USER && !data.vendor) {
            // Check vendor; if not present, create one and associate with the user
            const vendor = await Vendor.findOne({});
            if (!vendor) {
                const newVendor = new Vendor({
                    vendorName: "Sample Vendor",
                    vendorDetails: "",
                    vendorAddress: [],
                    vendorType: "Manufacturer", // Provide a default valid enum value
                    createdBy: newUser._id,
                    updatedBy: newUser._id,
                });
                vendorInfo =  await newVendor.save();
            }
        }
        const savedUser = await newUser.save();
        savedUser.vendor = vendorInfo?._id as Types.ObjectId;
        await savedUser.save();
        return { success: true, data: savedUser };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

