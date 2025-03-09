import mongoose from "mongoose";

import type { IUser } from "../../../models/User";
import { handleError } from "../../../utils/types/errorHandle";
import { Banner, type IBanner } from "../../../models/Banner";

export async function createBanner_func(userInfo: IUser, data: IBanner) {
    try {

        data.createdBy = new mongoose.Types.ObjectId(userInfo._id as string);
        data.updatedBy = new mongoose.Types.ObjectId(userInfo._id as string);

        const banner = new Banner(data);
        const savedBanner = await banner.save();

        return { success: true, message: "Banner created successfully", data: savedBanner };
    } catch (error: any) {
        return handleError(error);
    }
}
