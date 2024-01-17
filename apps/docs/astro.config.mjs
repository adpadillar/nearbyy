import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Nearbyy Docs",
      sidebar: [
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
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
