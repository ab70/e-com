import { Review } from "../../../models/Review";
import { handleError } from "../../../utils/types/errorHandle";
import type { IUser } from "../../../models/User";

export const createReview_func = async (userInfo: IUser, data: any) => {
    try {
        const { product, rating, review } = data;

        // Create a new review
        const newReview = new Review({
            product,
            user: userInfo._id,
            rating,
            review,
        });

        const savedReview = await newReview.save();
        return { success: true, message: "Review created successfully", data: savedReview };
    } catch (err: any) {
        return handleError(err);
    }
};
