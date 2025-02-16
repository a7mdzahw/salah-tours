import { NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Category } from "@entities/Category";
import { uploadToBlob } from "@lib/vercel-blob";
import { Image as FileEntity } from "@salah-tours/entities/Image";
import { formdataToJS } from "@salah-tours/helpers/formdataToJS";

export async function GET() {
  try {
    await initializeDB();
    const categoryRepository = AppDataSource.getRepository(Category);

    const categories = await categoryRepository.find({
      relations: {
        subCategories: true,
        parentCategory: true,
        image: true,
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
    const body = await request.formData();

    const { name, description, parentCategoryId, image } =
      formdataToJS<CreateCategoryDTO>(body);

    // Use transaction for database operations
    const result = await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        // Create category
        const category = await transactionalEntityManager.save(Category, {
          name,
          description,
          parentCategoryId: parentCategoryId || null,
        });

        // Create and save file if we have an upload
        if (image) {
          const { file: uploadedFile } = await uploadToBlob([image]);

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
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

interface CreateCategoryDTO {
  name: string;
  description: string;
  parentCategoryId: string | null;
  image: File;
}
