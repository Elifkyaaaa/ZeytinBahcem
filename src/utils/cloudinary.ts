import { v2 as cloudinary } from 'cloudinary';
import { env, isCloudinaryConfigured } from '@/utils/env';

/**
 * Cloudinary yalnızca sunucuda yapılandırılır.
 * Akış: admin görsel seçer → /api/upload imzalı parametre döner →
 * tarayıcı doğrudan Cloudinary'ye yükler → dönen secure_url Supabase'e yazılır.
 * Böylece dosya hiçbir zaman kendi sunucumuzdan geçmez.
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

/** İstemcinin doğrudan yükleme yapabilmesi için imzalı parametre üretir. */
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

/** Ürün görselini siler (Supabase kaydı silinirken çağrılır). */
export async function destroyImage(publicId: string) {
  if (!isCloudinaryConfigured) return { ok: false, reason: 'not-configured' as const };
  await cloudinary.uploader.destroy(publicId);
  return { ok: true as const };
}

/** Kaydedilen URL'den public_id çıkarır. */
export function publicIdFromUrl(url: string) {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
  return match?.[1] ?? null;
}

/** Görseli istenen ölçüde, otomatik format/kalite ile ister. */
export function cloudinaryUrl(publicId: string, width: number, height: number) {
  if (!env.cloudinary.cloudName) return '';
  return `https://res.cloudinary.com/${env.cloudinary.cloudName}/image/upload/c_fill,g_auto,f_auto,q_auto,w_${width},h_${height}/${publicId}`;
}
