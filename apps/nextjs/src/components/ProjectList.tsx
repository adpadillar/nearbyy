"use client";

import React from "react";

import ProjectCard from "~/app/dashboard/projects/project-card";
import { api } from "~/trpc/react";

interface ProjectListProps {
  children?: React.ReactNode;
}

const ProjectList: React.FC<ProjectListProps> = () => {
  const { data, isLoading } = api.projects.getFromCurrentUser.useQuery();

  if (isLoading || !data) return <ProjectCard project={undefined} loading />;

  return data.map((project) => (
    <ProjectCard key={project.id} project={project} />
  ));
};

export default ProjectList;
