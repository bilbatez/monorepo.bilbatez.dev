import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    '**/dist/**',
    '**/build/**',
    '**/node_modules/**',
    '**/.claude/**',
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // react-hooks v7 new rules — disabled: set-state-in-effect fires on
      // intentional prop-to-state sync patterns; purity fires on Date.now()
      // in PDF filename (harmless); incompatible-library fires on TanStack
      // Table's known non-memoizable API (informational, not actionable)
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/incompatible-library': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    files: ['tests/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  prettierConfig,
]);
