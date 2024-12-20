"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { Combobox } from "@nearbyy/ui";

import { api } from "~/trpc/react";

interface UserButtonProps {
  children?: React.ReactNode;
  projectid?: string;
}

const UserButton: React.FC<UserButtonProps> = () => {
  const path = usePathname();
  const router = useRouter();
  const urlParts = path.split("/");
  const projectid = urlParts[urlParts.indexOf("dashboard") + 1];
  const { isLoaded: authLoading, isSignedIn, user } = useUser();
  const { data: _exists, isLoading: existsLoading } =
    api.projects.existsFromCurrentUser.useQuery(projectid ?? "");
  const { data: projects, isLoading: projectsLoading } =
    api.projects.getFromCurrentUser.useQuery();

  if (!authLoading || existsLoading || projectsLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-16 w-16 animate-pulse rounded-full bg-black/20" />

        <div className="px-4">
          <div className="min-h-[1.75rem] min-w-[12rem] animate-pulse rounded-md bg-black/30 text-xl" />
          <p className="flex items-center space-x-2 pt-2 font-light opacity-[0.44]">
            <span className="min-h-[1.25rem] min-w-[6rem] animate-pulse rounded-md bg-white/10" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="7.5"
              viewBox="0 0 6 5"
              fill="none"
            >
              <path
                d="M1 1L2.52855 3.7514C2.66077 3.98938 2.99798 4.00303 3.14899 3.77651L5 1"
                stroke="white"
                strokeOpacity="0.44"
                strokeWidth="0.727273"
                strokeLinecap="round"
              />
            </svg>
          </p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center space-x-2">
        <picture>
          <img
            className="h-16 w-16 rounded-full"
            src="https://ui-avatars.com/api/?name=A"
            alt={`Anonymous's profile`}
          />
        </picture>
      </div>
    );
  }

  const { imageUrl, fullName } = user;

  const options = (projects ?? []).map((p) => ({
    value: p.id,
    label: p.name,
  }));

  return (
    <div className="flex items-center space-x-2">
      <picture>
        <img
          className="h-16 w-16 rounded-full"
          src={imageUrl}
          alt={`${fullName}'s profile`}
        />
      </picture>
      <div className="px-4">
        <h2 className="text-xl">Personal Account</h2>
        {
          <Combobox
            onSelect={(term) => {
              const newRoute = projectid
                ? path.replace(projectid, term)
                : `/dashboard/${term}`;

              router.push(newRoute);
            }}
            selectTerm="project"
            options={options}
            defaultOption={
              options.find((opt) => opt.value === projectid)?.value
            }
          />
        }
      </div>
    </div>
  );
};

export default UserButton;
