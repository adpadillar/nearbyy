import type { NextPage } from "next";

import PageSkeleton from "~/components/loading/page-skeleton";

interface TestPageProps {
  children?: React.ReactNode;
}

const TestPage: NextPage<TestPageProps> = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-4xl font-medium">API Keys</h1>
      <p className="pt-2 text-lg opacity-[0.67]">
        View a summary of all files uploaded to this project
      </p>
      <PageSkeleton />
    </div>
  );
};

export default TestPage;
