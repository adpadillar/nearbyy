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
    <div className="relative w-full overflow-hidden bg-[#1A1A1A] px-6 pb-20 pt-12 md:px-24">
      <div className=" absolute -right-10 bottom-0 top-8 z-0 min-h-[24rem] min-w-[24rem]">
        <Image
          className="w-full"
          style={{ opacity: 0.7 }}
          src="/brand/bgFooter.svg"
          width={298}
          height={43}
          alt="checkmark Icon"
        />
      </div>

      <div className=" relative z-10 flex justify-between  pb-12">
        <div className="flex space-x-20">
          {content.map((element, index) => (
            <div key={index + "_colummn"} className="flex flex-col space-y-2">
              <h2 className=" pb-2 text-base font-normal text-white text-opacity-50 ">
                {element.header}
              </h2>
              {element.bulletpoints.map((element, index) => (
                <Link
                  className="text-base font-light text-white "
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
            className="h-8 w-8"
            src="/brand/githubIcon.svg"
            width={298}
            height={43}
            alt="checkmark Icon"
          />
          <Image
            className="h-8 w-8"
            src="/brand/discordIcon.svg"
            width={298}
            height={43}
            alt="checkmark Icon"
          />
          <Image
            className="h-8 w-8"
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
      />

      <div className="relative z-10 flex justify-between pt-12">
        <div className="flex space-x-14 ">
          <Link
            href="#"
            className=" text-base font-light text-white text-opacity-70"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className=" text-base font-light text-white text-opacity-70"
          >
            Terms of Service
          </Link>
        </div>

        <h2 className="text-base font-light text-white text-opacity-70">
          Copyright Nearbyy © 2024
        </h2>
      </div>
    </div>
  );
};

export default Footer;
