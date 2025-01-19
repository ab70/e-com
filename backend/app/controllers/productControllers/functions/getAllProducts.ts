import { Product } from "../../../models/Product";
import type { IUser } from "../../../models/User";
import { handleError } from "../../../utils/types/errorHandle";

export const getAllProducts_func = async (userInfo: IUser, pagination: any) => {
    try {
        const { page, pageSize, all } = pagination;

        // const query = all === "true" ? {} : {};

        const options = {
            skip: (page - 1) * pageSize,
            limit: parseInt(pageSize, 10),
        };

        const products = await Product.find({}).skip(options.skip).limit(options.limit);
        const totalProducts = await Product.countDocuments({});

        return {
            success: true,
            data: products[0],
            pagination: {
                page,
                pageSize,
                total: totalProducts,
                totalPages: Math.ceil(totalProducts / pageSize),
            },
        };
    } catch (err: any) {
        return handleError(err);
    }
};
