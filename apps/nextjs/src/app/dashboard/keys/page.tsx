import type { NextPage } from "next";

import CurrentApiKeys from "~/components/CurrentApiKeys";

interface TestPageProps {
  children?: React.ReactNode;
}

const TestPage: NextPage<TestPageProps> = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-4xl">API Keys</h1>
      <p className="pt-2 opacity-[0.67]">View and manage your Nearbyy keys</p>

      <div>
        <CurrentApiKeys />
      </div>
    </div>
  );
};

export default TestPage;
