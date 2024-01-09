"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";

import { getSchema } from "~/app/api/keys/list/schema";
import { typesafeFetch } from "~/utils/fetchApi";

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
    <div>
      {data?.keys.map((key) => {
        return (
          <pre
            key={key.id}
            className="rounded-md bg-gray-800 px-4 py-2 text-white"
          >
            API Key: {key.id}
          </pre>
        );
      })}
    </div>
  );
};

export default CurrentApiKeys;
