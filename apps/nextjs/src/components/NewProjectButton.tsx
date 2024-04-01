"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@nearbyy/ui";

import { api } from "~/trpc/react";

interface CreateNewProjectButtonProps {
  children?: React.ReactNode;
}

const CreateNewProjectButton: React.FC<CreateNewProjectButtonProps> = () => {
  const utils = api.useUtils();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const { mutate } = api.projects.createFromCurrentUser.useMutation({
    onSuccess: async () => {
      await utils.projects.getFromCurrentUser.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex h-64 items-center justify-center overflow-hidden rounded-md border border-black/20">
          <Plus size={52} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Give your project a name and a description. Click on Create Project
            when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name*
            </Label>
            <Input
              id="name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My awesome project"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="A short description of your project"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              onClick={() => {
                mutate({
                  name: projectName,
                  description: projectDescription,
                });
              }}
            >
              Create project
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewProjectButton;
