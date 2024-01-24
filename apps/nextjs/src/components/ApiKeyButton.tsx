"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";

import { getSchema } from "~/app/api/keys/generate/schema";
import { typesafeFetch } from "~/utils/fetchApi";
import { queryClient } from "./ReactQueryProvider";

interface ApiKeyButtonProps {
  children?: React.ReactNode;
}

const ApiKeyButton: React.FC<ApiKeyButtonProps> = () => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: async (projectid: string) => {
      const { data, success, error } = await typesafeFetch({
        route: "/api/keys/generate",
        method: "GET",
        params: { projectid },
        schema: getSchema,
      });

      if (!success) throw error;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["api-keys"],
      });
    },
  });

  if (!data) {
    return (
      <div>
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => mutate("nextjs")}
        >
          {isPending ? "Loading..." : "Get API Key"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <pre className="rounded-md bg-gray-900 p-4 text-white">
        <code className="text-sm">{data.key}</code>
      </pre>
    </div>
  );
};

export default ApiKeyButton;
