import { db } from "@nearbyy/db";

import { env } from "~/env";

export const runtime = "edge";
export const preferredRegion = "iad1";

export default async function HomePage() {
  // I want to measure the time it takes to run this query
  const start = Date.now();

  const turso = db({
    authToken: env.DATABASE_TOKEN,
    url: env.DATABASE_URL,
  });

  const users = await turso.query.users.findMany({});

  const end = Date.now();

  console.log(`Query took ${end - start}ms`);

  return (
    <main>
      <div>
        <h1>Posts</h1>
      </div>

      <div>
        {users.map((u) => {
          return (
            <div key={u.id}>
              <h2>{u.name}</h2>
              <p>{u.createdAt}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
