"use client";

import PricingCard from "./PricingCard";

interface PricingProps {
  children?: React.ReactNode;
  path: string;
}

const Pricing: React.FC<PricingProps> = ({ path }) => {
  return (
    <div className="flex max-w-5xl flex-col items-center space-y-4 ">
      {/* Title and subtitle */}
      <div className="flex flex-col items-center">
        <h1 className="text-6xl font-bold text-white">Worry about your app</h1>
        <h1 className=" inline-block bg-gradient-to-r from-red-600 to-[#166AE8] bg-clip-text text-6xl  font-bold text-transparent">
          not your bill.
        </h1>
        <h2 className="pb-10 pt-6 font-normal text-white text-opacity-70 ">
          We wanted pricing to be as simple as possible. No calculator needed.
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-x-6">
        {/* BOX 1 */}
        <PricingCard
          content={{
            header: "2GB App",
            headerStyle: "primary",
            subTitle: "Everything you need to start uploading!",
            price: "$0",
            timeLabel: "/month",
            linkText: "Get started",
            path: path,
            list: [
              "2GB of storage *",
              "Unlimited uploads and downloads",
              "(Probably) cheaper than a cup of coffee",
            ],
            note: "* Storage shared between all apps",
            linkStyle: "primary",
          }}
        ></PricingCard>

        {/* BOX 2 */}
        <PricingCard
          content={{
            header: "100GB App",
            subTitle: "For those with teams or more than 2 gigs of files",
            price: "$10",
            timeLabel: "/month",
            linkText: "Get started",
            path: path,
            list: [
              "100GB of storage",
              "Up to 10 developers",
              "Regions",
              "Private Files",
            ],
            linkStyle: "secondary",
            topLabelText: "Theo´s fav",
          }}
        ></PricingCard>

        {/* BOX 3 */}
        <PricingCard
          content={{
            header: "Unlimited Apps(s)",
            headerStyle: "primary",
            subTitle:
              "Need more gigs? More devs? More help convincing your boss?",
            price: "Custom",
            path: path,
            linkText: "Schedule a call",
            list: [
              "Usage based pricing",
              "Unlimited storage & devs",
              "Dedicated support",
              "Theo will hit you up sometimes",
            ],
          }}
        ></PricingCard>
      </div>
    </div>
  );
};

export default Pricing;
