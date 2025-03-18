import { ContactUs } from "../../../models/ContactUs";
import { handleError } from "../../../utils/types/errorHandle";

export async function getAllContactUs_func(pagination: any) {
    try {
        const {
            page = 1,
            pageSize = 10,
            all = false,
        } = pagination;

        const result = await ContactUs.find()
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize, 10))
            .sort({ createdAt: -1 });

        const totalEntries = await ContactUs.countDocuments();
        
        return {
            success: true,
            message: "Contact Us entries fetched successfully",
            data: result,
            pagination: {
                page,
                pageSize,
                total: totalEntries,
                totalPages: Math.ceil(totalEntries / pageSize),
            }
        };
    } catch (error: any) {
        return handleError(error);
    }
}
