"use client";

import { useTailwindBreakpoints } from "~/hooks/useTailwindBreakpoints";
import PricingCard from "./PricingCard";

interface PricingProps {
  children?: React.ReactNode;
  path: string;
}

const Pricing: React.FC<PricingProps> = ({ path }) => {
  const breakpoint = useTailwindBreakpoints();

  return (
    <div className="z-20 flex max-w-[70rem] flex-col items-center space-y-4 ">
      {/* Title and subtitle */}
      <div className="flex flex-col items-center">
        <h1
          style={{ textWrap: "balance" }}
          className=" px-10 text-center text-5xl font-bold text-white sm:text-5xl md:text-6xl"
        >
          Empower Your Growth,
        </h1>
        <h1 className="inline-block bg-gradient-to-r from-red-600 to-[#166AE8] bg-clip-text text-center text-5xl  font-bold text-transparent sm:text-5xl  md:text-6xl ">
          explore pricing.
        </h1>
        <h2 className="px-10 pb-8 pt-10 text-justify  text-lg font-normal text-white text-opacity-70 sm:pb-10 sm:pt-6  ">
          Start building something great, minus the pricing puzzle
        </h2>
      </div>

      <div className=" grid grid-cols-1 gap-y-8 px-8 sm:grid-cols-2  sm:gap-x-4 sm:px-4 lg:grid-cols-3 lg:gap-x-4 lg:px-4 xl:gap-x-6">
        {/* BOX 1 */}
        <div className="flex items-center justify-center">
          <PricingCard
            content={{
              header: "Hobby Plan",
              headerStyle: "primary",
              subTitle: "The best plan to start prototyping your app for free!",
              price: "0 USD",
              timeLabel: "/month",
              linkText: "Get started",
              path: path,
              list: [
                "Up to 250 files*",
                "20k queries/month",
                "1 developer/project",
              ],
              note: "*Or 1 GB, whichever comes first",
              linkStyle: "primary",
            }}
          />
        </div>
        {/* BOX 2 */}
        <div className="flex items-center justify-center">
          <PricingCard
            content={{
              header: "Pro Plan",
              subTitle:
                "All the tools and features you need for launching your app",
              price: "19 USD",
              timeLabel: "/month",
              linkText: "Get started!",
              path: path,
              list: [
                "Up to 5000 files",
                "1M queries/month",
                "5 developers/project",
                "Custom GPTs",
              ],
              linkStyle: "secondary",
              topLabelText: "Coming Soon",
            }}
          />
        </div>
        {/* BOX 3 */}
        <div className="col-span-1 flex items-center justify-center sm:col-span-2 lg:col-span-1">
          <PricingCard
            content={{
              header: "Enterprise",
              headerStyle: "primary",
              subTitle:
                breakpoint === "lg"
                  ? "More files, more devs, and usage based pricing"
                  : "Is Pro not Pro enough? More files, more devs, and usage based pricing",
              price: "Custom*",
              path: path,
              linkText: "Schedule a call",
              list: [
                "Everything in Pro",
                "After that, usage based pricing",
                "Dedicated support",
              ],
              topLabelText: "Coming Soon",
              note: "*Starts at 199 USD/month",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
