import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { AppDataSource, initializeDB } from "@lib/db";
import { Info } from "@entities/Info";

export async function POST(request: Request) {
  try {
    await initializeDB();
    const formData = await request.formData();
    const file = formData.get("banner") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to uploads directory
    const filename = `banner-${Date.now()}${path.extname(file.name)}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await writeFile(path.join(uploadDir, filename), buffer);

    // Update database with new banner URL
    const infoRepository = AppDataSource.getRepository(Info);
    let info = await infoRepository.findOne({
      where: { id: 1 },
    });

    if (!info) {
      info = infoRepository.create({
        id: 1,
        title: "",
        description: "",
        bannerUrl: filename,
      });
    } else {
      info.bannerUrl = filename;
    }

    await infoRepository.save(info);
    return NextResponse.json({ filename });
  } catch (error) {
    console.error("Error uploading banner:", error);
    return NextResponse.json(
      { error: "Failed to upload banner" },
      { status: 500 },
    );
  }
}
