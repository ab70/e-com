import { promises as fsPromises, createWriteStream, existsSync } from 'fs';
import path from 'path';
import mime from 'mime-types';

export const saveFile = async (file: any) => {
    try {
        console.log("Uploading file:", file.name);

        // Sanitize file name
        const sanitizedFileName = path.basename(file.name).replace(/[^a-zA-Z0-9_.-]/g, '_');
        const fileName = `${Date.now()}_${sanitizedFileName}`;
        const staticDir = path.join(process.cwd(), 'static');

        // Ensure the static directory exists
        if (!existsSync(staticDir)) {
            await fsPromises.mkdir(staticDir, { recursive: true });
        }

        // Validate MIME type are [image,]
        const mimeType = mime.lookup(file.name);
        if (!mimeType || !['image/jpeg', 'image/png'].includes(mimeType)) {
            throw new Error('Unsupported file type');
        }

        // Save file (stream or buffer depending on size/requirements)
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(staticDir, fileName);

        await fsPromises.writeFile(filePath, buffer);

        console.log("File saved successfully:", filePath);
        return `/static/${fileName}`;
    } catch (err: any) {
        console.error('Error saving file', {
            error: err.message,
            fileName: file?.name || 'Unknown',
            timestamp: new Date(),
        });
        return "";
    }
};
