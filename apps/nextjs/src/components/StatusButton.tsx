"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";

import { getFromApiRoute } from "~/utils/fetchApi";

interface StatusButtonProps {
  children?: React.ReactNode;
}

const StatusButton: React.FC<StatusButtonProps> = () => {
  const { data, mutate } = useMutation({
    mutationFn: async () => {
      const { success, value, error } = await getFromApiRoute({
        route: "/status",
      });

      if (!success) throw error;
      return value;
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
