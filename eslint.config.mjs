import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

/** Next.js 16 düz (flat) yapılandırmayı doğrudan sunuyor; FlatCompat gerekmiyor. */
const eslintConfig = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'supabase/**'] },
  ...coreWebVitals,
  ...typescript,
];

export default eslintConfig;
