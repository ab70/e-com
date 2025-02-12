import mongoose from "mongoose";
import { saveFile } from "../../../middlewares/upload";
import { Product } from "../../../models/Product";
import type { IUser } from "../../../models/User";
import { handleError } from "../../../utils/types/errorHandle";

export const updateProduct_func = async (userInfo: IUser, id: string, data: any) => {
    try {
        const product = await Product.findById(id);
        if (!product) {
            return { success: false, message: "Product not found" };
        }
        if(data?.vendor){
            delete data.vendor;
        }
        // ensure the product vendor is the same as the user vendor
        if(!product.vendor.equals(userInfo.vendor)){
            return { success: false, message: "You dont own this product" };
        }

        // Handle file uploads if provided
        if (data.images) {
            const imageArray = Array.isArray(data.images) ? data.images : [data.images];
            const uploadedImages = await Promise.all(
                imageArray.map(async (image: any) => {
                    try {
                        return await saveFile(image);
                    } catch (err) {
                        console.error(`Error saving file: ${image.name}`, err);
                        return null;
                    }
                })
            ).then((paths) => paths.filter((path): path is string => path !== null));
            data.images = uploadedImages;
        }

        // Update fields
        Object.assign(product, data);
        product.updatedBy = new mongoose.Types.ObjectId(userInfo._id as string);

        await product.save();

        return { success: true, message: "Product updated successfully", data: product };
    } catch (err: any) {
        return handleError(err);
    }
};
