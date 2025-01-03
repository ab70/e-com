
import { User } from "../../../models/User";

export async function signinUser_func(data: any) {
    try {
        const { email, password } = data;

        const user = await User.findOne({ email }).select("+password"); // Include password for comparison

        if (!user) {
            return { success: false, message: "User not found." };
        }

        const isPasswordValid = await Bun.password.verify(password, user.password);
        if (!isPasswordValid) {
            return { success: false, message: "Invalid email or password." };
        }

        // Remove password from the response
        const { password: _, ...userWithoutPassword } = user.toObject();

        return { success: true, message: "Login successful.", data: userWithoutPassword };
    } catch (error: any) {
        console.log(error);
        
        return { success: false, message: error.message };
    }
}
