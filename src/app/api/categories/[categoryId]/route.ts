import { NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Category } from "@entities/Category";
import { formdataToJS } from "@helpers/formdataToJS";
import { uploadToBlob } from "@lib/vercel-blob";
import { Image as FileEntity } from "@salah-tours/entities/Image";

interface UpdateCategoryDTO {
  name: string;
  description: string;
  parentCategoryId: string | null;
  image: File;
}

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
        subCategories: {
          image: true,
        },
        tours: true,
        image: true,
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
      { error: error instanceof Error ? error.message : "Failed to fetch category" },
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
    const body = await request.formData();
    const { name, description, parentCategoryId, image } =
      formdataToJS<UpdateCategoryDTO>(body);

    // Use transaction for database operations
    const result = await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const category = await transactionalEntityManager.findOne(Category, {
          where: { id: categoryId },
          relations: { image: true },
        });

        if (!category) {
          throw new Error("Category not found");
        }

        // Update basic category info
        category.name = name;
        category.description = description;
        category.parentCategoryId = parentCategoryId || null;

        // Handle image update if provided
        if (image instanceof File) {
          const { file: uploadedFile } = await uploadToBlob([image]);

          // Remove old image if exists
          if (category.image) {
            await transactionalEntityManager.remove(FileEntity, category.image);
          }

          // Create new file
          const file = await transactionalEntityManager.save(FileEntity, {
            url: uploadedFile.url,
            mimeType: uploadedFile.mimeType,
            filename: uploadedFile.filename,
            size: uploadedFile.size,
          });

          category.image = file;
        }

        await transactionalEntityManager.save(Category, category);

        return category;
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating category:", error);
    if (error instanceof Error && error.message === "Category not found") {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update category" },
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
      relations: ["subCategories", "tours"],
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    if (category.tours?.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with associated tours" },
        { status: 400 }
      );
    }

    await categoryRepository.remove(category);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete category" },
      { status: 500 }
    );
  }
}
