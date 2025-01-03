import { Category } from "../../../models/Category";

export async function getAllCategory_func() {
    try {
        // const catId = new mongoose.Types.ObjectId(id);
        const category = await Category.find({}).populate("parentCategory");

        if (!category) {
            return { success: false, message: "Category not found." };
        }

        return { success: true, message:"Category found", data:category };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
