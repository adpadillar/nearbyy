import Image from "next/image";

import TailwindBreakpoints from "~/components/debug/TailwindBreakpoints";
import Footer from "~/components/Footer";
import ValueProposition from "~/components/landing/sections/ValueProposition";
import Navigation from "~/components/Navigation";
import Pricing from "~/components/Pricing";
import SideBlob from "~/components/SideBlob";

const text = `import { NearbyyClient } from "@nearbyy/core";

// Create a new NearbyyClient instance
const client = new NearbyyClient({
  API_KEY: "YOUR_API_KEY",
});

// Upload a file
await client.uploadFile({
  fileUrl: "https://example.com/image.jpg",
});

// Query for similar text
await client.queryDatabase({
  query: "This is some cool text",
});
`;

export default async function HomePage() {
  return (
    <main>
      <TailwindBreakpoints />
      <Navigation />
      <Image
        alt="background_image"
        src="/brand/gridLandingBg.svg"
        width={1446}
        height={943}
        className="pointer-events-none absolute bottom-0 top-20 w-full select-none pl-2 pr-2 opacity-50"
      />
      <ValueProposition text={text} />
      <div className=" relative flex flex-col items-center justify-center  pb-72 pt-52">
        <Pricing path="/dashboard" />
        {/* Pricing blob */}
        <div
          className="w-[80%]"
          style={{
            position: "absolute",
            height: "527px",
            bottom: "200px",
            background:
              "linear-gradient(66.22deg, rgba(255, 0, 0, 0.3) 33.46%, rgba(20, 0, 255, 0.3) 48.83%)",
            filter: "blur(178.125px)",
            borderRadius: "377.981px",
          }}
        />
        {/* <BackgroundPricing className="absolute bottom-0 left-0 right-0 top-0 w-full" /> */}
      </div>

      <SideBlob
        side="right_1"
        className="pointer-events-none absolute right-0 top-0"
      />
      <SideBlob
        side="left_1"
        className="pointer-events-none absolute -bottom-40 left-0"
      />
      {/* <SideBlob side="right_2" className="pointer-events-none absolute top-0" />
      <SideBlob
        side="left_2"
        className="pointer-events-none absolute right-0 top-0"
      /> */}
      {/* <SideBlob
        side="right_3"
        className="pointer-events-none absolute left-0 top-0"
      />
      <SideBlob
        side="left_3"
        className="pointer-events-none absolute right-0 top-0" 
      /> */}
      <div className="relative z-10 flex">
        <Footer
          content={[
            {
              header: "Resources",
              bulletpoints: [
                { text: "Documentation", path: "/dashboard" },
                { text: "Starter templates", path: "/dashboard" },
                { text: "Themes", path: "/dashboard" },
                { text: "Integrations", path: "/dashboard" },
              ],
            },
            {
              header: "About",
              bulletpoints: [
                { text: "Press", path: "/dashboard" },
                { text: "Telemetry", path: "/dashboard" },
                { text: "Partner with us!", path: "/dashboard" },
              ],
            },
            {
              header: "More links",
              bulletpoints: [
                { text: "Blog", path: "/dashboard" },
                { text: "Swag Shop", path: "/dashboard" },
                { text: "Wallpapers", path: "/dashboard" },
                { text: "Studio", path: "/dashboard" },
              ],
            },
          ]}
        />
      </div>

      {/* <div
        className="w-full "
        style={{
          position: "absolute",
          width: "1246px",
          height: "497px",
          left: "100px",
          top: "1537px",
          background:
            "linear-gradient(66.22deg, rgba(255, 0, 0, 0.3) 33.46%, rgba(20, 0, 255, 0.3) 48.83%)",
          filter: "blur(178.125px)",
          borderRadius: "377.981px",
        }}
      ></div> */}
    </main>
  );
}
