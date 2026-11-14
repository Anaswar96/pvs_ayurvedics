import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary server SDK
if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export { cloudinary };

/**
 * Transforms a Cloudinary URL to add responsive optimization params (f_auto, q_auto, width, height)
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  options?: {
    width?: number;
    height?: number;
    quality?: "auto" | "good" | "best";
    crop?: "fill" | "limit" | "scale" | "thumb";
  }
): string {
  if (!url) return "/images/placeholder-herbal.png";

  // If local static asset or external non-cloudinary image, return as is
  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  const { width = 800, height, quality = "auto", crop = "limit" } = options || {};

  const transformations = [`f_auto`, `q_${quality}`, `c_${crop}`];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);

  const transformString = transformations.join(",");

  // Insert transformations after /upload/
  return url.replace("/upload/", `/upload/${transformString}/`);
}
