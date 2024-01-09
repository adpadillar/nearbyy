"use client";

import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { getSchema } from "~/app/api/keys/list/schema";
import { deleteSchema } from "~/app/api/keys/revoke/schema";
import { typesafeFetch } from "~/utils/fetchApi";
import { queryClient } from "./ReactQueryProvider";

interface CurrentApiKeysProps {
  children?: React.ReactNode;
}

const CurrentApiKeys: React.FC<CurrentApiKeysProps> = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const res = await typesafeFetch({
        route: "/api/keys/list",
        schema: getSchema,
        method: "GET",
      });

      if (!res.success) throw res.error;
      return res.data;
    },
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
  id: number;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ id }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (id: number) => {
      const res = await typesafeFetch({
        route: "/api/keys/revoke",
        method: "DELETE",
        schema: deleteSchema,
        params: { id },
      });

      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });

  return (
    <button
      disabled={isPending}
      onClick={() => mutate(id)}
      className="rounded-md bg-red-600 px-4 py-2 text-white"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
};

export default CurrentApiKeys;
