// Importing env files here to validate on build
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverComponentsExternalPackages: [
      "tesseract.js",
      "jsdom",
      "dompurify",
      "@mozilla/readability",
    ],
  },
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@nearbyy/api",
    "@nearbyy/db",
    "@nearbyy/embeddings",
    "@nearbyy/auth",
    "@nearbyy/ui",
  ],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  redirects: async () => [
    {
      source: "/dashboard",
      destination: "/dashboard/projects",
      permanent: false,
    },
  ],
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
};

export default config;
