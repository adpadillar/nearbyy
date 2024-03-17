"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { NextPage } from "next";
import { ArrowUpDown } from "lucide-react";
import toast from "react-hot-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@nearbyy/ui";

import type { RouterOutputs } from "~/trpc/trpc";
import { DataTable } from "~/components/DataTable";
import { useProjectId } from "~/components/ProjectIdContext";
import { api } from "~/trpc/react";

type Key = RouterOutputs["keys"]["listForProject"]["keys"][number];

const columns: ColumnDef<Key>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const key = row.original;
      const firstPart = key.id.slice(0, 8);

      return <div>{firstPart}</div>;
    },
  },
  {
    accessorKey: "createdAt",
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
      const key = row.original;
      return <div>{new Date(key.createdAt).toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const key = row.original;
      return <div>{key.description ?? "No description provided."}</div>;
    },
  },
  {
    id: "delete",
    header: "Delete",
    enableHiding: false,
    cell: ({ row }) => {
      const key = row.original;
      // Cell renderer IS a react component. We can use hooks here
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { id } = useProjectId();
      const utils = api.useUtils();
      const { mutate } = api.keys.deleteKey.useMutation({
        onSuccess: async () => {
          await utils.keys.listForProject.invalidate({
            projectId: id,
          });
        },
        onError: (err) => {
          toast.error(err.message);
        },
      });

      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Once you delete this key, any requests using it will fail. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => mutate({ keyId: key.id })}
                variant="destructive"
              >
                Delete key
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];

interface KeysPageProps {
  children?: React.ReactNode;
}

const KeysPage: NextPage<KeysPageProps> = () => {
  const { id } = useProjectId();
  const { data, isLoading } = api.keys.listForProject.useQuery({
    projectId: id,
  });

  if (!data || isLoading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        <h1 className="text-4xl font-medium">API Keys</h1>
        <p className="pt-2 text-lg opacity-[0.67]">
          View and manage your Nearbyy keys
        </p>

        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-4xl font-medium">API Keys</h1>
      <p className="pt-2 text-lg opacity-[0.67]">
        View and manage your Nearbyy keys
      </p>

      <DataTable columns={columns} data={data.keys} pagination={false} />
    </div>
  );
};

export default KeysPage;
