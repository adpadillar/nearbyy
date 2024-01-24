import { headers } from "next/headers";

export const getProject = async () => {
  // Get the URL from the custom header, set in the middleware
  const url = headers().get("x-url");

  if (!url) {
    throw new Error("No URL provided");
  }

  const urlParts = url.split("/");
  // Get the project ID from the URL, it's the one after /dashboard/
  const projectid = urlParts[urlParts.indexOf("dashboard") + 1];

  // Fetch the project from the API
  return {
    found: true,
    project: {
      id: projectid,
    },
  };
};
