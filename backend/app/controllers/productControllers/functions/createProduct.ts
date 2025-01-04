import { saveFile } from "../../../middlewares/upload";
import { Product } from "../../../models/Product";
import  { type IUser } from "../../../models/User";
import { handleError } from "../../../utils/types/errorHandle";

export const createProduct_func = async (userInfo: IUser, data: any, images?: any) => {
    try {
        console.log("data", data)
        
        // Handle file uploads
        let uploadedImages: string[] = [];
        if (images) {
            const imageArray = Array.isArray(images) ? images : [images];
            uploadedImages = await Promise.all(
                imageArray.map(async (image) => {
                    try {
                        return await saveFile(image);
                    } catch (err) {
                        console.error(`Error saving file: ${image.name}`, err);
                        return null;
                    }
                })
            ).then((paths) => paths.filter((path): path is string => path !== null));
        }

        data.images = uploadedImages;

        // Populate createdBy and updatedBy
        data.createdBy = userInfo._id;
        data.updatedBy = userInfo._id;

        const newProduct = new Product(data);
        await newProduct.save();

        return { success: true, message: "Product created successfully", data: newProduct };
    } catch (err: any) {
        return handleError(err);
    }
};
