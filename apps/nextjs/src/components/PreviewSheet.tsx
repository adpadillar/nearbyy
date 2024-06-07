"use client";

import type { ButtonHTMLAttributes } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import {
  Sheet,
  SheetContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@nearbyy/ui";

interface PreviewSheetProps {
  fileUrl: string;
  name: string;
  text: string;
  children?: React.ReactNode;
}

const SheetContext = createContext<{
  toggle: (f: string) => void;
  active: string | null;
}>({
  toggle: () => void 0,
  active: null,
});

export const PreviewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const toggle = (f: string) => {
    if (activeTab === f) {
      setActiveTab(null);
    } else {
      setActiveTab(f);
    }
  };
  return (
    <SheetContext.Provider value={{ toggle, active: activeTab }}>
      {children}
    </SheetContext.Provider>
  );
};

export function ActivatePreviewSheet({
  fileUrl,
  children,
  ...rest
}: { fileUrl: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggle } = useContext(SheetContext);

  return (
    <button onClick={() => toggle(fileUrl)} {...rest}>
      {children}
    </button>
  );
}

export function PreviewSheet({ fileUrl, text }: PreviewSheetProps) {
  const { active, toggle } = useContext(SheetContext);

  useEffect(() => {
    if (active === fileUrl) {
      console.log("Opening sheet", fileUrl);
    }
  }, [active, fileUrl]);

  return (
    <Sheet
      open={active === fileUrl}
      onOpenChange={() => {
        toggle(fileUrl);
      }}
    >
      <SheetContent className="h-full min-w-[50vw] overflow-y-scroll bg-black">
        <Tabs defaultValue="file-preview" className="w-full pt-6">
          <TabsList className="sticky top-0 w-full">
            <TabsTrigger value="file-preview" className="w-full">
              File Preview
            </TabsTrigger>
            <TabsTrigger value="text-preview" className="w-full">
              Text Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="file-preview">
            <div className="mt-4 grid h-[60dvh] bg-gray-200 sm:h-[83dvh]">
              <iframe
                title="Preview"
                src={fileUrl ?? ""}
                className="col-span-3 mx-auto h-full w-full"
              />
            </div>
          </TabsContent>
          <TabsContent value="text-preview">
            <div className="flex flex-col space-y-2 pt-4">
              {text
                .split("\n")
                .filter((v) => v)
                .map((substr, idx) => {
                  return (
                    <p
                      key={idx}
                      className={idx === 0 ? "text-xl font-semibold" : ""}
                    >
                      {substr}
                    </p>
                  );
                })}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
