import mongoose from "mongoose";
import { ContactUs, type IContactUs } from "../../../models/ContactUs";
import { handleError } from "../../../utils/types/errorHandle";
import { Product } from "../../../models/Product";

export async function createContactUs_func(data: IContactUs) {
    try {
        const productId = data.product ? new mongoose.Types.ObjectId(data.product) : null;
        if (productId) {
            const productExists = await Product.findById(productId);
            if (!productExists) {
                return { success: false, message: "Product not found.", data: null };
            }
        }
        const contactUsEntry = new ContactUs(data);
        const savedContactUs = await contactUsEntry.save();

        return { success: true, message: "Contact Us entry created successfully", data: savedContactUs };
    } catch (error: any) {
        return handleError(error);
    }
}
