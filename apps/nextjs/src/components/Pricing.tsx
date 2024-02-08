"use client";

import PricingCard from "./PricingCard";

interface PricingProps {
  children?: React.ReactNode;
  path: string;
}

const Pricing: React.FC<PricingProps> = ({ path }) => {
  return (
    <div className="z-20 flex max-w-[70rem] flex-col items-center space-y-4 ">
      {/* Title and subtitle */}
      <div className="flex flex-col items-center">
        <h1 className="text-6xl font-bold text-white">Empower Your Growth,</h1>
        <h1 className=" inline-block bg-gradient-to-r from-red-600 to-[#166AE8] bg-clip-text text-6xl  font-bold text-transparent">
          explore pricing.
        </h1>
        <h2 className="pb-10 pt-6 font-normal text-white text-opacity-70 ">
          Start building something great, minus the pricing puzzle
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-x-6">
        {/* BOX 1 */}
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
        ></PricingCard>

        {/* BOX 2 */}
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
        ></PricingCard>

        {/* BOX 3 */}
        <PricingCard
          content={{
            header: "Enterprise",
            headerStyle: "primary",
            subTitle:
              "Is Pro not Pro enough? More files, more devs, and usage based pricing",
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
        ></PricingCard>
      </div>
    </div>
  );
};

export default Pricing;
