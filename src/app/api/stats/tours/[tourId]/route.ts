import { NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tourId: string }> }
) {
  try {
    await initializeDB();
    const tourId = (await params).tourId;
    
    // Get tour booking statistics
    const tourStats = await AppDataSource.createQueryBuilder()
      .select([
        "tour.name",
        "COUNT(DISTINCT booking.id) as totalBookings",
        "SUM(booking.number_of_people) as totalTravelers",
        "AVG(booking.number_of_people) as avgGroupSize"
      ])
      .from("tours", "tour")
      .leftJoin("bookings", "booking", "booking.tour_id = tour.id")
      .where("tour.id = :tourId", { tourId: parseInt(tourId) })
      .groupBy("tour.id")
      .getRawOne();

    // Get monthly booking trends for this tour
    const monthlyTrends = await AppDataSource.createQueryBuilder()
      .select([
        "DATE_TRUNC('month', booking.created_at) as month",
        "COUNT(*) as bookingCount",
        "SUM(booking.number_of_people) as travelerCount"
      ])
      .from("bookings", "booking")
      .where("booking.tour_id = :tourId", { tourId: parseInt(tourId) })
      .andWhere("booking.created_at >= :startDate", {
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 6))
      })
      .groupBy("month")
      .orderBy("month", "ASC")
      .getRawMany();

    // Get upcoming bookings
    const upcomingBookings = await AppDataSource.createQueryBuilder()
      .select([
        "booking.date",
        "COUNT(*) as bookingCount",
        "SUM(booking.number_of_people) as travelerCount"
      ])
      .from("bookings", "booking")
      .where("booking.tour_id = :tourId", { tourId: parseInt(tourId) })
      .andWhere("booking.date >= :today", { today: new Date() })
      .groupBy("booking.date")
      .orderBy("booking.date", "ASC")
      .limit(10)
      .getRawMany();

    return NextResponse.json({
      tourStats,
      monthlyTrends,
      upcomingBookings
    });
  } catch (error) {
    console.error('Error fetching tour stats:', error);
    return NextResponse.json({ error: 'Failed to fetch tour stats' }, { status: 500 });
  }
} 