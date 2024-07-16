// Combobox.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EnhancedLeaderboardEntry } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PlayerLookupComboBoxProps {
  items: EnhancedLeaderboardEntry[];
  selectedValue: EnhancedLeaderboardEntry | null;
  onSelect: (value: EnhancedLeaderboardEntry | null) => void;
}

export function PlayerLookupComboBox({
  items,
  selectedValue,
  onSelect,
}: PlayerLookupComboBoxProps) {
  const [open, setOpen] = React.useState(false);

  console.log("items", items);
  console.log("selectedValue", selectedValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {selectedValue ? selectedValue.name : "Select player..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search player..." />

          <CommandEmpty>No player found.</CommandEmpty>
          {items && (
            <CommandList>
              {items.map((item) => (
                <CommandItem
                  key={item.kindeId}
                  value={item.name}
                  onSelect={() => {
                    onSelect(selectedValue === item ? null : item);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
