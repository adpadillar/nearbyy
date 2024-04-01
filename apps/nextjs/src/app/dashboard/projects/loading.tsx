import type { NextPage } from "next";

import PageSkeleton from "~/components/loading/page-skeleton";

interface TestPageProps {
  children?: React.ReactNode;
}

const TestPage: NextPage<TestPageProps> = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-4xl font-medium">Projects</h1>
      <p className="pt-2 text-lg opacity-[0.67]">
        Select a project from the following list
      </p>
      <PageSkeleton />
    </div>
  );
};

export default TestPage;
