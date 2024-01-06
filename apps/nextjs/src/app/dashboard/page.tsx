import type { NextPage } from "next";
import { UserButton } from "@clerk/nextjs";
import ApiKeyButton from "components/ApiKeyButton";

export const runtime = "edge";
export const preferredRegion = "iad1";

interface TestPageProps {
  children?: React.ReactNode;
}

const TestPage: NextPage<TestPageProps> = () => {
  return (
    <div>
      <h1>This is a page</h1>
      <UserButton afterSignOutUrl="/" />
      <ApiKeyButton />
    </div>
  );
};

export default TestPage;
