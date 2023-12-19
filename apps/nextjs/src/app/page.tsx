import { api } from "~/trpc/server";

export const runtime = "edge";

export default async function HomePage() {
  // You don't need to fetch these here, just showing different usages
  // If you don't want the Suspense loading state, you could pass these
  // posts as props as use as initialData in the query.

  const { posts } = await api.post.all.query();
  console.log("RSC Posts:", posts);

  return (
    <main>
      <div>
        <h1>Posts</h1>
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
