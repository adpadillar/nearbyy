import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Nearbyy Docs",
      logo: {
        dark: "./src/assets/logo.svg",
        light: "./src/assets/logo-dark.svg",
        alt: "Nearbyy Logo",
        replacesTitle: true,
      },
      sidebar: [
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Typescript SDK",
          autogenerate: { directory: "typescript-sdk" },
        },
        {
          label: "API Reference",
          autogenerate: { directory: "api-reference" },
        },
        {
          label: "FAQ",
          autogenerate: { directory: "faq" },
        },
      ],
    }),
  ],
  redirects: {
    "/": {
      destination: "/guides/introduction",
      status: 302,
    },
  },
});
