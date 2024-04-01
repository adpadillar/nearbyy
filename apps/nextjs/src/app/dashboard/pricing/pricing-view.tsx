"use client";

import React from "react";

import { api } from "~/trpc/react";

interface PricingViewProps {
  children?: React.ReactNode;
}

const PricingView: React.FC<PricingViewProps> = () => {
  const { data, isLoading } = api.projects.getFromCurrentUser.useQuery();

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data.map((project) => (
        <div key={project.id}>
          <h2>{project.name}</h2>
          <p>Plan: {project.billing.plan}</p>
          <p>
            Requests: {project.billing.usage.requests.current} /{" "}
            {project.billing.usage.requests.limit}
          </p>
          <p>
            Files: {project.billing.usage.files.current} /{" "}
            {project.billing.usage.files.limit}
          </p>
          <p>Last reset: {project.billing.lastQuotaReset.toString()}</p>
        </div>
      ))}
    </div>
  );
};

export default PricingView;
