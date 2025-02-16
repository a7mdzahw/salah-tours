import { NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Info } from "@entities/Info";
import { formdataToJS } from "@helpers/formdataToJS";
import { uploadToBlob } from "@lib/vercel-blob";
import { Image as FileEntity } from "@salah-tours/entities/Image";

interface UpdateInfoDTO {
  title: string;
  description: string;
  bannerImage?: File;
  heroImage?: File;
}

export async function GET() {
  try {
    await initializeDB();
    const infoRepository = AppDataSource.getRepository(Info);
    const info = await infoRepository.findOne({
      where: { id: 1 },
      relations: {
        bannerImage: true,
        heroImage: true,
      },
    });

    return NextResponse.json(info);
  } catch (error) {
    console.error("Error fetching info:", error);
    return NextResponse.json(
      { error: "Failed to fetch info" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.formData();
    const { title, description, bannerImage, heroImage } = formdataToJS<UpdateInfoDTO>(body);

    // Use transaction for database operations
    const result = await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      let info = await transactionalEntityManager.findOne(Info, {
        where: { id: 1 },
        relations: {
          bannerImage: true,
          heroImage: true,
        },
      });

      if (!info) {
        // Create new info if it doesn't exist
        info = transactionalEntityManager.create(Info, {
          id: 1,
          title,
          description,
        });
      } else {
        // Update existing info
        info.title = title;
        info.description = description;
      }

      // Handle banner image upload
      if (bannerImage instanceof File) {
        const { file: uploadedBanner } = await uploadToBlob([bannerImage]);

        // Remove old banner image if exists
        if (info.bannerImage) {
          await transactionalEntityManager.remove(FileEntity, info.bannerImage);
        }

        // Create new banner file
        const bannerFile = transactionalEntityManager.create(FileEntity, {
          url: uploadedBanner.url,
          mimeType: uploadedBanner.mimeType,
          filename: uploadedBanner.filename,
          size: uploadedBanner.size,
        });

        await transactionalEntityManager.save(FileEntity, bannerFile);
        info.bannerImage = bannerFile;
      }

      // Handle hero image upload
      if (heroImage instanceof File) {
        const { file: uploadedHero } = await uploadToBlob([heroImage]);

        // Remove old hero image if exists
        if (info.heroImage) {
          await transactionalEntityManager.remove(FileEntity, info.heroImage);
        }

        // Create new hero file
        const heroFile = transactionalEntityManager.create(FileEntity, {
          url: uploadedHero.url,
          mimeType: uploadedHero.mimeType,
          filename: uploadedHero.filename,
          size: uploadedHero.size,
        });

        await transactionalEntityManager.save(FileEntity, heroFile);
        info.heroImage = heroFile;
      }

      return await transactionalEntityManager.save(Info, info);
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating info:", error);
    return NextResponse.json(
      { error: "Failed to update info" },
      { status: 500 },
    );
  }
}
