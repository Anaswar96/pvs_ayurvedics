import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "pvs-ayurvedics";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // If Cloudinary credentials are fully set up:
    if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      return new Promise<NextResponse>((resolve) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: folder,
              resource_type: "auto",
            },
            (error, result) => {
              if (error || !result) {
                console.error("Cloudinary upload error:", error);
                resolve(NextResponse.json({ error: "Cloudinary upload failed" }, { status: 500 }));
              } else {
                resolve(
                  NextResponse.json({
                    url: result.secure_url,
                    public_id: result.public_id,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                  })
                );
              }
            }
          )
          .end(buffer);
      });
    } else {
      // Graceful fallback for local development: create a data URL or simulated asset URL
      const base64 = buffer.toString("base64");
      const mimeType = file.type || "image/png";
      const dataUrl = `data:${mimeType};base64,${base64}`;

      return NextResponse.json({
        url: dataUrl,
        public_id: `local_${Date.now()}`,
        format: mimeType.split("/")[1] || "png",
        message: "Uploaded locally (configure Cloudinary keys in .env for production media cloud storage)",
      });
    }
  } catch (err: unknown) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
