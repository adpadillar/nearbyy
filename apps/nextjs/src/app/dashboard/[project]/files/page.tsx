"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { NextPage } from "next";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@nearbyy/ui";

import type { RouterOutputs } from "~/trpc/trpc";
import { DataTable } from "~/components/DataTable";
import { PreviewSheet } from "~/components/PreviewSheet";
import { useProjectId } from "~/components/ProjectIdContext";
import { api } from "~/trpc/react";

type File = RouterOutputs["files"]["listForProject"]["files"][number];

const columns: ColumnDef<File>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const file = row.original;
      const firstPart = file.id.slice(0, 8);

      return <div>{firstPart}</div>;
    },
  },
  {
    accessorKey: "type",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const file = row.original;
      return <div>{file.type}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const file = row.original;
      return <div>{new Date(file.createdAt).toLocaleString()}</div>;
    },
  },
  {
    id: "preview",
    header: "Preview",
    enableHiding: false,
    cell: ({ row }) => {
      const file = row.original;

      return (
        <PreviewSheet name="Vista previa" text={file.text} fileUrl={file.url}>
          Preview
        </PreviewSheet>
      );
    },
  },
];

interface FilesPageProps {
  children?: React.ReactNode;
}

const FilesPage: NextPage<FilesPageProps> = () => {
  const { id } = useProjectId();

  const { data, isLoading } = api.files.listForProject.useQuery({
    projectId: id,
  });

  if (!data || isLoading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        <h1 className="text-4xl font-medium">Files</h1>
        <p className="pt-2 text-lg opacity-[0.67]">
          View a summary of all files uploaded to this project
        </p>

        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-4xl font-medium">Files</h1>
      <p className="pt-2 text-lg opacity-[0.67]">
        View a summary of all files uploaded to this project
      </p>

      <DataTable columns={columns} data={data.files} />
    </div>
  );
};

export default FilesPage;
