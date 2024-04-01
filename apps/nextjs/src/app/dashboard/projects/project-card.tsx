"use client";

import React from "react";
import Link from "next/link";

import { hashToColors, hashToPattern, Skeleton } from "@nearbyy/ui";

import type { RouterOutputs } from "~/trpc/trpc";

type ProjectCardProps =
  | {
      loading?: false;
      project: RouterOutputs["projects"]["getFromCurrentUser"][0];
    }
  | {
      loading?: true;
      project: undefined;
    };

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  loading = false,
}) => {
  if (loading || !project) {
    return (
      <div className="flex h-64 overflow-hidden rounded-md border border-black/20">
        <span className="w-full">
          <div className="w-full p-4 pb-0">
            <Skeleton className="h-36 w-full" />
          </div>

          <div className="flex flex-col space-y-2 p-4">
            <Skeleton className="h-6 w-1/5" />
            <Skeleton className="h-4 w-2/5" />
          </div>
        </span>
      </div>
    );
  }

  const colors = hashToColors(project.id);
  const Pattern = hashToPattern(project.id);

  return (
    <Link
      href={`/dashboard/${project.id}`}
      key={project.id}
      className="flex h-64 overflow-hidden rounded-md border border-black/20"
    >
      <span>
        <Pattern
          backgroundColor={colors.background}
          pathColor={colors.foreground}
          fillOpacity={0.3}
          className="h-40 w-96"
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
