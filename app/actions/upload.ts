"use server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/auth";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

const ALLOWED_BUCKETS = ["package-media", "gallery", "avatars"] as const;
type AllowedBucket = (typeof ALLOWED_BUCKETS)[number];

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export async function uploadMediaAction(formData: FormData): Promise<UploadResult> {
  try {
    await requireAdmin();
    const supabase = createAdminSupabaseClient();

    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return { success: false, error: "No file provided." };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: `File exceeds maximum allowed size of 15MB (file is ${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
      };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Unsupported file type: ${file.type}. Allowed: JPG, PNG, WEBP, AVIF, GIF, SVG, MP4, WEBM.`,
      };
    }

    const requestedBucket = (formData.get("bucket") as string) || "package-media";
    const bucket: AllowedBucket = ALLOWED_BUCKETS.includes(requestedBucket as AllowedBucket)
      ? (requestedBucket as AllowedBucket)
      : "package-media";

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${cleanFileName}`;
    const filePath = uniqueFileName;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
    };
  } catch (err: unknown) {
    console.error("uploadMediaAction uncaught exception:", err);
    const message = err instanceof Error ? err.message : "Failed to upload file.";
    return { success: false, error: message };
  }
}

const PUBLIC_PHOTO_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_PUBLIC_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadPublicReviewPhotoAction(formData: FormData): Promise<UploadResult> {
  try {
    const supabase = createAdminSupabaseClient();

    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return { success: false, error: "No image file selected." };
    }

    if (file.size > MAX_PUBLIC_PHOTO_SIZE) {
      return {
        success: false,
        error: `Photo exceeds 5MB size limit (selected file is ${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
      };
    }

    if (!PUBLIC_PHOTO_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Please upload an image file (JPG, PNG, WEBP, or AVIF).",
      };
    }

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `review_${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${cleanFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Public avatar upload error:", uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
    };
  } catch (err: unknown) {
    console.error("uploadPublicReviewPhotoAction exception:", err);
    const message = err instanceof Error ? err.message : "Failed to upload photo.";
    return { success: false, error: message };
  }
}
