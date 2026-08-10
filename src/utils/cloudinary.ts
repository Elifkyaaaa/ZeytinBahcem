import { v2 as cloudinary } from 'cloudinary';
import { env, isCloudinaryConfigured } from '@/utils/env';

/**
 * Cloudinary is configured on the server only.
 * Flow: an admin picks an image → /api/upload returns signed parameters →
 * the browser uploads straight to Cloudinary → the returned secure_url is
 * written to Supabase. The file never passes through our own server.
 */
if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
}

export interface UploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  uploadUrl: string;
}

/** Produces signed parameters so the client can upload directly. */
export function createUploadSignature(folder = env.cloudinary.folder): UploadSignature | null {
  if (!isCloudinaryConfigured) return null;

  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    env.cloudinary.apiSecret!,
  );

  return {
    signature,
    timestamp,
    apiKey: env.cloudinary.apiKey!,
    cloudName: env.cloudinary.cloudName!,
    folder,
    uploadUrl: `https://api.cloudinary.com/v1_1/${env.cloudinary.cloudName}/image/upload`,
  };
}

/** Deletes a product image; called when the Supabase row is removed. */
export async function destroyImage(publicId: string) {
  if (!isCloudinaryConfigured) return { ok: false, reason: 'not-configured' as const };
  await cloudinary.uploader.destroy(publicId);
  return { ok: true as const };
}

/** Extracts the public_id from a stored URL. */
export function publicIdFromUrl(url: string) {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
  return match?.[1] ?? null;
}

/** Requests the image at a given size with automatic format and quality. */
export function cloudinaryUrl(publicId: string, width: number, height: number) {
  if (!env.cloudinary.cloudName) return '';
  return `https://res.cloudinary.com/${env.cloudinary.cloudName}/image/upload/c_fill,g_auto,f_auto,q_auto,w_${width},h_${height}/${publicId}`;
}
