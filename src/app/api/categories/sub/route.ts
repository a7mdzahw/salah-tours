import { NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Category } from "@entities/Category";
import { Not, IsNull } from "typeorm";

export async function GET() {
  try {
    await initializeDB();
    const categoryRepository = AppDataSource.getRepository(Category);

    const categories = await categoryRepository.find({
      relations: {
        parentCategory: true,
      },
      where: {
        parentCategoryId: Not(IsNull()), // Using Not and IsNull operators for type safety
      },
      order: {
        name: "ASC",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching sub categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch sub categories" },
      { status: 500 },
    );
  }
}
