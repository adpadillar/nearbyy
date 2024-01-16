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
          items: [
            { label: "Getting Started", link: "/guides/getting-started/" },
          ],
        },
      ],

      // sidebar: [
      //   {
      //     label: "Guides",
      //     items: [
      //       // Each item here is one entry in the navigation menu.
      //       { label: "Example Guide", link: "/guides/example/" },
      //     ],
      //   },
      //   {
      //     label: "Reference",
      //     autogenerate: { directory: "reference" },
      //   },
      // ],
    }),
  ],
});
