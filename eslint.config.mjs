import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

/**
 * Flat config. Next.js 16 exports its presets in this format directly, so
 * FlatCompat is not needed.
 *
 * Order matters: later blocks override earlier ones, which is why the
 * project's own rules sit at the end.
 */
const eslintConfig = [
  /* Nothing here is ours to lint: build output, dependencies, generated
     types, static assets and the SQL under supabase/. */
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'coverage/**',
      'node_modules/**',
      'public/**',
      'next-env.d.ts',
      'supabase/**',
    ],
  },

  /* Next's own presets: accessibility, image and script rules from
     core-web-vitals, plus the TypeScript layer. */
  ...coreWebVitals,
  ...typescript,

  /* Project rules. */
  {
    rules: {
      /**
       * Unused code is an error rather than a warning. As a warning it is easy
       * to walk past — an import left behind after a refactor survived a full
       * lint run in this project until it was spotted by hand.
       *
       * The underscore prefix stays available for the cases where an unused
       * binding is deliberate: a positional callback argument, or a rest
       * spread used to drop a key from an object.
       */
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];

export default eslintConfig;
