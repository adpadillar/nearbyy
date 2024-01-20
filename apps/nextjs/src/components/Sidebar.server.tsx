import React from "react";
import Link from "next/link";

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <div className="flex flex-col space-y-4 text-white">
      <Link href="/dashboard">Home</Link>
      <Link href="/dashboard/keys">Keys</Link>
    </div>
  );
};

export default Sidebar;
