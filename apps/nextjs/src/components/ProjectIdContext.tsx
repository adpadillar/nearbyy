"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { api } from "~/trpc/react";

interface ProjectIdContextType {
  id: string;
  exists: boolean;
}

const ProjectIdContext = createContext<ProjectIdContextType>({
  id: "",
  exists: false,
});

interface ProjectIdProviderProps {
  children?: React.ReactNode;
}

export const useProjectId = () => useContext(ProjectIdContext);

const ProjectIdProvider: React.FC<ProjectIdProviderProps> = ({ children }) => {
  const [projectId, setProjectId] = useState<string>("");
  const { data: exists } = api.projects.existsFromCurrentUser.useQuery(
    projectId ?? "",
  );
  const path = usePathname();

  useEffect(() => {
    const urlParts = path.split("/");
    const projectid = urlParts[urlParts.indexOf("dashboard") + 1];
    setProjectId(projectid ?? "");
  }, [path]);

  return (
    <ProjectIdContext.Provider
      value={{
        exists: exists ?? false,
        id: projectId,
      }}
    >
      {children}
    </ProjectIdContext.Provider>
  );
};

export default ProjectIdProvider;
