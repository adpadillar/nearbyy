"use client";

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@nearbyy/ui";

interface PreviewSheetProps {
  fileUrl: string;
  name: string;
  children?: React.ReactNode;
}

export function PreviewSheet({ fileUrl, children, name }: PreviewSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex-grow">{children ?? "Preview"}</Button>
      </SheetTrigger>
      <SheetContent className="h-full min-w-[50vw]">
        <SheetHeader>
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription>Visualizar documento</SheetDescription>
        </SheetHeader>
        <div className="mt-4 grid h-[60dvh] sm:h-[83dvh]">
          <iframe
            title="Preview"
            src={fileUrl ?? ""}
            className="col-span-3 mx-auto h-full w-full"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
