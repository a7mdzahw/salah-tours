import { NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";

import { Tour } from "@entities/Tour";
import { Category } from "@entities/Category";

export async function GET() {
  try {
    await initializeDB();
    const tourRepository = AppDataSource.getRepository(Tour);
    const categoryRepository = AppDataSource.getRepository(Category);

    // Get basic stats
    const [totalTours, totalCategories, categoryDistribution] =
      await Promise.all([
        tourRepository.count(),
        categoryRepository.count(),
        AppDataSource.createQueryBuilder()
          .select(["category.name", "COUNT(tour.id) as tourCount"])
          .from("categories", "category")
          .leftJoin("tours", "tour", "tour.category_id = category.id")
          .groupBy("category.id")
          .getRawMany(),
      ]);

    const mainCategories = await categoryRepository.count({
      where: { parentCategoryId: undefined },
    });

    const subCategories = totalCategories - mainCategories;

    return NextResponse.json({
      totalTours,
      totalCategories,
      mainCategories,
      subCategories,
      categoryDistribution,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
