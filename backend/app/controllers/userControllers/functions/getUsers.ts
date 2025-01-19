import { User, UserRole, type IUser } from "../../../models/User";
import { handleError } from "../../../utils/types/errorHandle";
import { DefaultPagination, type IPagination } from "../../../utils/types/types";

export const getUsers_func = async (userInfo: IUser, queries: any, pagination: IPagination = DefaultPagination) => {
    try {
        let users = null;
        let totalUsers = null;
        if (userInfo.role === UserRole.SUPER_ADMIN) {
            const query = {
                ...(queries.vendor && { vendor: queries.vendor }),
                ...(queries.role && { role: queries.role })
            }
            users = await User.find(query)
                .skip((pagination?.page - 1) * pagination?.pageSize)
                .limit(pagination?.pageSize)
            totalUsers = await User.countDocuments(query);
        } else {
            users = await User.find({ vendor: userInfo.vendor })
                .skip((pagination?.page - 1) * pagination?.pageSize)
                .limit(pagination?.pageSize)
            totalUsers = await User.countDocuments({ vendor: userInfo.vendor });
        }
        return {
            success: true,
            message: "Users retrieved successfully",
            data: users, pagination: {
                ...pagination,
                total: totalUsers
            }
        };
    } catch (error: any) {
        return handleError(error);
    }
}