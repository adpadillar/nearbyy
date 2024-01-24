import React from "react";

import { getProject } from "~/utils/server/getProject";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const { found } = await getProject();

  if (!found) {
    return <div>Project not found</div>;
  }

  return <>{children}</>;
};

export default Layout;
