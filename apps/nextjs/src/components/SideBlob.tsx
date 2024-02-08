"use client";

import React from "react";

interface SideBlobProps extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode;
  side: "right_1" | "left_1" | "right_2" | "left_2" | "right_3" | "left_3";
}

const SideBlob: React.FC<SideBlobProps> = (props) => {
  if (props.side === "right_1") {
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
  } else if (props.side === "left_1") {
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
  } else if (props.side === "right_2") {
    return (
      <svg
        width="1013"
        height="1488"
        viewBox="0 0 1013 1488"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g style={{ mixBlendMode: "color-dodge" }}>
          <path
            d="M-561.926 189.969H877.419V923.254H-561.926V189.969Z"
            fill="url(#paint0_radial_227_134)"
            fillOpacity="0.78"
          />
        </g>
        <g style={{ mixBlendMode: "color-dodge" }}>
          <path
            d="M-426.908 189.969H1012.44V923.254H-426.908V189.969Z"
            fill="url(#paint1_radial_227_134)"
            fillOpacity="0.78"
          />
        </g>
        <g style={{ mixBlendMode: "color-dodge" }}>
          <path
            d="M-734.727 1267.91L-303.078 -538.458L617.19 -318.551L185.541 1487.82L-734.727 1267.91Z"
            fill="url(#paint2_radial_227_134)"
            fillOpacity="0.78"
          />
        </g>
        <defs>
          <radialGradient
            id="paint0_radial_227_134"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(168.099 540.842) rotate(90) scale(366.642 719.672)"
          >
            <stop stopColor="#FF0000" />
            <stop offset="1" stopColor="#1C1C1C" stopOpacity="0.08" />
          </radialGradient>
          <radialGradient
            id="paint1_radial_227_134"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(303.117 540.842) rotate(90) scale(366.642 719.672)"
          >
            <stop stopColor="#0029FF" />
            <stop offset="1" stopColor="#1C1C1C" stopOpacity="0.08" />
          </radialGradient>
          <radialGradient
            id="paint2_radial_227_134"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(-75.4544 456.958) rotate(13.4393) scale(473.089 928.613)"
          >
            <stop stopColor="#FF0000" />
            <stop offset="1" stopColor="#1C1C1C" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  } else if (props.side === "left_2") {
    return (
      <svg
        width="1032"
        height="1844"
        viewBox="0 0 1032 1844"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g style={{ mixBlendMode: "color-dodge" }}>
          <path
            d="M11.3125 189.969H1450.66V923.254H11.3125V189.969Z"
            fill="url(#paint0_radial_227_133)"
            fillOpacity="0.78"
          />
        </g>
        <g style={{ mixBlendMode: "color-dodge" }}>
          <path
            d="M146.33 189.97H1585.67V923.254H146.33V189.97Z"
            fill="url(#paint1_radial_227_133)"
            fillOpacity="0.78"
          />
        </g>
        <g style={{ mixBlendMode: "color-dodge" }}>
          <path
            d="M1080.67 -912.135L2327.27 1208.34L1246.98 1843.43L0.374673 -277.044L1080.67 -912.135Z"
            fill="url(#paint2_radial_227_133)"
            fillOpacity="0.78"
          />
        </g>
        <defs>
          <radialGradient
            id="paint0_radial_227_133"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(741.338 540.842) rotate(90) scale(366.642 719.672)"
          >
            <stop stopColor="#FF0000" />
            <stop offset="1" stopColor="#1C1C1C" stopOpacity="0.08" />
          </radialGradient>
          <radialGradient
            id="paint1_radial_227_133"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(876.355 540.842) rotate(90) scale(366.642 719.672)"
          >
            <stop stopColor="#0029FF" />
            <stop offset="1" stopColor="#1C1C1C" stopOpacity="0.08" />
          </radialGradient>
          <radialGradient
            id="paint2_radial_227_133"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(1196.02 467.243) rotate(149.549) scale(626.572 1229.88)"
          >
            <stop stopColor="#0029FF" />
            <stop offset="1" stopColor="#1C1C1C" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  } else if (props.side === "right_3") {
    return (
      <svg
        width="1055"
        height="1495"
        viewBox="0 0 1055 1495"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g style={{ mixBlendMode: "color-dodge" }}>
          <path
            d="M-736.999 1274.62L-305.05 -533.007L615.857 -312.948L183.908 1494.68L-736.999 1274.62Z"
            fill="url(#paint0_radial_227_96)"
            fillOpacity="0.78"
          />
        </g>
        <g style={{ mixBlendMode: "color-dodge" }}>
          <path
            d="M-471.229 -29L923.215 331.718L739.444 1042.13L-655 681.41L-471.229 -29Z"
            fill="url(#paint1_radial_227_96)"
            fillOpacity="0.78"
          />
        </g>
        <g style={{ mixBlendMode: "color-dodge" }}>
          <path
            d="M-340.424 4.83765L1054.02 365.556L870.249 1075.97L-524.195 715.247L-340.424 4.83765Z"
            fill="url(#paint2_radial_227_96)"
            fillOpacity="0.78"
          />
        </g>
        <defs>
          <radialGradient
            id="paint0_radial_227_96"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(-60.3299 416.664) rotate(6.75435) scale(543.662 1067.14)"
          >
            <stop stopColor="#FF4B00" />
            <stop offset="1" stopColor="#1C1C1C" stopOpacity="0" />
          </radialGradient>
          <radialGradient
            id="paint1_radial_227_96"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(148.089 493.881) rotate(104.503) scale(366.897 720.172)"
          >
            <stop stopColor="#FF4B00" />
            <stop offset="1" stopColor="#1C1C1C" stopOpacity="0.08" />
          </radialGradient>
          <radialGradient
            id="paint2_radial_227_96"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(278.894 527.719) rotate(104.503) scale(366.897 720.172)"
          >
            <stop stopColor="#00D3FF" />
            <stop offset="1" stopColor="#1C1C1C" stopOpacity="0.08" />
          </radialGradient>
        </defs>
      </svg>
    );
  } else {
    return (
      <svg
        width="1094"
        height="1554"
        viewBox="0 0 1094 1554"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g style={{ mixBlendMode: "color-dodge" }}>
          <path
            d="M419 1333.62L850.949 -474.001L1771.86 -253.942L1339.91 1553.68L419 1333.62Z"
            fill="url(#paint0_radial_227_101)"
            fillOpacity="0.78"
          />
        </g>
        <g style={{ mixBlendMode: "color-dodge" }}>
          <path
            d="M0 379.665L1395.59 23.4176L1577.09 734.413L181.493 1090.66L0 379.665Z"
            fill="url(#paint1_radial_227_101)"
            fillOpacity="0.78"
          />
        </g>
        <g style={{ mixBlendMode: "color-dodge" }}>
          <path
            d="M130.913 346.249L1526.51 -9.99912L1708 700.996L312.406 1057.24L130.913 346.249Z"
            fill="url(#paint2_radial_227_101)"
            fillOpacity="0.78"
          />
        </g>
        <defs>
          <radialGradient
            id="paint0_radial_227_101"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(1156.83 375.032) rotate(6.99421) scale(589.032 1156.19)"
          >
            <stop stopColor="#00D3FF" />
            <stop offset="1" stopColor="#1C1C1C" stopOpacity="0" />
          </radialGradient>
          <radialGradient
            id="paint1_radial_227_101"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(794.678 539.186) rotate(75.6801) scale(366.897 720.172)"
          >
            <stop stopColor="#FF4B00" />
            <stop offset="1" stopColor="#1C1C1C" stopOpacity="0.08" />
          </radialGradient>
          <radialGradient
            id="paint2_radial_227_101"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(925.591 505.77) rotate(75.6801) scale(366.897 720.172)"
          >
            <stop stopColor="#00D3FF" />
            <stop offset="1" stopColor="#1C1C1C" stopOpacity="0.08" />
          </radialGradient>
        </defs>
      </svg>
    );
  }
};

export default SideBlob;
