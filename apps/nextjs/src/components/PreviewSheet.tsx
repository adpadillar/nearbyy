"use client";

import {
  Button,
  Sheet,
  SheetContent,
  SheetTrigger,
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

export function PreviewSheet({ fileUrl, children, text }: PreviewSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex-grow">{children ?? "Preview"}</Button>
      </SheetTrigger>
      <SheetContent className="h-full min-w-[50vw] overflow-y-scroll">
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
