import { Order } from "../../../models/Order";
import { handleError } from "../../../utils/types/errorHandle";

export async function getAllOrders_func(page: number, pageSize: number) {
    try {
        const skip = (page - 1) * pageSize;
        const orders = await Order.find()
            .populate("customer", "name email")
            .skip(skip)
            .limit(pageSize)
            .exec();

        const totalOrders = await Order.countDocuments();

        return {
            success: true,
            message: "Orders retrieved successfully",
            data: {
                orders,
                pagination: {
                    total: totalOrders,
                    page,
                    pageSize,
                },
            },
        };
    } catch (error: any) {
        return handleError(error);
    }
}
