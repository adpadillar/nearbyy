import Image from "next/image";
import Link from "next/link";
import { GeistMono } from "geist/font/mono";

import Footer from "~/components/Footer";
import Navigation from "~/components/Navigation";
import Pricing from "~/components/Pricing";
import Shiki from "~/components/Shiki.server";
import SideBlob from "~/components/SideBlob";
import { env } from "~/env";

export default async function HomePage() {
  const res = await fetch(
    `${env.VERCEL_URL ?? "http://localhost:3000"}/example/example-home.ts`,
  );

  const text = (await res.text()) as string;
  return (
    <main>
      <Navigation />
      <Image
        alt="background_image"
        src="/brand/background_pattern.svg"
        width={1446}
        height={943}
        className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 w-full opacity-50"
      />
      <div className=" flex min-h-[80vh] flex-col items-center justify-center space-y-9 pt-56">
        <h1 className="z-10 max-w-4xl text-center text-[65px] font-extrabold leading-[78px] -tracking-[3px] text-white">
          AI Context Made Simple: Upload, Search, Access
        </h1>
        <h2 className="text-center text-2xl font-thin text-white">
          Extend your AI model capabilities with a simple API call
        </h2>
        <div className=" relative z-10 flex space-x-4 pt-6">
          <Link
            href="/dashboard"
            className="flex items-center justify-center rounded-[28px] border-2 border-black bg-black/[0.44] px-10 py-4 text-xl font-extralight text-white"
          >
            get started!
          </Link>
          <pre
            className={`${GeistMono.className} flex items-center justify-center rounded-[18px] border-2 border-black bg-black/[0.44] px-10 py-4 text-lg  text-white`}
          >
            npm install @nearbyy/core
          </pre>
        </div>
        <div className="pt-8">
          <div className=" relative z-10 rounded-md bg-gradient-to-br from-red-600 to-cyan-500 p-[0.1rem]  shadow-2xl">
            <Shiki
              code={text}
              lang="ts"
              theme="css-variables"
              className=" w-[50vw] min-w-[40rem] rounded-md p-8"
            ></Shiki>
          </div>
        </div>
      </div>
      <div className=" relative flex flex-col items-center justify-center  pb-32 pt-48">
        <Pricing path="/dashboard" />
        {/* Pricing blob */}
        <div
          className="w-[80%]"
          style={{
            position: "absolute",
            height: "497px",
            bottom: "80px",
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
      <div className="relative z-10">
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
