import { NextRequest, NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Tour } from "@entities/Tour";
import { uploadFiles, handleUploadError } from "@lib/upload";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  try {
    await initializeDB();
    const tourId = (await params).tourId;
    const tourRepository = AppDataSource.getRepository(Tour);

    const tour = await tourRepository.findOneBy({ id: parseInt(tourId) });
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Handle file upload
    const { files } = await uploadFiles(request, "catalogImages", 10);

    if (!files?.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Add uploaded files to tour
    const filenames = files.map(file => `/uploads/${file.filename}`);
    
    tour.catalogImages = [...(tour.catalogImages || []), ...filenames];
    await tourRepository.save(tour);

    return NextResponse.json({ filenames });
  } catch (error) {
    return handleUploadError(error);
  }
} 