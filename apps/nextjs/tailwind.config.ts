import type { Config } from "tailwindcss";

import baseConfig from "@nearbyy/tailwind-config";

export default {
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [baseConfig],
  corePlugins: {
    // Prevent base styles from applying
    // This may break things when using multiple
    // CSS tailwind sources, such as @nearbyy/ui
    preflight: false,
  },
} satisfies Config;
