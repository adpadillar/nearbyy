"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import { env } from "~/env";

if (typeof window !== "undefined") {
  const currentUrl = new URL(window.location.href);
  const isLocal = currentUrl.hostname === "localhost";

  if (!isLocal) {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: `https://${currentUrl.host}/ingest`,
      ui_host: "https://app.posthog.com",
    });
  }
}
export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
