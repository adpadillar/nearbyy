"use client";

import React from "react";

interface BackgroundPricingProps extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode;
}

const BackgroundPricing: React.FC<BackgroundPricingProps> = (props) => {
  return (
    <svg
      width="1440"
      height="1211"
      viewBox="0 0 1440 1211"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_f_433_6032)">
        <rect
          x="100"
          y="357"
          width="1246"
          height="497"
          rx="248.5"
          fill="url(#paint0_linear_433_6032)"
          fillOpacity="0.3"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_433_6032"
          x="-256.25"
          y="0.749969"
          width="1958.5"
          height="1209.5"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="178.125"
            result="effect1_foregroundBlur_433_6032"
          />
        </filter>
        <linearGradient
          id="paint0_linear_433_6032"
          x1="700.611"
          y1="854"
          x2="824.867"
          y2="716.712"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF0000" />
          <stop offset="1" stopColor="#1400FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default BackgroundPricing;
