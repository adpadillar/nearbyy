import React from "react";

import PricingView from "./pricing-view";

interface PricingProps {
  children?: React.ReactNode;
}

const Pricing: React.FC<PricingProps> = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-4xl font-medium">Billing</h1>
      <p className="pt-2 text-lg opacity-[0.67]">
        Here is some information about your plan
      </p>
      <PricingView />
    </div>
  );
};

export default Pricing;
