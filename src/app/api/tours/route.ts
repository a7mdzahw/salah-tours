import { NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Tour } from "@entities/Tour";
import { TourDay } from "@entities/TourDay";

export async function GET() {
  try {
    await initializeDB();
    const tourRepository = AppDataSource.getRepository(Tour);
    
    const tours = await tourRepository.find({
      relations: {
        category: true,
        days: true
      },
      order: {
        id: "DESC"
      }
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, duration, categoryId, days } = body;

    const tourRepository = AppDataSource.getRepository(Tour);
    const tourDayRepository = AppDataSource.getRepository(TourDay);

    // Start transaction
    const savedTour = await AppDataSource.manager.transaction(async transactionalEntityManager => {
      // Create tour
      const tour = tourRepository.create({
        name,
        description,
        price,
        duration,
        categoryId
      });

      const savedTour = await transactionalEntityManager.save(tour);

      // Create tour days
      const tourDays = days.map((day: { day: number; title: string; description: string }) => 
        tourDayRepository.create({
          tourId: savedTour.id,
          day: day.day,
          title: day.title,
          description: day.description
        })
      );

      await transactionalEntityManager.save(tourDays);

      return savedTour;
    });

    return NextResponse.json(savedTour);
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
  }
} 