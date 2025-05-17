"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (option: string) => {
    onChange(selected.filter((s) => s !== option));
  };

  const selectables = options.filter(
    (option) => !selected.includes(option.value)
  );

  return (
    <div className={cn("relative", className)}>
      <div className="flex flex-wrap gap-1 border border-input rounded-md p-1 min-h-10">
        {selected.map((option) => {
          const label =
            options.find((opt) => opt.value === option)?.label || option;
          return (
            <Badge key={option} variant="secondary" className="mb-1">
              {label}
              <button
                type="button"
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => handleUnselect(option)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {label}</span>
              </button>
            </Badge>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex-1 text-left px-2 py-1 text-sm focus:outline-none"
        >
          {selected.length === 0 && placeholder}
        </button>
      </div>
      {open && (
        <div className="absolute w-full z-10 top-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
          <Command className="w-full">
            <CommandInput
              placeholder="Search options..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {selectables
                  .filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  )
                  .map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        onChange([...selected, option.value]);
                        setInputValue("");
                      }}
                    >
                      {option.label}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
