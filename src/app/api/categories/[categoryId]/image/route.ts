import { NextRequest, NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Category } from "@entities/Category";
import { uploadFiles, handleUploadError } from "@lib/upload";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await initializeDB();
    const categoryId = (await params).categoryId;
    const categoryRepository = AppDataSource.getRepository(Category);

    const category = await categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Handle file upload
    const { file } = await uploadFiles(request, "image");
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Update category with new image
    category.imageUri = `/uploads/${file.filename}`;
    await categoryRepository.save(category);

    return NextResponse.json({ filename: file.filename });
  } catch (error) {
    return handleUploadError(error);
  }
}
