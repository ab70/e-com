import { Review } from "../../../models/Review";
import { handleError } from "../../../utils/types/errorHandle";

export const getReviews_func = async (productId: string) => {
    try {
        const reviews = await Review.find({ product: productId })
            .populate("user", "firstName lastName email") // Populate user details
            .populate("reply.vendor", "vendorName"); // Populate vendor details in reply

        return { success: true, data: reviews };
    } catch (err: any) {
        return handleError(err);
    }
};
