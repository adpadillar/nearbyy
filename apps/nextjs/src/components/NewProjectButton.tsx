"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { postSchema } from "~/app/api/projects/schema";
import { typesafeFetch } from "~/utils/fetchApi";
import { queryClient } from "./ReactQueryProvider";

interface CreateNewProjectButtonProps {
  children?: React.ReactNode;
}

const CreateNewProjectButton: React.FC<CreateNewProjectButtonProps> = () => {
  const { mutate } = useMutation({
    mutationFn: async () => {
      const { data, error, success } = await typesafeFetch({
        method: "POST",
        route: "/api/projects",
        schema: postSchema,
        body: {
          id: "new-project",
          name: "My Second project",
          desciption: "My Project Description",
        },
      });

      if (!success) throw error;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <button
      onClick={() => mutate()}
      className="flex h-64 items-center justify-center rounded-md border border-black/60"
    >
      Create a new project
    </button>
  );
};

export default CreateNewProjectButton;
