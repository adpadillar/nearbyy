import Navigation from "~/components/Navigation";
import SideBlob from "~/components/SideBlob";

export const runtime = "edge";
export const preferredRegion = "iad1";

export default async function HomePage() {
  return (
    <main>
      <Navigation />
      <div className="pt-20">
        <h1 className="text-center text-2xl text-white">
          AI Context Made Simple: Upload, Search, Access
        </h1>

        <SideBlob side="right" className="absolute right-0" />
        <SideBlob side="left" className="absolute -bottom-40 left-0" />
      </div>
    </main>
  );
}
