import type { NextPage } from "next";
import Link from "next/link";

import ApiKeyButton from "~/components/ApiKeyButton";
import Shiki from "~/components/Shiki.server";

interface TestPageProps {
  children?: React.ReactNode;
}

const code = `import { NearbyyClient } from "@nearbyy/client";

const client = new NearbyyClient({
  API_KEY: "YOUR_API_KEY"
})
`;

const TestPage: NextPage<TestPageProps> = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-4xl">Getting Started</h1>
      <p className="pt-2 opacity-[0.67]">
        Follow this simple guide to connect the Nearbyy API to your first
        project
      </p>

      <div className="flex flex-col space-y-8 pt-4">
        <div>
          <h2 className="text-2xl">Step 1: Install the Nearbyy Client</h2>
          <p className="pt-2 opacity-[0.67]">
            Start by install the Nearbby client in your project using npm or
            yarn
          </p>
          <div className="pt-2">
            <pre className="rounded-md bg-gray-900 p-4 text-white">
              <code className="text-sm">npm install @nearbyy/core</code>
            </pre>
          </div>
        </div>
        <div>
          <h2 className="text-2xl">Step 2: Generate API Keys</h2>
          <p className="pt-2 opacity-[0.67]">
            Generate your API keys by clicking the button below. You will need
            these keys to authenticate with the Nearbyy API.
          </p>
          <div className="pt-2">
            <ApiKeyButton />
          </div>
        </div>
        <div>
          <h2 className="text-2xl">Step 3: Connect the Client</h2>
          <p className="pt-2 opacity-[0.67]">
            To use the Nearbyy client, you must first connect it to your project
            with the API keys generated in the previous step. Use the code below
            to do that
          </p>
          <div className="pt-2">
            <Shiki
              code={code}
              lang="ts"
              theme="dracula"
              className="rounded-md p-4 text-sm"
            />
          </div>
        </div>
        <div>
          <h2 className="text-2xl">Step 4: Use the client</h2>
          <p className="pt-2 opacity-[0.67]">
            Now you can use the client to make requests to the Nearbyy API. For
            more information on how to use the client,{" "}
            <Link href="https://docs.nearbyy.com/" className="underline">
              check out the documentation
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
