"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { NextPage } from "next";
import { useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from "@nearbyy/ui";

import type { RouterOutputs } from "~/trpc/trpc";
import { DataTable } from "~/components/DataTable";
import PageSkeleton from "~/components/loading/page-skeleton";
import {
  ActivatePreviewSheet,
  PreviewProvider,
  PreviewSheet,
} from "~/components/PreviewSheet";
import { useProjectId } from "~/components/ProjectIdContext";
import { useS3Upload } from "~/hooks/useS3Upload";
import { api } from "~/trpc/react";
import { ALLOWED_EXTENSIONS } from "~/utils/shared/constants";

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
    header: "Actions",
    enableHiding: false,
    cell: function Cell({ row }) {
      const [open, setOpen] = useState(false);
      const deleteFile = api.files.deleteForProject.useMutation({});
      const { id } = useProjectId();
      const utils = api.useUtils();
      const file = row.original;

      async function handleDeletion() {
        setOpen(false);

        const deletionPromise = deleteFile.mutateAsync({
          fileId: row.original.id,
          projectId: id,
        });

        await toast.promise(deletionPromise, {
          loading: "Deleting file...",
          success: "File deleted successfully!",
          error: "Error deleting file",
        });

        await utils.files.listForProject.invalidate();
      }

      return (
        <>
          <div className="flex items-center pl-2">
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <div>
                    <MoreHorizontal className="h-6 w-6" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <ActivatePreviewSheet
                    className="w-full text-left"
                    fileUrl={file.url}
                  >
                    Preview file
                  </ActivatePreviewSheet>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <Dialog>
                  <DialogTrigger asChild>
                    <div className="tw-relative tw-flex tw-cursor-default tw-select-none tw-items-center tw-rounded-sm tw-px-2 tw-py-1.5 tw-text-sm tw-outline-none tw-transition-colors focus:tw-bg-accent focus:tw-text-accent-foreground data-[disabled]:tw-pointer-events-none data-[disabled]:tw-opacity-50 hover:bg-gray-100">
                      <div className="w-full text-left">Delete File</div>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Are you sure you want to delete this file?
                      </DialogTitle>
                      <DialogDescription>
                        <p>
                          This will also delete all associated data with this
                          file, and will no longer be accessible through the API
                        </p>

                        <div className="pt-4">
                          <Button
                            variant="destructive"
                            onClick={handleDeletion}
                          >
                            Delete file
                          </Button>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <PreviewSheet name="Vista previa" text={file.text} fileUrl={file.url}>
            Preview
          </PreviewSheet>
        </>
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
  const utils = api.useUtils();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteDialog, setWebsiteDialog] = useState(false);

  function handleOnClick() {
    // here we want to create an input element type file
    // and click it to open the file dialog
    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    input.multiple = false;
    input.accept = ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",");
    input.click();

    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const file = target.files[0]!;

        const loadingPromise = uploadFile(file).then((fileId) => {
          return apiFileUpload({ fileId, projectId: id });
        });

        await toast.promise(loadingPromise, {
          loading: "Uploading file...",
          success: "File uploaded successfully!",
          error: "Error uploading file",
        });

        await utils.files.listForProject.invalidate();
      }
    };
  }

  async function handleWebsiteUpload() {
    const apiFilePromise = apiFileUpload({
      projectId: id,
      fileUrl: websiteUrl,
    });

    setWebsiteDialog(false);

    await toast.promise(apiFilePromise, {
      loading: "Uploading website...",
      success: "Website uploaded successfully!",
      error: "Error uploading website",
    });

    await utils.files.listForProject.invalidate();

    setWebsiteUrl("");
  }

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

      <div className="flex w-full items-end justify-end space-x-2">
        <Button onClick={handleOnClick}>Upload File</Button>
        <Dialog
          open={websiteDialog}
          onOpenChange={(nv) => {
            setWebsiteDialog(nv);
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline">Upload Website</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload a website from the internet</DialogTitle>
              <DialogDescription>
                <p>
                  Enter the URL of the website you want to upload to Nearbyy.
                  The service will do its best to scrape the website and upload
                  the text as markdown.
                </p>
                <Input
                  className="mt-4"
                  placeholder="Add a website URL"
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
                <div className="pt-4">
                  <Button onClick={handleWebsiteUpload}>Upload Website</Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <PreviewProvider>
        <DataTable columns={columns} data={data.files} />
      </PreviewProvider>
    </div>
  );
};

export default FilesPage;
