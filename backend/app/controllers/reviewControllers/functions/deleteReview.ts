import { Review } from "../../../models/Review";
import { handleError } from "../../../utils/types/errorHandle";

export const deleteReview_func = async (reviewId: string) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            throw new Error("Review not found");
        }

        return { success: true, message: "Review deleted successfully" };
    } catch (err: any) {
        return handleError(err);
    }
};
