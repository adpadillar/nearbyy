// Importing env files here to validate on build
import "./src/env.js";

import CopyPlugin from "copy-webpack-plugin";

const dontBundlePdf2Json = new CopyPlugin({
  patterns: ["node_modules/pdf2json/**/*"],
});

/** @type {import("next").NextConfig} */
const config = {
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
  experimental: {
    serverComponentsExternalPackages: ["pdf2json"],
  },
  webpack: {
    externals: ["pdf2json"],
    plugins: [dontBundlePdf2Json],
  },
};

export default config;
