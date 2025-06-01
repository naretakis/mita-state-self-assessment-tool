module.exports = {
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  plugins: [
    "@typescript-eslint",
    "react",
    "jsx-a11y"
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unsafe-declaration-merging": "off",
    "react-hooks/rules-of-hooks": "off",
    "@next/next/no-duplicate-head": "off"
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};