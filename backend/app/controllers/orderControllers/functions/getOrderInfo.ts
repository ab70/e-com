import mongoose from "mongoose";
import { Order } from "../../../models/Order";

export async function getOrderInfo_func(id: string) {
    try {
        // order id
        const orderId = new mongoose.Types.ObjectId(id);
        const order = await Order.findById(orderId).populate("customer", "name email").exec();
        if (!order) {
            return { success: false, message: "Order not found" };
        }
        return { success: true, data: order };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
