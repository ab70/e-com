import { Finance, type IFinance } from "../../../models/Finance";
import type { IUser } from "../../../models/User";
import { handleError } from "../../../utils/types/errorHandle";

export async function updateFinanceReq_func(userInfo: IUser, id: string, data: Partial<IFinance>) {
    try {
        const financeEntry = await Finance.findById(id);
        if (!financeEntry) {
            return { success: false, message: "Finance entry not found." };
        }

        // Update fields
        Object.assign(financeEntry, data);
        financeEntry.updatedAt = new Date();

        const updatedFinance = await financeEntry.save();

        return { success: true, message: "Finance entry updated successfully", data: updatedFinance };
    } catch (error: any) {
        return handleError(error);
    }
}
