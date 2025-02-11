import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import path from 'path';
import { AppDataSource, initializeDB } from "@lib/db";
import { Tour } from "@entities/Tour";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tourId: string }> }
) {
  try {
    await initializeDB();
    const tourId = (await params).tourId;
    const formData = await request.formData();
    const files = formData.getAll('catalogImages') as File[];
    
    if (!files.length) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const tourRepository = AppDataSource.getRepository(Tour);
    const tour = await tourRepository.findOneBy({ id: parseInt(tourId) });
    
    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    const filenames: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `tour-${tourId}-${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.name)}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await writeFile(path.join(uploadDir, filename), buffer);
      
      // Add /uploads prefix to filename when saving to database
      const filePathWithPrefix = `/uploads/${filename}`;
      filenames.push(filePathWithPrefix);
    }

    // Store first image as main image if no main image exists
    if (!tour.image) {
      tour.image = filenames[0];
    }
    
    // Add new images to catalog images array with prefix
    tour.catalogImages = [...(tour.catalogImages || []), ...filenames];
    
    await tourRepository.save(tour);

    return NextResponse.json({ filenames });
  } catch (error) {
    console.error('Error uploading tour images:', error);
    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 });
  }
} 