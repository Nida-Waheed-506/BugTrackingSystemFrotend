import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    languageOptions: {
      globals: globals.browser, // Adjust for your environment (e.g., node, jest)
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json", // Important for type-aware rules
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      ...pluginJs.configs.recommended, // Assuming you want recommended JS rules
      // Add your specific TypeScript-ESLint rules here
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
];
