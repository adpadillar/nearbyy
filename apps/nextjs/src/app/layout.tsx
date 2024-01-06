import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "~/styles/globals.css";

import ReactQueryProvider from "~/components/ReactQueryProvider";
import { env } from "~/env";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
          <body className={["font-sans", fontSans.variable].join(" ")}>
            {props.children}
          </body>
        </html>
      </ReactQueryProvider>
    </ClerkProvider>
  );
}
