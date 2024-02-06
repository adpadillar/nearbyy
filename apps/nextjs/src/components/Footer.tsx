"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  children?: React.ReactNode;
  content: {
    header: string;
    bulletpoints: { text: string; path: string }[];
  }[];
}

const Footer: React.FC<FooterProps> = ({ content }) => {
  return (
    <div className="relative h-96 w-full overflow-hidden bg-[#1A1A1A] p-16">
      <div className="absolute -right-10 bottom-0 z-0 min-h-[24rem] min-w-[24rem]">
        <Image
          className="w-full"
          src="/brand/bgFooter.svg"
          width={298}
          height={43}
          alt="checkmark Icon"
        />
      </div>
      <div className=" z-10 flex justify-between  pb-12">
        <div className="flex space-x-4">
          {content.map((element, index) => (
            <div key={index + "_colummn"} className="flex flex-col space-y-2">
              <h2 className="font-mono text-base text-white text-opacity-50 ">
                {element.header}
              </h2>
              {element.bulletpoints.map((element, index) => (
                <Link
                  className="text-base font-normal text-white "
                  href={element.path}
                  key={index + "_links"}
                >
                  {element.text}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-between space-x-2">
          <Image
            className="h-5 w-6"
            src="/brand/githubIcon.svg"
            width={298}
            height={43}
            alt="checkmark Icon"
          />
          <Image
            className="h-5 w-6"
            src="/brand/discordIcon.svg"
            width={298}
            height={43}
            alt="checkmark Icon"
          />
          <Image
            className="h-5 w-6"
            src="/brand/twitterIcon.svg"
            width={298}
            height={43}
            alt="checkmark Icon"
          />
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: "0px",

          border: "0.5px solid rgba(255, 255, 255, 0.1)",
          transform: "rotate(0.04deg)",

          flex: "none",
          order: "1px",
          flexGrow: "0px",
        }}
        className="relative z-10"
      ></div>

      <div className="relative z-10 flex justify-between pt-12">
        <div className="flex space-x-4 ">
          <h2 className=" text-base font-normal text-white text-opacity-75">
            Privacy Policy
          </h2>
          <h2 className=" text-base font-normal text-white text-opacity-75">
            Terms of Service
          </h2>
        </div>

        <h2 className="text-base font-normal text-white text-opacity-75">
          Copyright Nearbyy © 2024
        </h2>
      </div>
    </div>
  );
};

export default Footer;
