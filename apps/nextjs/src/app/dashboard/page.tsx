import type { NextPage } from "next";
import { UserButton } from "@clerk/nextjs";

import ApiKeyButton from "~/components/ApiKeyButton";
import StatusButton from "~/components/StatusButton";

export const runtime = "edge";
export const preferredRegion = "iad1";

interface TestPageProps {
  children?: React.ReactNode;
}

const TestPage: NextPage<TestPageProps> = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1>This is a page</h1>
      <UserButton afterSignOutUrl="/" />

      <ApiKeyButton />
      <StatusButton />
    </div>
  );
};

export default TestPage;
