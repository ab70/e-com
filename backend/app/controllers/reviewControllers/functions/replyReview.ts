import { Review } from "../../../models/Review";
import { handleError } from "../../../utils/types/errorHandle";
import type { IUser } from "../../../models/User";

export const replyToReview_func = async (userInfo: IUser, reviewId: string, data: any) => {
    try {
        const { replyText } = data;

        // Update the review with the vendor's reply
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            {
                reply: {
                    vendor: userInfo._id, // Assuming the vendor's ID matches the user's ID
                    replyText,
                    repliedAt: new Date(),
                },
            },
            { new: true }
        );

        if (!updatedReview) {
            throw new Error("Review not found");
        }

        return { success: true, message: "Reply added successfully", data: updatedReview };
    } catch (err: any) {
        return handleError(err);
    }
};
