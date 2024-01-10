import Navigation from "~/components/Navigation";
import SideBlob from "~/components/SideBlob";

export const runtime = "edge";
export const preferredRegion = "iad1";

export default async function HomePage() {
  return (
    <main>
      <Navigation />
      <div className="flex min-h-[80vh] items-center justify-center">
        <h1 className="max-w-4xl text-center text-6xl font-extrabold leading-relaxed text-white">
          AI Context Made Simple: Upload, Search, Access
        </h1>
      </div>
      <SideBlob side="right" className="absolute right-0 top-0" />
      <SideBlob side="left" className="absolute -bottom-40 left-0" />
    </main>
  );
}
