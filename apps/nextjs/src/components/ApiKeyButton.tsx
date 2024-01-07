"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";

import { getSchema } from "~/app/api/keys/route";
import { typesafeFetch } from "~/utils/fetchApi";

interface ApiKeyButtonProps {
  children?: React.ReactNode;
}

const ApiKeyButton: React.FC<ApiKeyButtonProps> = () => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: async (projectid: string) => {
      const { data, success, error } = await typesafeFetch({
        route: "/api/keys",
        method: "GET",
        params: { projectid },
        schema: getSchema,
      });

      if (!success) throw error;
      return data;
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
      <pre className="rounded-md bg-gray-800 px-4 py-2 text-white">
        API Key: {data.key}
      </pre>
    </div>
  );
};

export default ApiKeyButton;
