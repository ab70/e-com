import { existsSync, unlinkSync } from 'fs';
import path from 'path';
import AWS from 'aws-sdk';

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

// 📌 Delete Multiple Files Function
export const deleteFile_func = async (fileNames: string[]): Promise<boolean> => {
    try {
        if (!fileNames || fileNames.length === 0) throw new Error("No file names provided.");

        for (const fileName of fileNames) {
            if (STORAGE_TYPE === "local") {
                // 🌟 Delete from local storage
                const filePath = path.join(LOCAL_UPLOAD_PATH, fileName);
                if (existsSync(filePath)) {
                    unlinkSync(filePath);
                }
            } else {
                // 🌟 Delete from MinIO / S3
                await s3.deleteObject({ Bucket: BUCKET_NAME, Key: fileName }).promise();
            }
        }

        return true;
    } catch (error: any) {
        console.error("File deletion error:", error.message);
        return false;
    }
};
