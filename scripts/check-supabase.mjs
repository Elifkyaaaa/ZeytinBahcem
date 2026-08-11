#!/usr/bin/env node
/**
 * Supabase bağlantı denetimi.
 *
 *   npm run db:check
 *
 * .env.local dosyasını okur, uç noktaya erişimi sınar ve 11 tablonun
 * oluşturulup oluşturulmadığını tek tek raporlar. Hiçbir veri değiştirmez.
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ENV_FILE = path.join(ROOT, '.env.local');

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

const OK = c.green('✓');
const NO = c.red('✗');
const WARN = c.yellow('!');

/** .env.local'ı ayrıştır — tırnakları ve yorumları temizler. */
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

const TABLES = [
  'users',
  'categories',
  'products',
  'orders',
  'order_items',
  'addresses',
  'favorites',
  'cart',
  'coupons',
  'reviews',
  'blogs',
  'settings',
];

async function head(url, key) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'count=exact' },
      signal: AbortSignal.timeout(15000),
    });
    return { status: response.status, count: response.headers.get('content-range') };
  } catch (error) {
    return { status: 0, error: error instanceof Error ? error.message : String(error) };
  }
}

async function main() {
  console.log(`\n${c.bold('Supabase bağlantı denetimi')}\n`);

  const env = await loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!existsSync(ENV_FILE)) {
    console.log(`${NO} .env.local bulunamadı.`);
    console.log(`  ${c.dim('cp .env.local.example .env.local')}\n`);
    process.exit(1);
  }

  /* -- Ortam ------------------------------------------------------------- */
  console.log(c.bold('Ortam'));
  console.log(`  ${url ? OK : NO} NEXT_PUBLIC_SUPABASE_URL       ${url ? c.dim(url) : c.red('eksik')}`);
  console.log(
    `  ${anon ? OK : NO} NEXT_PUBLIC_SUPABASE_ANON_KEY  ${anon ? c.dim(`${anon.slice(0, 12)}… (${anon.length} karakter)`) : c.red('eksik')}`,
  );
  console.log(
    `  ${service ? OK : WARN} SUPABASE_SERVICE_ROLE_KEY      ${service ? c.dim(`${service.slice(0, 12)}… (${service.length} karakter)`) : c.yellow('eksik — tohumlama ve ödeme callback’i çalışmaz')}`,
  );

  if (!url || !anon) {
    // Proje referansı URL'den türetilir: https://<ref>.supabase.co
    const ref = url?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    console.log(`\n${NO} Zorunlu anahtarlar eksik.`);
    console.log(
      `  Panel → Project Settings → API Keys\n  ${c.cyan(
        ref
          ? `https://supabase.com/dashboard/project/${ref}/settings/api-keys`
          : 'https://supabase.com/dashboard',
      )}\n`,
    );
    process.exit(1);
  }

  /* -- Erişim ------------------------------------------------------------ */
  console.log(`\n${c.bold('Erişim')}`);

  // `/rest/v1/` kökü publishable anahtarlara kapalıdır ve her hâlükârda 401 döner.
  // Bu yüzden gerçek bir tabloya sorarak sınıyoruz: 404/PGRST205 gelmesi bile
  // kimlik doğrulamanın geçtiğini, yalnızca şemanın eksik olduğunu gösterir.
  let restOk = false;
  let restNote = '';
  try {
    const probe = await fetch(`${url}/rest/v1/products?select=id&limit=1`, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
      signal: AbortSignal.timeout(15000),
    });
    const body = await probe.json().catch(() => ({}));

    if (probe.status === 401) {
      restNote = c.red('  → anahtar reddedildi');
    } else if (body?.code === 'PGRST205' || probe.status === 404) {
      restOk = true;
      restNote = c.dim('  (anahtar geçerli, şema henüz uygulanmamış)');
    } else {
      restOk = probe.status < 400;
    }
    console.log(`  ${restOk ? OK : NO} REST API ${c.dim(`HTTP ${probe.status}`)}${restNote}`);
  } catch (error) {
    console.log(
      `  ${NO} REST uç noktasına ulaşılamadı — ${error instanceof Error ? error.message : error}`,
    );
    process.exit(1);
  }

  try {
    const auth = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: anon },
      signal: AbortSignal.timeout(15000),
    });
    console.log(`  ${auth.ok ? OK : NO} Auth servisi ${c.dim(`HTTP ${auth.status}`)}`);
  } catch {
    console.log(`  ${NO} Auth servisine ulaşılamadı`);
  }

  if (!restOk) {
    console.log(`\n${NO} anon anahtarı reddedildi. Panelden yeniden kopyalayın.\n`);
    process.exit(1);
  }

  /* -- Tablolar ----------------------------------------------------------- */
  // Sayım servis anahtarıyla yapılır. Anon anahtarla RLS korumalı tablolar
  // (users, orders, addresses…) 403 değil, 200 + 0 satır döner; bu da dolu
  // bir tabloyu "0 kayıt" gibi gösterip yanıltır.
  const countKey = service ?? anon;
  console.log(
    `\n${c.bold('Tablolar')} ${c.dim(
      service ? '(public şeması)' : '(public şeması — anon anahtar: RLS arkasındaki satırlar sayılmaz)',
    )}`,
  );

  const results = await Promise.all(
    TABLES.map(async (table) => {
      const r = await head(`${url}/rest/v1/${table}?select=*&limit=1`, countKey);
      return { table, ...r };
    }),
  );

  let missing = 0;
  for (const { table, status, count } of results) {
    if (status === 404 || status === 400 || status === 406) {
      missing++;
      console.log(`  ${NO} ${table.padEnd(13)} ${c.red('yok')}`);
    } else if (status === 401 || status === 403) {
      // RLS tabloyu gizliyor olabilir — yine de var demektir.
      console.log(`  ${OK} ${table.padEnd(13)} ${c.dim('var (RLS ile korunuyor)')}`);
    } else {
      const rows = count?.split('/')?.[1] ?? '?';
      console.log(`  ${OK} ${table.padEnd(13)} ${c.dim(`${rows} kayıt`)}`);
    }
  }

  /* -- Özet --------------------------------------------------------------- */
  console.log('');
  if (missing > 0) {
    console.log(`${WARN} ${missing} tablo eksik. Şemayı uygulayın:`);
    console.log(
      `  ${c.cyan('Dashboard → SQL Editor')} → ${c.bold('supabase/setup.sql')} dosyasının tamamını yapıştırıp çalıştırın.`,
    );
    console.log(`  ${c.dim('veya:  npx supabase link --project-ref <ref> && npx supabase db push')}\n`);
    process.exit(1);
  }

  console.log(`${OK} ${c.green('Tüm tablolar hazır — proje veritabanına bağlı.')}`);
  console.log(`\n${c.bold('Sonraki adımlar')}`);
  console.log(`  1. Katalog verisini aktar:`);
  console.log(
    c.dim(
      `     curl -X POST http://localhost:3000/api/admin/seed -H "x-seed-token: $SUPABASE_SERVICE_ROLE_KEY"`,
    ),
  );
  console.log(`  2. Üye olun (/register), ardından kendinizi yönetici yapın:`);
  console.log(c.dim(`     update public.users set role = 'admin' where email = 'sizin@epostaniz.com';`));
  console.log('');
}

main().catch((error) => {
  console.error(`\n${NO} Beklenmeyen hata:`, error);
  process.exit(1);
});
