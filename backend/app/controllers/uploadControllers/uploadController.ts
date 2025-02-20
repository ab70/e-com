import type { Context } from "hono";
import { saveFile_func } from "./functions/uploadFiles";
import { deleteFile_func } from "./functions/deleteFiles";

// 📌 Hono.js Upload Controller
function uploadController() {
    return {
        // 🌟 Upload Multiple Files
        async uploadFiles(c: Context) {
            try {
                const { assets } = await c.req.parseBody({ all: true });
                const userInfo = await c.get("user"); // Extract user info

                if (!assets || assets.length === 0) {
                    return c.json({ success: false, message: "No files uploaded" }, 400);
                }

                const result = await saveFile_func(assets as any[], userInfo);

                return c.json({
                    success: true,
                    message: "Files uploaded successfully",
                    data: result
                });
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        // 🌟 Delete Multiple Files
        async deleteFiles(c: Context) {
            try {
                const { fileNames } = await c.req.json();
                const userInfo = await c.get("user");

                if (!fileNames || !Array.isArray(fileNames) || fileNames.length === 0) {
                    return c.json({ success: false, message: "File names required" }, 400);
                }

                const result = await deleteFile_func(fileNames, userInfo);

                return c.json(result, result.success ? 200 : 400);

            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },
    };
}

export default uploadController;
