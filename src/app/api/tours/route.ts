import { NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Tour } from "@entities/Tour";
import { TourDay } from "@entities/TourDay";
import { Image as FileEntity } from "@salah-tours/entities/Image";
import { uploadToBlob } from "@lib/vercel-blob";
import { formdataToJS } from "@helpers/formdataToJS";

interface CreateTourDTO {
  name: string;
  description: string;
  price: number;
  duration: number;
  categoryId: string;
  days: {
    day: number;
    title: string;
    description: string;
  }[];
  images: File[];
}

export async function GET() {
  try {
    await initializeDB();
    const tourRepository = AppDataSource.getRepository(Tour);

    const tours = await tourRepository.find({
      relations: {
        category: {
          image: true,
        },
        days: true,
        catalogImages: true,
      },
      order: {
        id: "DESC",
      },
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await initializeDB();
    const body = await request.formData();
    const { name, description, price, duration, categoryId, days, images } =
      formdataToJS<CreateTourDTO>(body);

    // Use transaction for database operations
    const result = await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        // Create and save tour
        const tour = await transactionalEntityManager.save(Tour, {
          name,
          description,
          price,
          duration,
          categoryId,
        });

        // Create and save tour days
        const tourDays = days?.map((day) =>
          transactionalEntityManager.create(TourDay, {
            tourId: tour.id,
            day: day.day,
            title: day.title,
            description: day.description,
          })
        );

        await transactionalEntityManager.save(TourDay, tourDays);

        // Handle image uploads if any
        if (images?.length) {
          const { files } = await uploadToBlob(images);

          const uploadedImages = files?.map((uploadedFile) => ({
            url: uploadedFile.url,
            mimeType: uploadedFile.mimeType,
            filename: uploadedFile.filename,
            size: uploadedFile.size,
          }));

          const tourImages = await transactionalEntityManager.save(
            FileEntity,
            uploadedImages
          );

          tour.catalogImages = tourImages;
          await transactionalEntityManager.save(Tour, tour);
        }

        return tour;
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating tour:", error);
    return NextResponse.json(
      { error: "Failed to create tour" },
      { status: 500 }
    );
  }
}
