import { NextRequest, NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Category } from "@entities/Category";
import { uploadToHippo, handleUploadError } from "@lib/hippo";

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
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Handle file upload
    const { file } = await uploadToHippo(request, "image");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Update category with new image
    category.imageUri = file.url;
    await categoryRepository.save(category);

    return NextResponse.json({ filename: file.url });
  } catch (error) {
    return handleUploadError(error);
  }
}
