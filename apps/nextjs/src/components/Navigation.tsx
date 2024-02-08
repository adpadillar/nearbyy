"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

interface NavigationProps {
  children?: React.ReactNode;
}

const links = [
  { href: "#", label: "Documentation" },
  { href: "#", label: "Pricing" },
  { href: "#", label: "Showcase" },
  { href: "/dashboard", label: "Dashboard" },
];

const Navigation: React.FC<NavigationProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-0 z-50 flex w-screen items-center justify-start bg-[#161616]">
      <div className="relative flex w-full justify-between space-x-0 px-8 py-6 md:justify-start md:space-x-[74px] md:px-12">
        <div>
          <Image
            src="/brand/logo.svg"
            width={298 * 0.5}
            height={43 * 0.5}
            alt="Nearbyy"
          />
        </div>

        {/* Collapsible menu navigation */}
        <div className="md:hidden">
          <Menu onClick={() => setIsOpen(!isOpen)} size={24} color="#fff" />
          {isOpen && (
            <div className="absolute left-0 right-0 top-full flex w-screen flex-col items-start overflow-hidden rounded-b-2xl bg-[#1c1c1c] px-4 pb-2 text-lg">
              {links.map((link, idx) => {
                return (
                  <div
                    key={`mobile_nav_link_${idx}`}
                    className={`w-full ${
                      idx === 0 ? "" : "border-t"
                    } border-blue-500/30 px-4 py-3`}
                  >
                    <Link href={link.href} className="text-center text-white">
                      {link.label}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="hidden space-x-[47px] text-[15px] font-light md:flex">
          {links.map((link, idx) => {
            return (
              <Link
                key={`nav_link_${idx}`}
                href={link.href}
                className="text-center text-white"
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
