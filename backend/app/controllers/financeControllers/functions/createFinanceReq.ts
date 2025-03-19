import mongoose from "mongoose";
import { Finance, type IFinance } from "../../../models/Finance";
import type { IUser } from "../../../models/User";
import { handleError } from "../../../utils/types/errorHandle";
import { Product } from "../../../models/Product";

export async function createFinanceReq_func(userInfo: IUser, data: IFinance) {
    try {
        // if(data.product.productId){

        // }
        // const productId = new mongoose.Types.ObjectId(data.product.productId);
        // const productExists = await Product.findById(productId);
        // if (!productExists) {
        //     return { success: false, message: "Product not found.", data: null };
        // }
        const financeEntry = new Finance(data);
        const savedFinance = await financeEntry.save();

        return { success: true, message: "Finance entry created successfully", data: savedFinance };
    } catch (error: any) {
        return handleError(error);
    }
}
