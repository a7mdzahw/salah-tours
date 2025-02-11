import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { AppDataSource, initializeDB } from "@lib/db";
import { Category } from "@entities/Category";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await initializeDB();
    const categoryId = (await params).categoryId;
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to uploads directory
    const filename = `category-${categoryId}-${Date.now()}${path.extname(
      file.name
    )}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await writeFile(path.join(uploadDir, filename), buffer);

    // Update category with new image URL
    const categoryRepository = AppDataSource.getRepository(Category);
    const category = await categoryRepository.findOneBy({ id: categoryId });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    category.imageUri = `/uploads/${filename}`;
    await categoryRepository.save(category);

    return NextResponse.json({ filename });
  } catch (error) {
    console.error("Error uploading category image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
