"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";

import { apiStatusTypes } from "~/app/api/status/types";
import { typesafeFetch } from "~/utils/fetchApi";

interface StatusButtonProps {
  children?: React.ReactNode;
}

const StatusButton: React.FC<StatusButtonProps> = () => {
  const { data, mutate } = useMutation({
    mutationFn: async () => {
      const { success, data, error } = await typesafeFetch({
        route: "/api/status",
        method: "GET",
        schema: apiStatusTypes.GET,
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
          onClick={() => mutate()}
        >
          Get Status
        </button>
      </div>
    );
  }

  return (
    <div>
      <pre className="rounded-md bg-gray-800 px-4 py-2 text-white">
        Status: {data.userid}
      </pre>
    </div>
  );
};

export default StatusButton;
