import { Order } from "../../../models/Order";
import { Product } from "../../../models/Product";

export async function createOrder_func(data: any) {
    try {
        const productData = await Promise.all(
            data.products.map(async (p: any) => {
                const product = await Product.findById(p.product);
                if (!product) {
                    throw new Error(`Product not found: ${p.product}`);
                }
                if (product.stock < p.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }
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

        const order = new Order({
            customer: data.customer,
            products: productData,
            totalPrice,
            createdBy: data.createdBy,
        });

        const savedOrder = await order.save();
        return { success: true, data: savedOrder };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
