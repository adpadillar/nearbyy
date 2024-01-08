import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";

import "~/styles/globals.css";

import ReactQueryProvider from "~/components/ReactQueryProvider";
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
    <ClerkProvider>
      <ReactQueryProvider>
        <html lang="en">
          <body className={`min-h-screen bg-[#1C1C1C] ${GeistSans.className}`}>
            {props.children}
          </body>
        </html>
      </ReactQueryProvider>
    </ClerkProvider>
  );
}
