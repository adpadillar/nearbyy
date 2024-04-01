"use client";

import React from "react";
import Link from "next/link";

import { hashToColors, hashToPattern } from "@nearbyy/ui";

import type { RouterOutputs } from "~/trpc/trpc";

interface ProjectCardProps {
  children?: React.ReactNode;
  loading?: boolean;
  project: RouterOutputs["projects"]["getFromCurrentUser"][0];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  loading = false,
}) => {
  const colors = hashToColors(project.id);
  const Pattern = hashToPattern(project.id);

  if (loading) return <div>Loading...</div>;

  return (
    <Link
      href={`/dashboard/${project.id}`}
      key={project.id}
      className="flex h-64 min-w-[16rem] overflow-hidden rounded-md border border-black/20"
    >
      <span>
        <Pattern
          backgroundColor={colors.background}
          pathColor={colors.foreground}
          className="h-40 w-64"
        />
        <div className="p-4">
          <h1 className="text-xl font-semibold">{project.name}</h1>
          <p>{project.description}</p>
        </div>
      </span>
    </Link>
  );
};

export default ProjectCard;
