import { Finance } from "../../../models/Finance";
import { handleError } from "../../../utils/types/errorHandle";

export const getAllFinanceReq_func = async (pagination: any) => {
    try {
        const {
            page = 1,
            pageSize = 10,
            all = false,
            firstName = "",
            lastName = "",
            email = "",
            productType = "",
        } = pagination;

        // Construct the query object
        const queryObj: any = {};

        if (firstName) queryObj.firstName = { $regex: firstName, $options: "i" };
        if (lastName) queryObj.lastName = { $regex: lastName, $options: "i" };
        if (email) queryObj.email = { $regex: email, $options: "i" };
        if (productType) queryObj["product.type"] = { $regex: productType, $options: "i" };

        // Pagination options
        const options = {
            skip: (page - 1) * pageSize,
            limit: parseInt(pageSize, 10),
        };

        // Fetch finance entries based on query and pagination
        const finances = await Finance.find(queryObj).populate("product.productId").sort({ createdAt: -1 }).skip(options.skip).limit(options.limit);
        const totalFinances = await Finance.countDocuments(queryObj);

        return {
            success: true,
            message: "Finance entries found",
            data: finances,
            pagination: {
                page,
                pageSize,
                total: totalFinances,
                totalPages: Math.ceil(totalFinances / pageSize),
            },
        };
    } catch (err: any) {
        return handleError(err);
    }
};
