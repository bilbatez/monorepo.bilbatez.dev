import eslint from '@eslint/js';
import eslintNextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

const bilbatezdevConfig = {
  plugins: {
    next: eslintNextPlugin,
  },
  settings: {
    next: {
      rootDir: 'bilbatez.dev/',
    },
  },
};

const kprfordummiesConfig = {
  plugins: {
    next: eslintNextPlugin,
  },
  settings: {
    next: {
      rootDir: 'kprfordummies/',
    },
  },
};

const projectConfigs = [bilbatezdevConfig, kprfordummiesConfig];

export default defineConfig([
  globalIgnores([
    '**/.next/**',
    '**/out/**',
    '**/build/**',
    '**/next-env.d.ts',
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  ...projectConfigs,
  prettierConfig,
]);
