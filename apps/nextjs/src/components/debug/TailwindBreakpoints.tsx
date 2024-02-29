"use client";

import React from "react";

import { useTailwindBreakpoints } from "~/hooks/useTailwindBreakpoints";

interface TailwindBreakpointsProps {
  children?: React.ReactNode;
}

const TailwindBreakpoints: React.FC<TailwindBreakpointsProps> = () => {
  const breakpoint = useTailwindBreakpoints();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white sm:bg-orange-400 md:bg-yellow-400 lg:bg-green-500 xl:bg-blue-500 2xl:bg-indigo-500">
      {breakpoint}
    </div>
  );
};

export default TailwindBreakpoints;
