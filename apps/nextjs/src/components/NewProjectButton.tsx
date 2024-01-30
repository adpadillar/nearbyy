"use client";

import React from "react";
import toast from "react-hot-toast";

import { api } from "~/trpc/react";

interface CreateNewProjectButtonProps {
  children?: React.ReactNode;
}

const CreateNewProjectButton: React.FC<CreateNewProjectButtonProps> = () => {
  const utils = api.useUtils();
  const { mutate } = api.projects.createFromCurrentUser.useMutation({
    onSuccess: async () => {
      await utils.projects.getFromCurrentUser.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <button
      onClick={() => {
        const name = prompt("Project name");
        const description = prompt("Project description");
        const externalId = prompt("Project id");
        if (!name) return;
        if (!externalId) return;

        mutate({
          externalId: externalId,
          name: name,
          description: description ?? undefined,
        });
      }}
      className="flex h-64 items-center justify-center rounded-md border border-black/60"
    >
      Create a new project
    </button>
  );
};

export default CreateNewProjectButton;
