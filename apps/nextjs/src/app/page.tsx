import { UserButton } from "@clerk/nextjs";

export const runtime = "edge";
export const preferredRegion = "iad1";

export default async function HomePage() {
  return (
    <main>
      <div>
        <h1>Posts</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
    </main>
  );
}
