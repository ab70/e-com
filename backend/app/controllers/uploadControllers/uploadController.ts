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

                if (!assets || assets.length === 0) return c.json({ success: false, message: "No files uploaded" }, 400);

                const fileNames = await saveFile_func(assets as any[]);
                if (!fileNames.length) throw new Error("Failed to upload files");

                return c.json({
                    success: true,
                    message: "Files uploaded successfully",
                    data: [fileNames]
                });
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },

        // 🌟 Delete Multiple Files
        async deleteFiles(c: Context) {
            try {
                const { fileNames } = await c.req.json();
                if (!fileNames || !Array.isArray(fileNames) || fileNames.length === 0) {
                    return c.json({ success: false, message: "File names required" }, 400);
                }

                const success = await deleteFile_func(fileNames);
                if (!success) throw new Error("File deletion failed");

                return c.json({ success: true, message: "Files deleted successfully" });
            } catch (err: any) {
                return c.json({ success: false, message: err.message }, 500);
            }
        },
    };
}

export default uploadController;
