import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

interface FileParams {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export async function uploadToBlob(files: File[], maxCount = 1) {
  try {
    if (!files.length) {
      throw new Error("No files uploaded");
    }

    if (files.length > maxCount) {
      throw new Error(`Maximum ${maxCount} files allowed`);
    }

    // create saved files array
    const savedFiles: FileParams[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      // Validate file type
      if (!isValidFileType(file.type)) {
        throw new Error(
          "Invalid file type. Only images (jpg, png, webp) are allowed"
        );
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size cannot be larger than 5MB");
      }

      // Upload to Vercel Blob
      const { url } = await put(file.name, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      const savedFile = {
        url: url,
        filename: file.name,
        size: file.size,
        mimeType: file.type,
      };

      savedFiles.push(savedFile);
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
    { status: 500 }
  );
}
