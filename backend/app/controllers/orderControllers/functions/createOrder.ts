import mongoose from "mongoose";
import { Order } from "../../../models/Order";
import { Product } from "../../../models/Product";
import type { IUser } from "../../../models/User";

export async function createOrder_func(userInfo: IUser, data: any) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const productData = await Promise.all(
            data.products.map(async (p: any) => {
                const product = await Product.findById(p.product).session(session);
                if (!product) {
                    throw new Error(`Product not found: ${p.product}`);
                }
                if (product.stock < p.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }
                
                // Reduce stock
                product.stock -= p.quantity;
                await product.save({ session });

                return {
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: p.quantity,
                    images: product.images,
                };
            })
        );

        const totalPrice = productData.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Create the order
        const order = new Order({
            customer: userInfo._id,
            products: productData,
            totalPrice,
            status: data.status || "Pending",
            createdBy: userInfo._id,
        });

        const savedOrder = await order.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return { success: true, data: savedOrder };
    } catch (error: any) {
        // Abort the transaction on error
        await session.abortTransaction();
        session.endSession();
        return { success: false, message: error.message };
    }
}
