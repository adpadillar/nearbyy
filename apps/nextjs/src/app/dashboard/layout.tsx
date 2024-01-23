import React from "react";

import Sidebar from "~/components/Sidebar.server";

interface LayoutProps {
  children: React.ReactNode;
}

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
      <div className="h-full w-full max-w-[24rem] overflow-scroll rounded-xl border-2 border-black bg-[#2C2C2C] p-8">
        <Sidebar />
      </div>
      <div className="relative w-full overflow-scroll rounded-l-[2rem] bg-[#EDEDED] px-24 py-16">
        <div className="absolute left-12 top-[5%] h-[90%] w-[1px] bg-black"></div>
        <div className="absolute left-8 top-[10%] h-8 w-8 rounded-full bg-black "></div>
        <div className="max-w-[48rem]">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
