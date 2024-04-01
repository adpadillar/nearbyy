import React from "react";
import { Toaster } from "react-hot-toast";

import Sidebar from "~/components/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

// Lazy Load headers

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      className="flex h-screen w-screen space-x-20 overflow-hidden py-12 pl-12"
      style={{
        backgroundImage: "url('/brand/background_dashboard.svg')",
        backgroundSize: "cover",
        backgroundPosition: "left",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Toaster position="bottom-right" />
      <div className="h-full w-full max-w-[26rem] overflow-scroll rounded-3xl border-2 border-black bg-[#2C2C2C] p-10">
        <Sidebar />
      </div>
      <div className="relative w-full overflow-scroll rounded-bl-[2rem] rounded-tl-[4rem] bg-[#EDEDED] px-28 py-20">
        <div className="absolute left-16 top-[5%] h-[100%] w-[1px] bg-black" />
        <div className="absolute left-[3.125rem] top-[12%] h-7 w-7 rounded-full bg-black" />
        <div className="max-w-[48rem]">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
