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
    <div className="relative z-10 max-w-sm rounded-3xl bg-gradient-to-t from-[#166AE8] to-red-600 p-[0.1rem]  shadow-2xl">
      <div className="h-full rounded-3xl bg-[#151515] p-10">
        <div className="flex flex-col space-y-6 ">
          <div className="flex justify-between">
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
                  " flex items-center justify-center rounded-full border-2 border-[#166AE8] px-2 text-center text-xs font-semibold text-[#166AE8]"
                }
              >
                {content.topLabelText}
              </h2>
            )}
          </div>
          <h2 className="text-[0.97rem] font-normal text-white text-opacity-70">
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
                ? " rounded-md border-2 border-red-600 p-[10px] text-center text-sm font-semibold text-white"
                : content.linkStyle === "secondary"
                  ? "rounded-md bg-gradient-to-r from-red-600 to-[#166AE8] p-[10px] text-center text-sm font-semibold text-[#151515]"
                  : "rounded-md border-2 border-[#166AE8] p-[10px] text-center text-sm font-semibold text-white"
            }
          >
            {content.linkText}
          </Link>
        </div>

        <div className="flex flex-col space-y-3 pt-8">
          {content.list.map((element, index) => (
            <div key={index + "_checkmark"} className="flex space-x-3">
              <Image
                className="h-5 w-6"
                src="/brand/checkmarkIcon.svg"
                width={298}
                height={43}
                alt="checkmark Icon"
              />
              <h2 className="text-[14.5px] text-white text-opacity-70">
                {element}
              </h2>
            </div>
          ))}
          {content.note && (
            <h3 className=" pt-4 text-xs text-white text-opacity-70">
              {content.note}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
