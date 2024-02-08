import { headers } from "next/headers";
import { auth } from "@clerk/nextjs";

import { db } from "@nearbyy/db";

export const getProject = async () => {
  // Get the URL from the custom header, set in the middleware
  const url = headers().get("x-url");

  if (!url) {
    throw new Error("No URL provided");
  }

  const urlParts = url.split("/");
  // Get the project ID from the URL, it's the one after /dashboard/
  const projectid = urlParts[urlParts.indexOf("dashboard") + 1];

  if (!projectid) {
    return {
      found: false,
      project: null,
    } as const;
  }

  // Fetch the project from the API
  const authCtx = auth();
  const project = await db.drizzle.query.projects.findFirst({
    where: db.helpers.and(
      db.helpers.eq(db.schema.projects.externalId, projectid),
      db.helpers.eq(db.schema.projects.owner, authCtx.userId!),
    ),
  });

  if (!project) {
    return {
      found: false,
      project: null,
    } as const;
  }

  return {
    found: true,
    project: {
      id: project?.externalId,
    },
  } as const;
};
