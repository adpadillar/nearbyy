import React from "react";

import UserButton from "./UserButton";

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <div className="flex flex-col space-y-8 text-white">
      <div>
        <UserButton />
      </div>

      <hr className="h-[0.1rem] w-full rounded-full bg-white" />
    </div>
  );
};

export default Sidebar;
