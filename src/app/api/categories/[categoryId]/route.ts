import { NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Category } from "@entities/Category";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const categoryId = (await params).categoryId;
    await initializeDB();
    const categoryRepository = AppDataSource.getRepository(Category);

    const category = await categoryRepository.findOne({
      where: { id: categoryId },
      relations: {
        subCategories: true,
        tours: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await initializeDB();
    const categoryId = (await params).categoryId;
    const body = await request.json();
    const { name, description, imageUri, parentCategoryId } = body;

    const categoryRepository = AppDataSource.getRepository(Category);

    const category = await categoryRepository.findOneBy({ id: categoryId });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    category.name = name;
    category.description = description;
    category.imageUri = imageUri;
    category.parentCategoryId = parentCategoryId || null;

    await categoryRepository.save(category);
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await initializeDB();
    const categoryId = (await params).categoryId;
    const categoryRepository = AppDataSource.getRepository(Category);

    const category = await categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['subCategories', 'tours']
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (category.tours?.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with associated tours' },
        { status: 400 }
      );
    }

    await categoryRepository.remove(category);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
