import type { Context } from "hono";
import { promises as fsPromises, existsSync, unlinkSync } from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import { Readable } from 'stream';
import mime from 'mime-types';

// 🌟 Environment Variables
const STORAGE_TYPE = process.env.STORAGE_TYPE || "local"; // "s3", "minio", or "local"
const BASE_URL = process.env.FILE_BASE_URL || "http://localhost:3000/uploads/";
const LOCAL_UPLOAD_PATH = path.join(process.cwd(), "uploads");

// 🌟 AWS S3 / MinIO Configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
    endpoint: process.env.MINIO_ENDPOINT,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
});
const BUCKET_NAME = process.env.S3_BUCKET_NAME || "storage-bucket";

// 📌 Secure & Unified File Storage Function
export const saveFile = async (file: any): Promise<string | null> => {
    try {
        console.log("Uploading file:", file.name);

        // Sanitize file name
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
        const fileName = `${Date.now()}_${sanitizedFileName}`;
        const buffer = Buffer.from(await file.arrayBuffer());

        // Validate MIME type
        const mimeType = mime.lookup(file.name);
        if (!mimeType || !['image/jpeg', 'image/png', 'application/pdf'].includes(mimeType)) {
            throw new Error(`Unsupported file type: ${mimeType}`);
        }

        if (STORAGE_TYPE === "local") {
            // 🌟 Save file to local storage
            if (!existsSync(LOCAL_UPLOAD_PATH)) {
                await fsPromises.mkdir(LOCAL_UPLOAD_PATH, { recursive: true });
            }
            const filePath = path.join(LOCAL_UPLOAD_PATH, fileName);
            await fsPromises.writeFile(filePath, buffer);
            return fileName; // Store only filename in DB
        } else {
            // 🌟 Upload to S3 / MinIO
            const uploadParams = {
                Bucket: BUCKET_NAME,
                Key: fileName,
                Body: Readable.from(buffer),
                ContentType: mimeType,
            };
            await s3.upload(uploadParams).promise();
            return fileName; // Store only filename in DB
        }
    } catch (error: any) {
        console.error("File storage error:", error.message);
        return null;
    }
};

// 📌 Delete Function for Any Storage Type


// 📌 Get File URL Function
export const getFileUrl = (fileName: string): string => {
    return `${BASE_URL}${fileName}`;
};
