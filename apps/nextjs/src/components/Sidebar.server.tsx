import React from "react";
import Link from "next/link";

import UserButton from "./UserButton";

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <div className="flex flex-col space-y-4 text-white">
      <UserButton />

      <Link href="/dashboard">Home</Link>
      <Link href="/dashboard/keys">Keys</Link>
    </div>
  );
};

export default Sidebar;
