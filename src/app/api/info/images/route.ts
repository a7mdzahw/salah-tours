import { NextRequest, NextResponse } from "next/server";
import { AppDataSource, initializeDB } from "@lib/db";
import { Info } from "@entities/Info";
import { uploadToHippo, handleUploadError } from "@lib/hippo";

export async function POST(request: NextRequest) {
  try {
    await initializeDB();
    const infoRepository = AppDataSource.getRepository(Info);

    let info = await infoRepository.findOne({
      where: { id: 1 },
    });

    if (!info) {
      info = infoRepository.create({
        id: 1,
        title: "",
        description: "",
      });
    }

    // Get the image type from the request
    const formData = await request.formData();
    const imageType = formData.get("type") as "banner" | "hero";

    if (!imageType || !["banner", "hero"].includes(imageType)) {
      return NextResponse.json(
        { error: "Invalid image type. Must be 'banner' or 'hero'" },
        { status: 400 }
      );
    }

    // Handle file upload
    const { file } = await uploadToHippo(formData, "image");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Update the appropriate image URL based on type
    if (imageType === "banner") {
      info.bannerUrl = file.url;
    } else {
      info.heroUrl = file.url;
    }

    await infoRepository.save(info);

    return NextResponse.json({
      filename: file.url,
      type: imageType,
    });
  } catch (error) {
    return handleUploadError(error);
  }
}
