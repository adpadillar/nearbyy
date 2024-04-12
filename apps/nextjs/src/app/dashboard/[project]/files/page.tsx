"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { NextPage } from "next";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

import { Button, Input } from "@nearbyy/ui";

import type { RouterOutputs } from "~/trpc/trpc";
import { DataTable } from "~/components/DataTable";
import PageSkeleton from "~/components/loading/page-skeleton";
import { PreviewSheet } from "~/components/PreviewSheet";
import { useProjectId } from "~/components/ProjectIdContext";
import { useS3Upload } from "~/hooks/useS3Upload";
import { api } from "~/trpc/react";

type FileT = RouterOutputs["files"]["listForProject"]["files"][number];

const columns: ColumnDef<FileT>[] = [
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
  const { uploadFile } = useS3Upload();
  const [file, setFile] = useState<File>();

  const { data, isLoading } = api.files.listForProject.useQuery({
    projectId: id,
  });

  const { mutateAsync: apiFileUpload } =
    api.files.uploadForProject.useMutation();

  if (!data || isLoading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        <h1 className="text-4xl font-medium">Files</h1>
        <p className="pt-2 text-lg opacity-[0.67]">
          View a summary of all files uploaded to this project
        </p>

        <PageSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-4xl font-medium">Files</h1>
      <p className="pt-2 text-lg opacity-[0.67]">
        View a summary of all files uploaded to this project
      </p>

      <Input
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
        type="file"
      />
      <Button
        disabled={!file}
        onClick={async () => {
          if (!file) return;
          const fileId = await uploadFile(file);
          await apiFileUpload({ fileId: fileId, projectId: id });
          console.log("File uploaded with id", fileId);
        }}
      >
        Submit
      </Button>

      <DataTable columns={columns} data={data.files} />
    </div>
  );
};

export default FilesPage;
