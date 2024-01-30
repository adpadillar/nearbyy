"use client";

import React from "react";

import { api } from "~/trpc/react";
import { useProjectId } from "./ProjectIdContext";

interface ApiKeyButtonProps {
  children?: React.ReactNode;
}

const ApiKeyButton: React.FC<ApiKeyButtonProps> = () => {
  const utils = api.useUtils();
  const { id } = useProjectId();
  const { data, mutate, isLoading } = api.keys.generateForProject.useMutation({
    onSuccess: async () => {
      await utils.keys.listForProject.invalidate();
    },
  });

  if (!data) {
    return (
      <div>
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() =>
            mutate({
              projectId: id,
            })
          }
        >
          {isLoading ? "Loading..." : "Get API Key"}
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
