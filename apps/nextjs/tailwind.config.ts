import type { Config } from "tailwindcss";

import baseConfig from "@nearbyy/tailwind-config";

export default {
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [baseConfig],
} satisfies Config;
