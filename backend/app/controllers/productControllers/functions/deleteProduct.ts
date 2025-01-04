import mongoose from "mongoose";
import { Product } from "../../../models/Product";
import type { IUser } from "../../../models/User";
import { handleError } from "../../../utils/types/errorHandle";

export const deleteProduct_func = async (userInfo: IUser, id: string) => {
    try {
        // delete product
        const prodid = new mongoose.Types.ObjectId(id);
        await Product.findByIdAndDelete(prodid);
        return { success: true, message: "Product deleted successfully" };
    } catch (err: any) {
        return handleError(err);
    }
};
