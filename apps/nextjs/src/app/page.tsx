import { db } from "@nearbyy/db";

import { env } from "~/env";
import { api } from "~/trpc/server";

export const runtime = "edge";

export default async function HomePage() {
  // You don't need to fetch these here, just showing different usages
  // If you don't want the Suspense loading state, you could pass these
  // posts as props as use as initialData in the query.

  const { posts } = await api.post.all.query();
  console.log("RSC Posts:", posts);

  const turso = db({
    authToken: env.DATABASE_TOKEN,
    url: env.DATABASE_URL,
  });

  const users = await turso.query.users.findMany({});

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

      <div>
        {posts.map((p) => {
          return (
            <div key={p.id}>
              <h2>{p.title}</h2>
              <p>{p.content}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
