import mongoose from "mongoose";
import { Order, OrderStatus } from "../../../models/Order";
import { Product } from "../../../models/Product";
import type { IUser } from "../../../models/User";
import { handleError } from "../../../utils/types/errorHandle";

export async function createOrder_func(userInfo: IUser, data: any) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const productData = await Promise.all(
            data.products.map(async (p: any) => {
                const product = await Product.findOneAndUpdate(
                    { _id: p.product, stock: { $gte: p.quantity } }, // Atomic stock check and decrement
                    { $inc: { stock: -p.quantity } },
                    { new: true, session }
                );

                if (!product) {
                    throw new Error(`Insufficient stock or product not found: ${p.product}`);
                    // return { success: false, message: `Insufficient stock or product not found: ${p.product}` };
                }

                // Calculate the discounted price if the discount is active
                const now = new Date();
                const isDiscountActive =
                    product.discount &&
                    product.discount.startAt &&
                    product.discount.endAt &&
                    now >= product.discount.startAt &&
                    now <= product.discount.endAt;

                const discountedPrice = isDiscountActive ? product.discount.price : product.price;

                return {
                    product: product._id,
                    name: product.name,
                    price: product.price, // Original price
                    discountedPrice, // Price after discount (if applicable)
                    quantity: p.quantity,
                    images: product.images,
                };
            })
        );

        // Calculate total price based on the discounted price
        const totalPrice = productData.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);

        // Create the order
        const order = new Order({
            customer: userInfo._id,
            products: productData,
            totalPrice,
            status: OrderStatus.PENDING,
            deliveryAddress: data.deliveryAddress,
            paymentMethod: data.paymentMethod || "COD",
            createdBy: userInfo._id,
        });

        const savedOrder = await order.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return { success: true, message: "Order created successfully", data: savedOrder };
    } catch (error: any) {
        // Rollback transaction on error
        await session.abortTransaction();
        session.endSession();
        return handleError(error);
    }
}
