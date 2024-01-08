"use client";

import React from "react";

interface SideBlobProps extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode;
}

const SideBlob: React.FC<SideBlobProps> = (props) => {
  return (
    <svg
      width="1943"
      height="2678"
      viewBox="0 0 1943 2678"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g style={{ mixBlendMode: "color-dodge" }}>
        <path
          d="M-1322 2282.04L-545.133 -969L1111.13 -573.219L334.267 2677.82L-1322 2282.04Z"
          fill="url(#paint0_radial_9_6)"
          fillOpacity="0.78"
        />
      </g>
      <g style={{ mixBlendMode: "color-dodge" }}>
        <path
          d="M-800.594 8.22119L1707.34 656.979L1376.82 1934.66L-1131.11 1285.91L-800.594 8.22119Z"
          fill="url(#paint1_radial_9_6)"
          fillOpacity="0.78"
        />
      </g>
      <g style={{ mixBlendMode: "color-dodge" }}>
        <path
          d="M-565.337 69.0779L1942.59 717.836L1612.08 1995.52L-895.852 1346.76L-565.337 69.0779Z"
          fill="url(#paint2_radial_9_6)"
          fillOpacity="0.78"
        />
      </g>
      <defs>
        <radialGradient
          id="paint0_radial_9_6"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(-105 739) rotate(6.75435) scale(977.786 1919.27)"
        >
          <stop stopColor="#FF4B00" />
          <stop offset="1" stopColor="#1C1C1C" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_9_6"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(313.262 948.632) rotate(104.503) scale(659.871 1295.24)"
        >
          <stop stopColor="#FF4B00" />
          <stop offset="1" stopColor="#1C1C1C" stopOpacity="0.08" />
        </radialGradient>
        <radialGradient
          id="paint2_radial_9_6"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(548.518 1009.49) rotate(104.503) scale(659.871 1295.24)"
        >
          <stop stopColor="#00D3FF" />
          <stop offset="1" stopColor="#1C1C1C00" stopOpacity="0.08" />
        </radialGradient>
      </defs>
    </svg>
  );

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
