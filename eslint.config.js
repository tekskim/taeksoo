// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import unusedImports from 'eslint-plugin-unused-imports'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig([
  globalIgnores(['dist', 'docs', 'storybook-static', 'coverage', 'thaki-shared-v2', 'thaki-shared-components']),
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.stories.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactRefresh.configs.vite,
      prettierConfig, // Prettier와 충돌하는 ESLint 규칙 비활성화
    ],
    plugins: {
      'unused-imports': unusedImports,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off',
      // React hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
      // These are overly strict for our codebase patterns
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-useless-escape': 'off',
    },
  },
  // Storybook files - relaxed hooks rules since render functions use hooks differently
  {
    files: ['**/*.stories.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      prettierConfig,
    ],
    plugins: {
      'unused-imports': unusedImports,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
])
