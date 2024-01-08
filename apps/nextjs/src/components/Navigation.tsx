"use client";

import React from "react";
import Image from "next/image";

interface NavigationProps {
  children?: React.ReactNode;
}

const Navigation: React.FC<NavigationProps> = () => {
  return (
    <div className="fixed top-0 z-50 flex w-screen items-center justify-center bg-[#161616]">
      <div className="w-full max-w-5xl px-4 py-6">
        <div>
          <Image
            src="/brand/logo.png"
            width={298 * 0.6}
            height={43 * 0.6}
            alt="Nearbyy"
          />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
