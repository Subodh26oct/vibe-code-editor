import nextConfig from "eslint-config-next";

export default [
  {
    ignores: [
      "vibecode-starters/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  ...nextConfig,
  {
    settings: {
      react: {
        version: "19.0",
      },
    },
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
