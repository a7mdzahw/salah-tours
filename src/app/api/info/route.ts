import { NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Info } from "@entities/Info";

export async function GET() {
  try {
    await initializeDB();
    const infoRepository = AppDataSource.getRepository(Info);
    const info = await infoRepository.findOne({
      where: { id: 1 },
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
    const body = await request.json();
    const { title, description, bannerUrl } = body;

    const infoRepository = AppDataSource.getRepository(Info);
    let info = await infoRepository.findOne({
      where: { id: 1 },
    });

    if (!info) {
      // Create new info if it doesn't exist
      info = infoRepository.create({
        id: 1,
        title,
        description,
        bannerUrl,
      });
    } else {
      // Update existing info
      info.title = title;
      info.description = description;
      info.bannerUrl = bannerUrl;
    }

    await infoRepository.save(info);
    return NextResponse.json(info);
  } catch (error) {
    console.error("Error updating info:", error);
    return NextResponse.json(
      { error: "Failed to update info" },
      { status: 500 },
    );
  }
}
