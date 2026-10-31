// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";
import { restrictRawElements } from "@volo-uti/volo-web-ui/eslint";

export default defineConfig([
  globalIgnores([
    "**/dist/**",
    "**/node_modules/**",
    "**/.storybook/**",
    "**/storybook-static/**",
    "**/*.config.{js,mjs,cjs}",
  ]),
  js.configs.recommended,
  {
    name: "volo-web-admin-ui/typescript-react",
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      // The compiler-oriented rules of react-hooks 7 need source changes, so only the two classic rules are on
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React 17+ JSX transform: no need to import React
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // TypeScript
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-explicit-any": "warn",

      // TypeScript replaces no-undef (recommended by typescript-eslint)
      "no-undef": "off",

      // General
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
    settings: {
      react: { version: "19.3" },
    },
  },
  {
    name: "volo-web-admin-ui/node-scripts",
    files: ["**/scripts/**/*.{js,mjs}", "**/bin/**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  // The Storybook app uses @volo-uti/volo-web-ui instead of raw elements (inside the components, raw elements are correct)
  {
    name: "volo-web-admin-ui/storybook-raw-elements",
    files: ["stories/**/*.{ts,tsx}"],
    ...restrictRawElements(),
  },
  {
    name: "volo-web-admin-ui/tests",
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  prettierConfig,
  ...storybook.configs["flat/recommended"],
]);
