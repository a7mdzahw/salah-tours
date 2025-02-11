import { NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Category } from "@entities/Category";

export async function GET() {
  try {
    await initializeDB();
    const categoryRepository = AppDataSource.getRepository(Category);

    const categories = await categoryRepository.find({
      relations: {
        subCategories: true,
        parentCategory: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await initializeDB();
    const body = await request.json();
    const { name, description, parentCategoryId } = body;

    const categoryRepository = AppDataSource.getRepository(Category);

    const category = categoryRepository.create({
      name,
      description,
      parentCategoryId: parentCategoryId || null,
    });

    await categoryRepository.save(category);
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
