import React from "react";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { GeistMono } from "geist/font/mono";

import { cn } from "@nearbyy/ui";

import Shiki from "~/components/Shiki.server";

interface ValuePropositionProps {
  children?: React.ReactNode;
  text: string;
}

const headingVariants = cva(
  "z-10 max-w-4xl text-center font-extrabold text-white",
  {
    variants: {
      sizes: {
        base: "text-3xl",
        sm: "sm:text-5xl",
        lg: "lg:text-[65px] lg:leading-[78px] lg:-tracking-[3px]",
      },
    },
  },
);

const subheadingVariants = cva("text-center font-thin text-white", {
  variants: {
    sizes: {
      base: "text-base",
      sm: "sm:text-xl",
      lg: "lg:text-2xl",
    },
  },
});

const ValueProposition: React.FC<ValuePropositionProps> = ({ text }) => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-4 pt-36 sm:space-y-7 sm:pt-40 lg:space-y-9 lg:pt-56">
      <div>
        <h1
          className={cn(
            headingVariants({ sizes: "base" }),
            headingVariants({ sizes: "sm" }),
            headingVariants({ sizes: "lg" }),
          )}
        >
          AI Context Made Simple:
        </h1>
        <h1
          className={cn(
            headingVariants({ sizes: "base" }),
            headingVariants({ sizes: "sm" }),
            headingVariants({ sizes: "lg" }),
          )}
        >
          Upload, Search, Access
        </h1>
      </div>
      <h2
        className={cn(
          subheadingVariants({ sizes: "base" }),
          subheadingVariants({ sizes: "sm" }),
          subheadingVariants({ sizes: "lg" }),
        )}
      >
        Extend your AI model capabilities with a simple API call
      </h2>
      <div className=" relative z-10 flex space-x-4 pt-6">
        <Link
          href="/dashboard"
          className="flex items-center justify-center rounded-2xl border border-black bg-black/[0.44] px-4 py-3 text-base font-extralight text-white sm:rounded-3xl sm:px-5 sm:text-lg md:rounded-[28px] md:border-2 md:px-8 md:py-4 md:text-xl lg:px-10"
        >
          get started!
        </Link>
        <pre
          className={`${GeistMono.className} flex items-center justify-center rounded-lg border border-black bg-black/[0.44] px-4 py-3 text-sm text-white sm:rounded-xl sm:px-5 sm:text-base md:rounded-[18px] md:border-2 md:px-8 md:py-4 md:text-lg lg:px-10`}
        >
          npm install @nearbyy/core
        </pre>
      </div>
      <div className="pt-8">
        <div className=" relative z-10 rounded-2xl bg-gradient-to-br from-[#166AE8] to-red-600 p-[0.1rem] shadow-2xl  ">
          <Shiki
            code={text}
            lang="ts"
            theme="css-variables"
            className="w-[93vw] max-w-[30rem] overflow-x-scroll rounded-2xl p-6 text-sm sm:max-w-[38rem] sm:p-7 md:text-base lg:max-w-[46rem] lg:p-8"
          />
        </div>
      </div>
    </div>
  );
};

export default ValueProposition;
