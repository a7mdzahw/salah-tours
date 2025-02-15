import { NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Category } from "@entities/Category";
import { IsNull } from "typeorm";

export async function GET() {
  try {
    await initializeDB();
    const categoryRepository = AppDataSource.getRepository(Category);

    const categories = await categoryRepository.find({
      relations: {
        subCategories: true,
        image: true,
      },
      where: {
        parentCategoryId: IsNull(), // Using IsNull operator for type safety
      },
      order: {
        name: "ASC",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching main categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch main categories" },
      { status: 500 },
    );
  }
}
