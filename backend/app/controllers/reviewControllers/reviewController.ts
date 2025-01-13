import type { Context } from "hono";
import { parseToObject } from "../../utils/common/parseToObject";
import { createReview_func } from "./functions/craeteReview";
import { getReviews_func } from "./functions/getProductReview";
import { replyToReview_func } from "./functions/replyReview";
import { deleteReview_func } from "./functions/deleteReview";


function reviewControllers() {
    return {
        // Create a new review
        async newReview(c: Context) {
            try {
                const data = await c.req.json();
                const userInfo = c.get("user");
                const result = await createReview_func(userInfo, data);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json(err.message, 500);
            }
        },
        // Get all reviews for a product
        async getReviews(c: Context) {
            try {
                const productId = c.req.query("product") as string;
                const result = await getReviews_func(productId);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json(err.message, 500);
            }
        },
        // Add or update a reply to a review
        async replyToReview(c: Context) {
            try {
                const reviewId = c.req.query("id") as string;
                const data = await c.req.json();
                const userInfo = c.get("user");
                const result = await replyToReview_func(userInfo, reviewId, data);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json(err.message, 500);
            }
        },
        // Delete a review
        async deleteReview(c: Context) {
            try {
                const reviewId = c.req.query("id") as string;
                const result = await deleteReview_func(reviewId);
                return c.json(result, result.success ? 200 : 400);
            } catch (err: any) {
                return c.json(err.message, 500);
            }
        },
    };
}

export default reviewControllers;
