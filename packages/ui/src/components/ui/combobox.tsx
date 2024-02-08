import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils";
import { Check } from "lucide-react";

export function Combobox<T extends string>({
  options,
  onSelect,
  selectTerm = "option",
  defaultOption,
}: {
  options: { value: T; label: string }[];
  onSelect?: (value: T) => void;
  selectTerm?: string;
  defaultOption?: T;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultOption ?? "");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center space-x-2 pt-1 font-light opacity-[0.44]">
          <span>
            {value
              ? options.find((opt) => opt.value === value)?.label
              : `Select ${selectTerm}`}
          </span>{" "}
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
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder={`Search ${selectTerm}s`} />
          <CommandEmpty>No {selectTerm}s found.</CommandEmpty>
          <CommandGroup>
            {options.map((opt) => (
              <CommandItem
                key={opt.value}
                value={opt.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  onSelect?.(currentValue as T);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "tw-mr-2 tw-h-4 tw-w-4",
                    value === opt.value ? "tw-opacity-100" : "tw-opacity-0",
                  )}
                />
                {opt.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
