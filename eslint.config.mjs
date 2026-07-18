// Flat-config ESLint for the Docusaurus site (CLAUDE.md §2.4a / §6.4).
// `npm run lint` is a CI gate that must pass with ZERO errors.
//
// Three linting surfaces, each with its own globals:
//   - src/**/*.{ts,tsx}      the browser React theme components + client modules
//   - src/**/*.mjs           pure browser-consumed ESM (no DOM globals needed)
//   - scripts/**, tests/**   Node ESM (build scripts + the node:test suites)
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    // Generated output + third-party trees are never linted.
    ignores: ["dist", ".docusaurus", "build", "coverage", "playwright-report", "test-results"],
  },
  {
    // Browser React: theme swizzles, pages, and TS client modules.
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    // Pure browser-consumed ESM helper (no JSX, no DOM access).
    extends: [js.configs.recommended],
    files: ["src/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
  },
  {
    // Node ESM: the build/generation scripts and the node:test unit suites.
    // The suites drive a jsdom document, so browser globals are in scope too.
    extends: [js.configs.recommended],
    files: ["scripts/**/*.mjs", "tests/**/*.mjs", "*.config.{js,mjs}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    // Playwright e2e specs run under Node with browser-side page contexts.
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["tests/e2e/**/*.ts", "playwright.config.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
);
