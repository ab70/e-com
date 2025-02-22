import { promises as fsPromises, existsSync } from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import { Readable } from 'stream';
import mime from 'mime-types';
import { File } from '../../../models/File';
import type { IUser } from '../../../models/User';


// 🌟 Environment Variables
const STORAGE_TYPE = process.env.STORAGE_TYPE || "local"; // "s3", or "local"
const BASE_URL = process.env.FILE_BASE_URL || "http://localhost:3000/uploads/";
const LOCAL_UPLOAD_PATH = path.join(process.cwd(), "uploads");

// 🌟 AWS S3 / MinIO Configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    endpoint: process.env.S3_ENDPOINT,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
});
const BUCKET_NAME = process.env.S3_BUCKET_NAME || "ecom-bucket";

// 📌 Secure & Unified Multi-File Storage Function
export const saveFile_func = async (files: any[], userInfo: IUser)=> {
    try {
        if (!files || files.length === 0) throw new Error("No files uploaded.");
        if (!userInfo._id) throw new Error("Invalid user.");
        const fileArray = Array.isArray(files) ? files : [files];
        const savedFileNames = [];

        for (const file of fileArray) {
            console.log("Uploading file:", file.name);

            // Sanitize filename
            const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");

            // Generate unique filename
            const timestamp = Date.now();
            const fileName = `${timestamp}_${sanitizedFileName}`;
            const buffer = Buffer.from(await file.arrayBuffer());

            // Validate MIME type
            const mimeType = mime.lookup(file.name);
            if (!mimeType || !['image/jpeg', 'image/png', 'application/pdf'].includes(mimeType)) {
                console.warn(`Unsupported file type skipped: ${mimeType}`);
                continue; // Skip invalid files
            }

            if (STORAGE_TYPE === "local") {
                if (!existsSync(LOCAL_UPLOAD_PATH)) {
                    await fsPromises.mkdir(LOCAL_UPLOAD_PATH, { recursive: true });
                }
                const filePath = path.join(LOCAL_UPLOAD_PATH, fileName);
                await fsPromises.writeFile(filePath, buffer);
            } else {
                const uploadParams = {
                    Bucket: BUCKET_NAME,
                    Key: fileName,
                    Body: Readable.from(buffer),
                    ContentType: mimeType,
                    ACL: 'public-read',
                };
                await s3.upload(uploadParams).promise();
            }

            // 🔹 Store file metadata in MongoDB
            // await File.cate({ filename: fileName, userId, vendorId, role });
            const newFile = new File({
                serverPath: STORAGE_TYPE === "local" ? BASE_URL + fileName :  process.env.S3_ENDPOINT,
                filename: fileName,
                userId: userInfo._id,
                vendorId: userInfo?.vendor,
                role: userInfo.role
            })
            const savedFile = await newFile.save();
            savedFileNames.push(savedFile);
        }

        return savedFileNames;
    } catch (error: any) {
        console.log(error);
        return [];
    }
};
