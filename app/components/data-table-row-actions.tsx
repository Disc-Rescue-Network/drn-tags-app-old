"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeftRight, Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { EnhancedLeaderboardEntry } from "../types";
import { TAGS_API_BASE_URL } from "../networking/apiExports";

// import { labels } from "../data/data";
// import { discSchema } from "../data/schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  setEditingTag: (editing: boolean) => void;
  setSwappingTag: (swapping: boolean) => void;
  setTagsEntry: (entry: EnhancedLeaderboardEntry) => void;
}

export function DataTableRowActions<TData>({
  row,
  setEditingTag,
  setSwappingTag,
  setTagsEntry,
}: DataTableRowActionsProps<TData>) {
  const tagsEntry = row.original as EnhancedLeaderboardEntry;

  const router = useRouter();

  const handleEditClick = async () => {
    if (!tagsEntry) {
      toast({
        title: "Error",
        description: "No tag to swap",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setTagsEntry(tagsEntry);
    setEditingTag(true);
  };

  const handleSwap = async () => {
    if (!tagsEntry) {
      toast({
        title: "Error",
        description: "No tag to swap",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setTagsEntry(tagsEntry);
    setSwappingTag(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={handleEditClick}
          className="flex flex-row gap-2 justify-start"
        >
          <Pencil className="h-4 w-4" /> <Label className="text-xs">Edit</Label>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSwap}
          className="flex flex-row gap-2 justify-start"
        >
          <ArrowLeftRight className="h-4 w-4" />{" "}
          <Label className="text-xs">Swap Tag</Label>
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
