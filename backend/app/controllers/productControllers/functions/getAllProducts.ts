import { Product } from "../../../models/Product";
import { handleError } from "../../../utils/types/errorHandle";

export const getAllProducts_func = async (pagination: any) => {
    try {
        const {
            page = 1,
            pageSize = 10,
            all = false,
            name = "",
            category = "",
            brand = "",
            vendor = "",
        } = pagination;

        // Construct the query object
        const queryObj: any = {};

        if (category !== "") queryObj.category = category;
        if (brand !== "") queryObj.brand = brand;
        if (vendor !== "") queryObj.vendor = vendor;
        if (name !== "") queryObj.name = name;

        // Pagination options
        const options = {
            skip: (page - 1) * pageSize,
            limit: parseInt(pageSize, 10),
        };

        // Fetch products based on query and pagination
        const products = await Product.find(queryObj).populate("vendor category brand").sort({ createdAt: -1 }).skip(options.skip).limit(options.limit);
        const totalProducts = await Product.countDocuments(queryObj);

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
