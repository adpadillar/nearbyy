import React from "react";

interface PricingProps {
  children?: React.ReactNode;
}

const Pricing: React.FC<PricingProps> = () => {
  return (
    <div>
      <h1>This is a pricing</h1>
    </div>
  );
};

export default Pricing;
