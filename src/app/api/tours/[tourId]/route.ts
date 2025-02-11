import { NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Tour } from "@entities/Tour";
import { TourDay } from "@entities/TourDay";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tourId: string }> },
) {
  try {
    await initializeDB();
    const tourRepository = AppDataSource.getRepository(Tour);
    const tourId = (await params).tourId;

    const tour = await tourRepository.findOne({
      where: { id: parseInt(tourId) },
      relations: {
        category: true,
        days: true,
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
  { params }: { params: Promise<{ tourId: string }> },
) {
  try {
    await initializeDB();
    const tourId = (await params).tourId;
    const body = await request.json();
    const { name, description, price, duration, categoryId, days } = body;

    const tourRepository = AppDataSource.getRepository(Tour);
    const tourDayRepository = AppDataSource.getRepository(TourDay);

    await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        // Update tour
        const tour = await tourRepository.findOneBy({ id: parseInt(tourId) });
        if (!tour) {
          throw new Error("Tour not found");
        }

        tour.name = name;
        tour.description = description;
        tour.price = price;
        tour.duration = duration;
        tour.categoryId = categoryId;

        await transactionalEntityManager.save(tour);

        // Delete existing days
        await transactionalEntityManager.delete(TourDay, { tourId: tour.id });

        // Create new days
        const tourDays = days.map(
          (day: { day: number; title: string; description: string }) =>
            tourDayRepository.create({
              tourId: tour.id,
              day: day.day,
              title: day.title,
              description: day.description,
            }),
        );

        await transactionalEntityManager.save(tourDays);
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating tour:", error);
    return NextResponse.json(
      { error: "Failed to update tour" },
      { status: 500 },
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
      await tourDayRepository.delete({ tourId: parseInt(tourId) });

      // Then delete the tour
      await tourRepository.delete({ id: parseInt(tourId) });
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
