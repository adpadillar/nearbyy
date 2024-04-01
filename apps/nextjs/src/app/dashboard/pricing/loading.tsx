import type { NextPage } from "next";

import PageSkeleton from "~/components/loading/page-skeleton";

interface LoadingPageProps {
  children?: React.ReactNode;
}

const LoadingPage: NextPage<LoadingPageProps> = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-4xl font-medium">Billing</h1>
      <p className="pt-2 text-lg opacity-[0.67]">
        Here is some information about your plan
      </p>
      <PageSkeleton />
    </div>
  );
};

export default LoadingPage;
