import Navigation from "~/components/Navigation";
import SideBlob from "~/components/SideBlob";

export const runtime = "edge";
export const preferredRegion = "iad1";

export default async function HomePage() {
  return (
    <main>
      <Navigation />
      <div
        className="flex min-h-screen w-screen flex-col items-center justify-center"
        style={{
          backgroundImage: `url(/brand/pattern.svg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <SideBlob className="absolute -left-72 -top-1/2" />
      </div>
    </main>
  );
}
