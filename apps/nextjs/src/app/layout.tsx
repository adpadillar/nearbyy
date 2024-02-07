import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "~/styles/globals.css";
import "@nearbyy/ui/dist/output.css";

import { env } from "~/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? env.VERCEL_URL ?? "https://nearbyy.com"
      : "http://localhost:3000",
  ),
  title: "Nearbyy",
  description: "Simple API to enable Retrieval Augmented Generation (RAG)",
  openGraph: {
    title: "Nearbyy",
    description: "Simple API to enable Retrieval Augmented Generation (RAG)",
    url: env.VERCEL_URL ?? "https://nearbyy.com",
    siteName: "Nearbyy",
  },
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className={`min-h-screen bg-[#1C1C1C] ${GeistSans.className}`}>
        {props.children}
      </body>
    </html>
  );
}
