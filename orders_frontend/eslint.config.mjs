import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      ".angular/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "*.config.mjs",
    ]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        // Test globals
        describe: "readonly",
        beforeEach: "readonly",
        it: "readonly",
        expect: "readonly",

        // Browser globals (used by Angular app code)
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        HTMLElement: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        fetch: "readonly",
        crypto: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",

        // Node.js globals (used by SSR/server build and tooling)
        process: "readonly",
        console: "readonly"
      }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "off", // Turn off since TS handles this
      "no-unreachable": "error",
      "no-unexpected-multiline": "error",
      "no-unsafe-finally": "error",
      "no-invalid-regexp": "error",
      "no-obj-calls": "error",
      "no-dupe-keys": "error",
      "no-dupe-args": "error",
      "no-duplicate-case": "error",
      "no-empty-character-class": "error",
      "no-ex-assign": "error",
      "no-func-assign": "error",
      "no-inner-declarations": "error",
      "no-irregular-whitespace": "error",
      "no-sparse-arrays": "error",
      "use-isnan": "error",
      "valid-typeof": "error"
    }
  }
];
