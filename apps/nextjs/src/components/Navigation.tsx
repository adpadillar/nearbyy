"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface NavigationProps {
  children?: React.ReactNode;
}

const Navigation: React.FC<NavigationProps> = () => {
  return (
    <div className="fixed top-0 z-50 flex w-screen items-center justify-start bg-[#161616] px-8 ">
      <div className="flex w-full max-w-5xl space-x-[74px] px-4 py-6">
        <div>
          <Image
            src="/brand/logo.svg"
            width={298 * 0.5}
            height={43 * 0.5}
            alt="Nearbyy"
          />
        </div>
        <div className="flex space-x-[47px] text-[15px] font-light ">
          <Link href={"#"} className="text-center text-white">
            Documentation
          </Link>
          <Link href={"#"} className="text-center text-white">
            Pricing
          </Link>
          <Link href={"#"} className="text-center text-white">
            Showcase
          </Link>
          <Link href={"/dashboard"} className="text-center text-white">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
