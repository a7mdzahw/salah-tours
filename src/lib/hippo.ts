import { NextResponse } from "next/server";

interface UploadedFile {
  filename: string;
  originalname: string;
  url: string;
  size: number;
}

export async function uploadToHippo(
  formData: FormData,
  fieldName: string,
  maxCount = 1
) {
  try {
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
          "Invalid file type. Only images (jpg, png, webp) are allowed"
        );
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size cannot be larger than 5MB");
      }

      // Create form data for ImgHippo API
      const hippoFormData = new FormData();
      hippoFormData.append("file", file);
      hippoFormData.append("api_key", process.env.IMAGE_STORAGE_API_KEY!);
      hippoFormData.append("title", file.name);

      // Upload to ImgHippo
      const response = await fetch(process.env.IMAGE_STORAGE_API_URL!, {
        method: "POST",
        body: hippoFormData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image to ImgHippo");
      }

      const { data } = await response.json();

      savedFiles.push({
        filename: file.name,
        originalname: file.name,
        url: data.url,
        size: file.size,
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
    { status: 500 }
  );
}
