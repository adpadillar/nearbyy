import { useEffect, useState } from "react";

const breakpoints = {
  base: 640,
  sm: 768,
  md: 1024,
  lg: 1280,
  xl: 1536,
  "2xl": 2000,
};

export const useTailwindBreakpoints = () => {
  const [breakpoint, setBreakpoint] = useState<keyof typeof breakpoints | null>(
    null,
  );

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const nextBreakpoint = Object.entries(breakpoints).find(
        ([_, value]) => width < value,
      )?.[0] as keyof typeof breakpoints | undefined;

      if (nextBreakpoint) {
        setBreakpoint(nextBreakpoint);
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
};
