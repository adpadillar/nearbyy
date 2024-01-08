import Link from "next/link";

import Navigation from "~/components/Navigation";
import SideBlob from "~/components/SideBlob";

export const runtime = "edge";
export const preferredRegion = "iad1";

export default async function HomePage() {
  return (
    <main>
      <Navigation />
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="absolute z-40 flex flex-col items-center justify-center space-y-12">
          <div className="flex flex-col items-center justify-center space-y-8">
            <h1 className="max-w-4xl text-center text-7xl font-bold text-white">
              AI Context Made Simple: Upload, Search, Access
            </h1>

            <p className="text-xl font-light text-[#F2F6FA] opacity-80">
              Extend your AI model capabilities with a simple API call
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-full border bg-black px-12 py-4 text-center text-xl text-white transition-all hover:scale-105 active:scale-95"
          >
            join the beta now!
          </Link>
        </div>

        <SideBlob className="absolute -left-32 -top-[60rem] z-0 -translate-x-[20%] scale-50 opacity-70" />
        <SideBlob className="absolute -top-[60rem] right-32 z-0 translate-x-[35%] -scale-x-50 scale-y-50 opacity-70" />
      </div>
    </main>
  );
}
