import { Category } from "../../../models/Category";

export async function deleteCategory_func(id: string) {
    try {
        const category = await Category.findById(id);

        if (!category) {
            return { success: false, message: "Category not found." };
        }

        // Check if the category is a parent to any other categories
        const isParent = await Category.findOne({ parentCategory: id });
        if (isParent) {
            return { success: false, message: "Cannot delete category with subcategories." };
        }

        await Category.findByIdAndDelete(id);

        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
