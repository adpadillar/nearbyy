"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { NextPage } from "next";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@nearbyy/ui";

import type { RouterOutputs } from "~/trpc/trpc";
import { DataTable } from "~/components/DataTable";
import { useProjectId } from "~/components/ProjectIdContext";
import { api } from "~/trpc/react";

type Key = RouterOutputs["keys"]["listForProject"]["keys"][number];

export const columns: ColumnDef<Key>[] = [
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
    header: "Created At",
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

interface TestPageProps {
  children?: React.ReactNode;
}

const TestPage: NextPage<TestPageProps> = () => {
  const { id } = useProjectId();
  const { data, isLoading } = api.keys.listForProject.useQuery({
    projectId: id,
  });

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-4xl font-medium">API Keys</h1>
      <p className="pt-2 text-lg opacity-[0.67]">
        View and manage your Nearbyy keys
      </p>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create a key</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new Nearbyy API Key</DialogTitle>
              <DialogDescription>
                Describe what a Nearbyy API Key is for... And what does creating
                one entail
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={data.keys} pagination={false} />
    </div>
  );
};

export default TestPage;
