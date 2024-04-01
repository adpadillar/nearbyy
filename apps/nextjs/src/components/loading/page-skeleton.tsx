import React from "react";

interface PageSkeletonProps {
  children?: React.ReactNode;
}

const PageSkeleton: React.FC<PageSkeletonProps> = () => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="h-16 w-full animate-pulse rounded-md bg-gray-200" />
      <div className="h-12 w-full animate-pulse rounded-md bg-gray-200" />
      <div className="h-12 w-full animate-pulse rounded-md bg-gray-200" />
    </div>
  );
};

export default PageSkeleton;
