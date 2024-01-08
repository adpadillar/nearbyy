"use client";

import React from "react";

interface SideBlobProps extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode;
}

const SideBlob: React.FC<SideBlobProps> = (props) => {
  return (
    <svg
      width="1599"
      height="3051"
      viewBox="0 0 1599 3051"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g style={{ mixBlendMode: "color-dodge" }}>
        <path
          d="M-1031 2719.12L-381.24 0.000366851L1004.04 331.025L354.277 3050.15L-1031 2719.12Z"
          fill="url(#paint0_radial_7_134)"
          fillOpacity="0.78"
        />
      </g>
      <g style={{ mixBlendMode: "color-dodge" }}>
        <path
          d="M-770.884 1096.5H1395.76V2200.31H-770.884V1096.5Z"
          fill="url(#paint1_radial_7_134)"
          fillOpacity="0.78"
        />
      </g>
      <g style={{ mixBlendMode: "color-dodge" }}>
        <path
          d="M-567.643 1096.5H1599V2200.31H-567.643V1096.5Z"
          fill="url(#paint2_radial_7_134)"
          fillOpacity="0.78"
        />
      </g>
      <defs>
        <radialGradient
          id="paint0_radial_7_134"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(-38.5989 1498.4) rotate(13.4393) scale(712.139 1397.84)"
        >
          <stop stopColor="#FF0000" />
          <stop offset="1" stopColor="#1C1C1C00" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_7_134"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(328.021 1624.67) rotate(90) scale(551.906 1083.32)"
        >
          <stop stopColor="#FF0000" />
          <stop offset="1" stopColor="#1C1C1C00" stopOpacity="0.08" />
        </radialGradient>
        <radialGradient
          id="paint2_radial_7_134"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(531.263 1624.67) rotate(90) scale(551.906 1083.32)"
        >
          <stop stopColor="#0029FF" />
          <stop offset="1" stopColor="#1C1C1C00" stopOpacity="0.08" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default SideBlob;
