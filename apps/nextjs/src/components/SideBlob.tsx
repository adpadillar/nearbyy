"use client";

import React from "react";

interface SideBlobProps extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode;
  side: "right" | "left";
}

const SideBlob: React.FC<SideBlobProps> = (props) => {
  if (props.side === "right") {
    return (
      <svg
        width="743"
        height="590"
        viewBox="0 0 743 590"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g style={{ mixBlendMode: "color-dodge" }}>
          <g style={{ mixBlendMode: "color-dodge" }}>
            <ellipse
              cx="767.899"
              cy="315"
              rx="490.899"
              ry="275"
              fill="url(#paint0_radial_227_122)"
            />
          </g>
          <g style={{ mixBlendMode: "color-dodge" }}>
            <ellipse
              cx="574"
              cy="221.553"
              rx="574"
              ry="321.553"
              fill="url(#paint1_radial_227_122)"
            />
          </g>
        </g>
        <defs>
          <radialGradient
            id="paint0_radial_227_122"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(767.899 315) rotate(90) scale(275 490.899)"
          >
            <stop stopColor="#1400FF" />
            <stop offset="1" stopColor="#1400FF" stopOpacity="0" />
          </radialGradient>
          <radialGradient
            id="paint1_radial_227_122"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(574 221.553) rotate(90) scale(321.553 574)"
          >
            <stop stopColor="#FF0000" />
            <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  } else {
    return (
      <svg
        width="638"
        height="713"
        viewBox="0 0 638 713"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g style={{ mixBlendMode: "color-dodge" }}>
          <g style={{ mixBlendMode: "color-dodge" }}>
            <ellipse
              cx="64"
              cy="321.553"
              rx="574"
              ry="321.553"
              fill="url(#paint0_radial_227_119)"
            />
          </g>
          <g style={{ mixBlendMode: "color-dodge" }}>
            <ellipse
              cx="-72.1009"
              cy="438"
              rx="490.899"
              ry="275"
              fill="url(#paint1_radial_227_119)"
            />
          </g>
        </g>
        <defs>
          <radialGradient
            id="paint0_radial_227_119"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(64 321.553) rotate(90) scale(321.553 574)"
          >
            <stop stopColor="#1400FF" />
            <stop offset="1" stopColor="#1400FF" stopOpacity="0" />
          </radialGradient>
          <radialGradient
            id="paint1_radial_227_119"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(-72.1009 438) rotate(90) scale(275 490.899)"
          >
            <stop stopColor="#FF0000" />
            <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  }
};

export default SideBlob;
