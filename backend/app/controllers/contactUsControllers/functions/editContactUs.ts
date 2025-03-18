import mongoose from "mongoose";
import { ContactUs, type IContactUs } from "../../../models/ContactUs";
import { handleError } from "../../../utils/types/errorHandle";

export async function updateContactUs_func(userInfo: any, id: string, data: IContactUs) {
    try {
        const cid = new mongoose.Types.ObjectId(id);
        const updatedContactUs = await ContactUs.findByIdAndUpdate(cid, data);

        if (!updatedContactUs) {
            return { success: false, message: "Contact Us entry not found", data: null };
        }

        return { success: true, message: "Contact Us entry updated successfully", data: updatedContactUs };
    } catch (error: any) {
        return handleError(error);
    }
}
