import mongoose from "mongoose";
import { Product, type IProduct } from "../../../models/Product";
import  { type IUser } from "../../../models/User";
import { handleError } from "../../../utils/types/errorHandle";

export const createProduct_func = async (userInfo: IUser, data: IProduct) => {
    try {
        // Populate createdBy and updatedBy and vendor
        data.createdBy = new mongoose.Types.ObjectId(userInfo._id as string);
        data.updatedBy = new mongoose.Types.ObjectId(userInfo._id as string);
        
        data.vendor = new mongoose.Types.ObjectId(userInfo?.vendor)
        console.log("Data", data);
        // if features is not array or objects then delete it
        if(Array.isArray(data?.features)){
            delete data.features;
        }
        const newProduct = new Product(data);
        await newProduct.save();

        return { success: true, message: "Product created successfully", data: newProduct };
    } catch (err: any) {
        return handleError(err);
    }
};
