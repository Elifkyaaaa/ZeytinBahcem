import { NextResponse } from 'next/server';
import { createUploadSignature } from '@/utils/cloudinary';
import { createClient } from '@/utils/supabase/server';
import { isSupabaseConfigured } from '@/utils/env';

export const runtime = 'nodejs';

/**
 * İmzalı Cloudinary yükleme parametreleri.
 * Yalnızca admin/staff rolü çağırabilir — imza sızarsa keyfi yükleme yapılabilirdi.
 */
export async function POST(request: Request) {
  // Supabase bağlıysa yetki denetimi zorunludur.
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

    if (!user) {
      return NextResponse.json({ error: 'Oturum gerekli.' }, { status: 401 });
    }

    const { data: profile } = await supabase!
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile || !['admin', 'staff'].includes(profile.role)) {
      return NextResponse.json({ error: 'Bu işlem için yetkiniz yok.' }, { status: 403 });
    }
  }

  let folder: string | undefined;
  try {
    const body = (await request.json()) as { folder?: string };
    folder = typeof body.folder === 'string' ? body.folder : undefined;
  } catch {
    // Gövde göndermek zorunlu değil; varsayılan klasör kullanılır.
  }

  const signature = createUploadSignature(folder);

  if (!signature) {
    return NextResponse.json(
      {
        error:
          'Cloudinary yapılandırılmamış. .env.local dosyasına NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY ve CLOUDINARY_API_SECRET ekleyin.',
      },
      { status: 503 },
    );
  }

  return NextResponse.json(signature);
}
