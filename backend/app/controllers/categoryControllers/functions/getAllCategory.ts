import { Category } from "../../../models/Category";
import { handleError } from "../../../utils/types/errorHandle";

export async function getAllCategory_func() {
    try {
        // Fetch all categories from the database
        const categories = await Category.find({}).lean(); // Use `lean` for better performance

        if (!categories || categories.length === 0) {
            return { success: false, message: "No categories found." };
        }

        // Build a map and simultaneously organize categories
        const categoryMap: { [key: string]: any } = {};
        const nestedCategories: any[] = [];

        // Single loop with `for` for better performance
        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];
            const categoryId = category._id.toString(); // Ensure `_id` is a string
            const parentId = category.parentCategory?.toString(); // Convert `parentCategory` if exists

            // Initialize the category object with subCategories
            if (!categoryMap[categoryId]) {
                categoryMap[categoryId] = { ...category, subCategories: [] };
            }

            const currentCategory = categoryMap[categoryId];

            if (parentId) {
                // Add current category to its parent's subCategories
                if (!categoryMap[parentId]) {
                    categoryMap[parentId] = { subCategories: [] };
                }
                categoryMap[parentId].subCategories.push(currentCategory);
            } else {
                // If no parent, add to top-level categories
                nestedCategories.push(currentCategory);
            }
        }

        return {
            success: true,
            message: "Categories retrieved successfully.",
            data: nestedCategories,
        };
    } catch (error: any) {
        return handleError(error);
    }
}

