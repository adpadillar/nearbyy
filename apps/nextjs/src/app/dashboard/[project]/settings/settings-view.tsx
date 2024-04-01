"use client";

import React from "react";
import { useRouter } from "next/navigation";

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

import { useProjectId } from "~/components/ProjectIdContext";
import { api } from "~/trpc/react";

interface SettingsViewProps {
  children?: React.ReactNode;
}

const SettingsView: React.FC<SettingsViewProps> = () => {
  const { mutateAsync } = api.projects.deleteFromCurrentUser.useMutation();
  const { id } = useProjectId();
  const router = useRouter();

  const deleteProject = async () => {
    await mutateAsync({ externalId: id });
    router.push("/dashboard");
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete this project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Once you delete this project, all of the files and data associated
            with it will be permanently deleted. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={deleteProject}>
            Delete project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SettingsView;
