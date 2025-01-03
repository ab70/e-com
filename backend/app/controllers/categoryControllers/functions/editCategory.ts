import { Category, type ICategory } from "../../../models/Category";

export async function updateCategory_func(id: string, data: Partial<ICategory>) {
    try {
        const { parentCategory } = data;

        if (parentCategory) {
            const parentExists = await Category.findById(parentCategory);
            if (!parentExists) {
                return { success: false, message: "Parent category not found." };
            }
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true });

        if (!updatedCategory) {
            return { success: false, message: "Category not found." };
        }

        return { success: true, data: updatedCategory };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
