"use client";

import React, { useState } from "react";

interface ApiKeyButtonProps {
  children?: React.ReactNode;
}

const ApiKeyButton: React.FC<ApiKeyButtonProps> = () => {
  const [apiKey, setApiKey] = useState("");

  // const handleClick = async () => {
  //   const res = await fetch("/api/keys?projectid=nextjs");
  //   const data = await res.json();
  //   setApiKey(data.key);
  // };

  if (!apiKey) {
    return (
      <div>
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => setApiKey("1234567890")}
        >
          Get API Key
        </button>
      </div>
    );
  }

  return (
    <div>
      <pre className="rounded-md bg-gray-800 px-4 py-2 text-white">
        API Key: {apiKey}
      </pre>
    </div>
  );
};

export default ApiKeyButton;
