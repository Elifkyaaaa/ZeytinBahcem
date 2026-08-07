#!/usr/bin/env node
/**
 * İki adımlı doğrulama kurtarma.
 *
 *   npm run mfa:reset -- eposta@adresiniz.com
 *
 * Doğrulayıcı uygulamaya erişimini kaybeden bir kullanıcının TOTP
 * faktörlerini kaldırır. Servis rolü anahtarı gerektirir, yani yalnızca
 * sunucuya/`.env.local`'a erişimi olan kişi çalıştırabilir.
 *
 * Kullanıcı bundan sonra yalnızca şifresiyle girer; güvenliği yeniden
 * kurmak için /hesap/guvenlik üzerinden tekrar kurulum yapmalıdır.
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
};

async function loadEnv() {
  const file = path.join(process.cwd(), '.env.local');
  if (!existsSync(file)) return {};
  const raw = await readFile(file, 'utf8');
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
  const email = process.argv[2]?.trim().toLowerCase();

  console.log(`\n${c.bold('İki adımlı doğrulama sıfırlama')}\n`);

  if (!email) {
    console.log(`${c.red('✗')} E-posta adresi belirtilmedi.`);
    console.log(`  ${c.dim('npm run mfa:reset -- eposta@adresiniz.com')}\n`);
    process.exit(1);
  }

  const env = await loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.log(`${c.red('✗')} NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY eksik.\n`);
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Kullanıcıyı e-postadan bul
  const { data: list, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listError) {
    console.log(`${c.red('✗')} Kullanıcı listesi okunamadı: ${listError.message}\n`);
    process.exit(1);
  }

  const user = list.users.find((u) => u.email?.toLowerCase() === email);
  if (!user) {
    console.log(`${c.red('✗')} ${email} adresiyle kayıtlı kullanıcı bulunamadı.\n`);
    process.exit(1);
  }

  const { data: factorData, error: factorError } = await supabase.auth.admin.mfa.listFactors({
    userId: user.id,
  });

  if (factorError) {
    console.log(`${c.red('✗')} Faktörler okunamadı: ${factorError.message}\n`);
    process.exit(1);
  }

  const factors = factorData?.factors ?? [];

  if (factors.length === 0) {
    console.log(`${c.yellow('!')} ${email} için kayıtlı doğrulayıcı yok — yapılacak bir şey yok.\n`);
    return;
  }

  console.log(`  Kullanıcı : ${user.email}`);
  console.log(`  Faktör    : ${factors.length} adet\n`);

  let removed = 0;
  for (const factor of factors) {
    const { error } = await supabase.auth.admin.mfa.deleteFactor({
      id: factor.id,
      userId: user.id,
    });
    if (error) {
      console.log(`  ${c.red('✗')} ${factor.id} kaldırılamadı: ${error.message}`);
    } else {
      console.log(`  ${c.green('✓')} ${factor.friendly_name ?? factor.id} kaldırıldı`);
      removed++;
    }
  }

  console.log(
    `\n${c.green('✓')} ${removed} faktör kaldırıldı. ${user.email} artık yalnızca şifresiyle girebilir.`,
  );
  console.log(
    `  ${c.yellow('Öneri:')} Giriş yaptıktan sonra /hesap/guvenlik üzerinden yeniden kurun.\n`,
  );
}

main().catch((error) => {
  console.error(`\n${c.red('✗')} Beklenmeyen hata:`, error);
  process.exit(1);
});
