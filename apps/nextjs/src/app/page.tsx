import Link from "next/link";
import { GeistMono } from "geist/font/mono";

import Navigation from "~/components/Navigation";
import SideBlob from "~/components/SideBlob";

export const runtime = "edge";
export const preferredRegion = "iad1";

export default async function HomePage() {
  return (
    <main>
      <Navigation />
      <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-8 pt-44">
        <h1 className="max-w-4xl text-center text-[65px] font-extrabold leading-[78px] -tracking-[3px] text-white">
          AI Context Made Simple: Upload, Search, Access
        </h1>
        <h2 className="text-center text-2xl font-thin text-white">
          Extend your AI model capabilities with a simple API call
        </h2>
        <div className="flex space-x-4 pt-8">
          <Link
            href="/dashboard"
            className="flex items-center justify-center rounded-[28px] border border-white bg-black/[0.44] px-10 py-4 text-xl font-extralight text-white"
          >
            get started!
          </Link>
          <pre
            className={`${GeistMono.className} flex items-center justify-center rounded-[18px] border border-white bg-black/[0.44] px-10 py-4 font-mono text-lg  text-white`}
          >
            npm install @nearbyy/core
          </pre>
        </div>
      </div>
      <SideBlob
        side="right"
        className="pointer-events-none absolute right-0 top-0"
      />
      <SideBlob
        side="left"
        className="pointer-events-none absolute -bottom-40 left-0"
      />
    </main>
  );
}
