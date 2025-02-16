import { NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Tour } from "@entities/Tour";
import { TourDay } from "@entities/TourDay";
import { Image as FileEntity } from "@salah-tours/entities/Image";
import { uploadToBlob } from "@lib/vercel-blob";
import { formdataToJS } from "@helpers/formdataToJS";

interface UpdateTourDTO {
  name: string;
  description: string;
  price: number;
  duration: number;
  categoryId: string;
  days: {
    id?: string;
    day: number;
    title: string;
    description: string;
  }[];
  images: File[];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tourId: string }> },
) {
  try {
    await initializeDB();
    const tourRepository = AppDataSource.getRepository(Tour);
    const tourId = (await params).tourId;

    const tour = await tourRepository.findOne({
      where: { id: tourId },
      relations: {
        category: true,
        days: true,
        catalogImages: true,
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json(
      { error: "Failed to fetch tour" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ tourId: string }> }
) {
  try {
    await initializeDB();
    const tourId = (await params).tourId;
    const body = await request.formData();
    const { name, description, price, duration, categoryId, days, images } =
      formdataToJS<UpdateTourDTO>(body);

    // Use transaction for database operations
    const result = await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const tour = await transactionalEntityManager.findOne(Tour, {
          where: { id: tourId },
          relations: {
            days: true,
            catalogImages: true,
          },
        });

        if (!tour) {
          throw new Error("Tour not found");
        }

        // Update basic tour info
        tour.name = name;
        tour.description = description;
        tour.price = price;
        tour.duration = duration;
        tour.categoryId = categoryId;

        // Handle tour days update
        await transactionalEntityManager.remove(TourDay, tour.days);

        const tourDays = days.map((day) =>
          transactionalEntityManager.create(TourDay, {
            tourId: tour.id,
            day: day.day,
            title: day.title,
            description: day.description,
          })
        );

        await transactionalEntityManager.save(TourDay, tourDays);
        tour.days = tourDays;

        // Handle image uploads if any
        if (images?.length) {
          // Remove old images
          if (tour.catalogImages?.length) {
            await transactionalEntityManager.remove(FileEntity, tour.catalogImages);
          }

          const { files } = await uploadToBlob(images);

          const uploadedImages = files.map((uploadedFile) => ({
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
        }

        await transactionalEntityManager.save(Tour, tour);
        return tour;
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating tour:", error);
    if (error instanceof Error && error.message === "Tour not found") {
      return NextResponse.json(
        { error: "Tour not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update tour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tourId: string }> },
) {
  try {
    await initializeDB();
    const tourId = (await params).tourId;
    const tourRepository = AppDataSource.getRepository(Tour);
    const tourDayRepository = AppDataSource.getRepository(TourDay);

    // Start a transaction
    await AppDataSource.manager.transaction(async () => {
      // First delete tour days
      await tourDayRepository.delete({ tourId });

      // Then delete the tour
      await tourRepository.delete({ id: tourId });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tour:", error);
    return NextResponse.json(
      { error: "Failed to delete tour" },
      { status: 500 },
    );
  }
}
