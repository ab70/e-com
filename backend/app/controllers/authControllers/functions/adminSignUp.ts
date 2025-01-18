import { User, UserRole, type IUser } from "../../../models/User";

export const adminSignupUser_func = async (data: any) => {
    try {
        const user = await User.findOne({ email: data.email || "admin@ecom.com" });
        console.log("user", user)
        
        if (user) {
            return { success: false, message: "User already exists" };
        }
        // const newUser = await User.create({
        //     email: data.email || "admin@ecom.com",
        //     password: data.password || "12345678",
        //     firstName: data.firstName || "Admin",
        //     lastName: data.lastName || "Admin",
        //     role: UserRole.ADMIN,
        //     mfaEnabled: false,
        // });
        const newUser = new User(data);
        console.log("newUser", newUser)
        
        await newUser.save();
        return { success: true, data: newUser };
    } catch (err: any) {
        console.log("err", err)
        
        return { success: false, message: err.message };
    }
};