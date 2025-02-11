import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

interface UploadedFile {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
}

export async function uploadFiles(
  request: NextRequest,
  fieldName: string,
  maxCount = 1,
) {
  try {
    const formData = await request.formData();
    const files = formData.getAll(fieldName);

    if (!files.length) {
      throw new Error("No files uploaded");
    }

    if (files.length > maxCount) {
      throw new Error(`Maximum ${maxCount} files allowed`);
    }

    const savedFiles: UploadedFile[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      // Validate file type
      if (!isValidFileType(file.type)) {
        throw new Error(
          "Invalid file type. Only images (jpg, png, webp) are allowed",
        );
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size cannot be larger than 5MB");
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `${fieldName}-${uniqueSuffix}${path.extname(file.name)}`;
      const filePath = path.join(uploadDir, filename);

      await fs.promises.writeFile(filePath, buffer);

      savedFiles.push({
        filename,
        originalname: file.name,
        mimetype: file.type,
        size: file.size,
        path: filePath,
      });
    }

    return {
      file: savedFiles[0], // For single file uploads
      files: savedFiles, // For multiple file uploads
    };
  } catch (error) {
    throw error;
  }
}

function isValidFileType(mimetype: string): boolean {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  return allowedTypes.includes(mimetype);
}

export function handleUploadError(error: any) {
  console.error("Upload error:", error);
  return NextResponse.json(
    { error: error.message || "Error uploading file" },
    { status: 500 },
  );
}
