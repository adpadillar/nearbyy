"use client";

import React from "react";
import Link from "next/link";

import { api } from "~/trpc/react";

interface ProjectListProps {
  children?: React.ReactNode;
}

const ProjectList: React.FC<ProjectListProps> = () => {
  const { data, isLoading } = api.projects.getFromCurrentUser.useQuery();

  if (isLoading || !data) return <div>Loading...</div>;

  return data.map((project) => (
    <Link
      href={`/dashboard/${project.id}`}
      key={project.id}
      className="flex h-64 items-center justify-center rounded-md border border-black/60"
    >
      {project.name}
    </Link>
  ));
};

export default ProjectList;
