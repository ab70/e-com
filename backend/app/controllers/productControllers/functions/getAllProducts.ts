import { Product } from "../../../models/Product";
import type { IUser } from "../../../models/User";
import { handleError } from "../../../utils/types/errorHandle";

export const getAllProducts_func = async (pagination: any) => {
    try {
        console.log("pagination", pagination);

        const {
            page = 1,
            pageSize = 10,
            all = false,
            query = {},
        } = pagination;

        // Construct the query object
        const queryObj: any = {};

        if (query?.category !== "") queryObj.category = query?.category;
        if (query?.brand !== "") queryObj.brand = query?.brand;
        if (query?.vendor !== "") queryObj.vendor = query?.vendor;


        // Pagination options
        const options = {
            skip: (page - 1) * pageSize,
            limit: parseInt(pageSize, 10),
        };

        // Fetch products based on query and pagination
        const products = await Product.find(query).populate("vendor category brand").skip(options.skip).limit(options.limit);
        const totalProducts = await Product.countDocuments(query);

        return {
            success: true,
            message: "Products found",
            data: products,
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
