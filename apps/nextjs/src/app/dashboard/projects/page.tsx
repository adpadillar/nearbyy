import React from "react";

import CreateNewProjectButton from "~/components/NewProjectButton";
import ProjectList from "~/components/ProjectList";

interface ProjectsProps {
  children?: React.ReactNode;
}

const Projects: React.FC<ProjectsProps> = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-4xl font-medium">Projects</h1>
      <p className="pt-2 text-lg opacity-[0.67]">
        Select a project from the following list
      </p>
      <div className="grid grid-cols-3 gap-4">
        <ProjectList />
        <CreateNewProjectButton />
      </div>
    </div>
  );
};

export default Projects;
