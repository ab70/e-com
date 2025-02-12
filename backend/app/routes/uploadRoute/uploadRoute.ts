import app from "../../app";
import { z } from "@hono/zod-openapi";
import { checkUser } from "../../middlewares/authMiddleware";
import { contentType, Delete, Get, Patch, Post } from "../../utils/swagger/methods"
import vendorControllers from "../../controllers/vendorControllers/vendorController";
import uploadController from "../../controllers/uploadControllers/uploadController";

export const assetsPostSchema = z.object({
    assets: z
        .union([
            z.any().openapi({ type: "string", format: "binary" }),
            z.array(z.any().openapi({ type: "string", format: "binary" })),
        ])
        .transform((value) => (Array.isArray(value) ? value : [value]))
        .optional()
});
export const deleteAssetsPostSchema = z.object({
    fileNames: z.array(z.string()).optional()
});

// File upload
app.openapi(Post({
    path: "/upload",
    tags: ["File Upload"],
    middleware: [checkUser],
    schema: assetsPostSchema,
    type: contentType.multipartFormData,
    summary: "Upload files"
}), uploadController().uploadFiles)

app.openapi(Patch({
    path: "/upload",
    tags: ["File Upload"],
    middleware: [checkUser],
    schema: deleteAssetsPostSchema,
    summary: "Delete files"
}), uploadController().deleteFiles);
