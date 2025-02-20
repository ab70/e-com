import { existsSync, unlinkSync } from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import { File } from '../../../models/File';

// 🌟 Environment Variables
const STORAGE_TYPE = process.env.STORAGE_TYPE || "local";
const LOCAL_UPLOAD_PATH = path.join(process.cwd(), "uploads");

// AWS S3 / MinIO Configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
    endpoint: process.env.MINIO_ENDPOINT,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
});
const BUCKET_NAME = process.env.S3_BUCKET_NAME || "storage-bucket";
// 📌 Helper function to perform file deletion
const performDeletion = async (fileNames: string[]): Promise<{ success: boolean }> => {
    try {
        for (const fileName of fileNames) {
            if (STORAGE_TYPE === "local") {
                // Delete from local storage
                const filePath = path.join(LOCAL_UPLOAD_PATH, fileName);
                if (existsSync(filePath)) {
                    unlinkSync(filePath);
                }
            } else {
                // Delete from MinIO / S3
                await s3.deleteObject({ Bucket: BUCKET_NAME, Key: fileName }).promise();
            }

            // Remove from database
            await File.deleteOne({ filename: fileName });
        }

        return { success: true };
    } catch (error: any) {
        console.error("File deletion error:", error.message);
        return { success: false };
    }
};

// 📌 Secure File Deletion with Ownership Validation
export const deleteFile_func = async (fileNames: string[], userInfo: any) => {
    try {
        if (!fileNames || !Array.isArray(fileNames) || fileNames.length === 0) {
            throw new Error("No file names provided.");
        }

        // 🔹 Super Admin can delete any file
        if (userInfo.role === "super-admin") {
            return await performDeletion(fileNames);
        }

        // 🔹 Fetch files from the database to check ownership
        const files = await File.find({ filename: { $in: fileNames } });

        if (!files || files.length === 0) {
            throw new Error("No matching files found.");
        }

        // 🔹 Filter files based on ownership
        const unauthorizedFiles: string[] = [];
        const authorizedFiles: string[] = [];

        for (const file of files) {
            if (
                file.userId.toString() !== userInfo._id &&  // Must match user ID
                (file.vendorId?.toString() !== userInfo.vendor) && // Must match vendor (for admins)
                userInfo.role !== "admin"  // Admins can manage vendor files
            ) {
                unauthorizedFiles.push(file.filename);
            } else {
                authorizedFiles.push(file.filename);
            }
        }

        // 🔹 If unauthorized files exist, return failure with details
        if (unauthorizedFiles.length > 0) {
            return { success: false, message: "Unauthorized deletion attempt", data: unauthorizedFiles };
        }

        // 🔹 Proceed with deletion of authorized files
        return await performDeletion(authorizedFiles);

    } catch (error: any) {
        console.error("File deletion error:", error.message);
        return { success: false, message: error.message };
    }
};

