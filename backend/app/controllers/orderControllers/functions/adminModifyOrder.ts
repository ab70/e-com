import { Order } from "../../../models/Order";
import { handleError } from "../../../utils/types/errorHandle";

export async function adminModifyOrder_func(id: string, data: any) {
    try {
        const order = await Order.findById(id);
        if (!order) {
            return { success: false, message: "Order not found" };
        }

        if (data.status) {
            order.status = data.status;
        }
        order.updatedBy = data.updatedBy;
        const updatedOrder = await order.save();

        return { success: true, data: updatedOrder };
    } catch (error: any) {
        return handleError(error);
    }
}
