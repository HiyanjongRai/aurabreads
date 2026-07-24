import "server-only";

import crypto from "crypto";

const apiKey = process.env.CLOUDINARY_API_KEY || "979236259656447";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "InP0ZbDqLEqhiFB9A2D6khWWtdw";
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "aurabeads";

/**
 * Uploads a Buffer or base64/Data URL to Cloudinary using the REST API.
 * Returns the secure HTTPS CDN URL of the uploaded image.
 */
export async function uploadImageToCloudinary(
  fileData: string | Buffer,
  folder = "aurabeads_products"
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000);

  // Build the SHA-1 signature for authenticated upload
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

  const formData = new FormData();
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  if (typeof fileData === "string") {
    // base64 Data URL or remote URL
    formData.append("file", fileData);
  } else {
    // Buffer → convert to base64 string and upload that way
    const base64 = `data:image/jpeg;base64,${fileData.toString("base64")}`;
    formData.append("file", base64);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    console.error("[CLOUDINARY UPLOAD ERROR]", data.error || data);
    throw new Error(data.error?.message || "Failed to upload image to Cloudinary.");
  }

  return data.secure_url as string;
}
