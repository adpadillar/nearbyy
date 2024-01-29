"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getSchema } from "~/app/api/projects/schema";
import { typesafeFetch } from "~/utils/fetchApi";

interface ProjectListProps {
  children?: React.ReactNode;
}

const ProjectList: React.FC<ProjectListProps> = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await typesafeFetch({
        method: "GET",
        route: "/api/projects",
        schema: getSchema,
      });

      if (!res.success) throw res.error;
      return res.data;
    },
  });

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <>
      {data.projects.map((p) => {
        return (
          <Link
            href={`/dashboard/${p.id}`}
            key={p.id}
            className="flex h-64 items-center justify-center rounded-md border border-black/60"
          >
            {p.name}
          </Link>
        );
      })}
    </>
  );
};

export default ProjectList;
