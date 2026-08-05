#!/usr/bin/env node
/**
 * Katalog aktarımı.
 *
 *   npm run db:seed
 *
 * Uygulamanın çalışıyor olmasını gerektirmez: /api/admin/seed uç noktasını
 * yerel sunucu üzerinden çağırır. Sunucu kapalıysa nasıl başlatacağınızı söyler.
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ENV_FILE = path.join(process.cwd(), '.env.local');

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

async function loadEnv() {
  if (!existsSync(ENV_FILE)) return {};
  const raw = await readFile(ENV_FILE, 'utf8');
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value) env[key] = value;
  }
  return env;
}

async function main() {
  const env = await loadEnv();
  const token = env.SUPABASE_SERVICE_ROLE_KEY;
  const base = env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  console.log(`\n${c.bold('Katalog aktarımı')} ${c.dim(`→ ${base}`)}\n`);

  if (!token) {
    console.log(`${c.red('✗')} SUPABASE_SERVICE_ROLE_KEY tanımlı değil.`);
    console.log(`  ${c.dim('.env.local dosyasına service_role anahtarını ekleyin.')}\n`);
    process.exit(1);
  }

  let response;
  try {
    response = await fetch(`${base}/api/admin/seed`, {
      method: 'POST',
      headers: { 'x-seed-token': token },
      signal: AbortSignal.timeout(120000),
    });
  } catch {
    console.log(`${c.red('✗')} ${base} adresine ulaşılamadı.`);
    console.log(`  Sunucuyu başlatıp tekrar deneyin:  ${c.cyan('npm run dev')}\n`);
    process.exit(1);
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.ok) {
    console.log(`${c.red('✗')} Aktarım başarısız ${c.dim(`(HTTP ${response.status})`)}`);
    console.log(`  ${payload.error ?? 'Bilinmeyen hata'}\n`);
    process.exit(1);
  }

  const { categories, products, blogs } = payload.seeded;
  console.log(`${c.green('✓')} ${categories} kategori`);
  console.log(`${c.green('✓')} ${products} ürün`);
  console.log(`${c.green('✓')} ${blogs} blog yazısı`);
  console.log(`\n${c.green('Katalog veritabanına aktarıldı.')}\n`);
}

main().catch((error) => {
  console.error(`\n${c.red('✗')} Beklenmeyen hata:`, error);
  process.exit(1);
});
