import { generateKey } from "@nearbyy/auth";

// Create a key
export const GET = async () => {
  const projectid = "first-project";

  const res = await generateKey(projectid);

  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json",
    },
  });
};
