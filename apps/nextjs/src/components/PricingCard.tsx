"use client";

import Image from "next/image";
import Link from "next/link";

interface PricingCardProps {
  children?: React.ReactNode;
  content: {
    header: string;
    subTitle: string;
    price?: string;
    timeLabel?: string;
    linkText: string;
    linkStyle?: "primary" | "secondary";
    path: string;
    list: string[];
    note?: string;
    headerStyle?: "primary";
    topLabelText?: string;
    topLabelStyle?: string;
  };
}

const PricingCard: React.FC<PricingCardProps> = ({ content }) => {
  return (
    <div className="relative z-10 rounded-3xl bg-gradient-to-br from-red-600 to-[#166AE8] p-[0.1rem]  shadow-2xl">
      <div className="h-full rounded-3xl bg-[#151515] pl-10 pr-10">
        <div className="flex flex-col space-y-6 pt-11">
          <div className="flex space-x-10">
            <h1
              className={
                content.headerStyle === "primary"
                  ? "text-2xl font-semibold text-white"
                  : "inline-block bg-gradient-to-r from-red-600 to-[#166AE8] bg-clip-text text-2xl font-semibold text-transparent"
              }
            >
              {content.header}
            </h1>
            {content.topLabelText && (
              <h2
                className={
                  content.topLabelStyle ??
                  "h-7 w-20 rounded-full border-2 border-[#166AE8] text-center text-sm font-extralight text-white"
                }
              >
                {content.topLabelText}
              </h2>
            )}
          </div>
          <h2 className="text-base font-normal text-white text-opacity-70">
            {content.subTitle}
          </h2>
        </div>

        <div className="flex flex-col space-y-7 pt-11">
          <div className="flex items-end">
            {content.price && (
              <h1 className="text-4xl font-bold text-white">{content.price}</h1>
            )}
            {content.timeLabel && (
              <h2 className="text-base text-white">{content.timeLabel}</h2>
            )}
          </div>
          <Link
            href={content.path}
            className={
              content.linkStyle === "primary"
                ? " rounded-md border-2 border-red-600 p-2 text-center text-sm font-semibold text-white"
                : content.linkStyle === "secondary"
                  ? "rounded-md bg-gradient-to-r from-red-600 to-[#166AE8] p-2 text-center text-sm font-semibold text-[#151515]"
                  : "rounded-md border-2 border-[#166AE8] p-2 text-center text-sm font-semibold text-white"
            }
          >
            {content.linkText}
          </Link>
        </div>

        <div className="flex flex-col space-y-2 pt-5">
          {content.list.map((element, index) => (
            <div key={index + "_checkmark"} className="flex space-x-2">
              <Image
                className="h-6 w-7"
                src="/brand/checkmarkIcon.svg"
                width={298}
                height={43}
                alt="checkmark Icon"
              />
              <h2 className="text-base text-white">{element}</h2>
            </div>
          ))}
          {content.note && (
            <h3 className=" text-xs text-white">{content.note}</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
