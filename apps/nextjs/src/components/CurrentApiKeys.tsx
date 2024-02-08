"use client";

import React from "react";

import { api } from "~/trpc/react";
import { useProjectId } from "./ProjectIdContext";

interface CurrentApiKeysProps {
  children?: React.ReactNode;
}

const CurrentApiKeys: React.FC<CurrentApiKeysProps> = () => {
  const { id } = useProjectId();
  const { data, isLoading } = api.keys.listForProject.useQuery({
    projectId: id,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col space-y-4">
      {data?.keys.map((key) => {
        return (
          <pre
            key={key.id}
            className="flex items-center justify-center space-x-4 rounded-md bg-gray-800 px-4 py-2 text-white"
          >
            <span>API Key: {key.id}</span> <DeleteButton id={key.id} />
          </pre>
        );
      })}
    </div>
  );
};

interface DeleteButtonProps {
  id: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ id }) => {
  const utils = api.useUtils();
  const { mutate, isLoading } = api.keys.deleteKey.useMutation({
    onSuccess: async () => {
      await utils.keys.listForProject.invalidate();
    },
  });

  return (
    <button
      disabled={isLoading}
      onClick={() =>
        mutate({
          keyId: id,
        })
      }
      className="rounded-md bg-red-600 px-4 py-2 text-white"
    >
      {isLoading ? "Deleting..." : "Delete"}
    </button>
  );
};

export default CurrentApiKeys;
