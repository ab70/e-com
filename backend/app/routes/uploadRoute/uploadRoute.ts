import app from "../../app";
import { z } from "@hono/zod-openapi";
import { checkUser } from "../../middlewares/authMiddleware";
import { contentType, Delete, Get, Patch, Post } from "../../utils/swagger/methods"
import vendorControllers from "../../controllers/vendorControllers/vendorController";
import uploadController from "../../controllers/uploadControllers/uploadController";
import { deleteFilesPostSchema, filePostSchema } from "../../models/File";


// File upload
app.openapi(Post({
    path: "/upload",
    tags: ["File Upload"],
    middleware: [checkUser],
    schema: filePostSchema,
    type: contentType.multipartFormData,
    summary: "Upload files"
}), uploadController().uploadFiles)

app.openapi(Patch({
    path: "/upload",
    tags: ["File Upload"],
    middleware: [checkUser],
    schema: deleteFilesPostSchema,
    summary: "Delete files"
}), uploadController().deleteFiles);
