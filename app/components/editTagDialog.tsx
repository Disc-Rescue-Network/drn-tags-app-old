"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import React, { useEffect, useRef, useState } from "react";
import { TAGS_API_BASE_URL } from "../networking/apiExports";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie"; // Import js-cookie
import { useToast } from "@/components/ui/use-toast";
import { useLogin } from "../hooks/useLogin";
import { useCheckUDiscDisplayName } from "../hooks/useCheckUDiscDisplayName";
import { EnhancedLeaderboardEntry } from "../types";

interface EditTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updateTag: (kindeId: string, newTag: number) => void;
  tagsEntry: EnhancedLeaderboardEntry;
}

const EditTagDialog = (props: EditTagDialogProps) => {
  const { open, onOpenChange, updateTag, tagsEntry } = props;
  const [newTag, setNewTag] = useState(tagsEntry.currentTag);

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(parseInt(e.target.value));
  };

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="max-w-[325px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Update Tag</DialogTitle>
          <DialogDescription className="text-sm">
            Please enter the new tag for {tagsEntry.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            {/* <Label htmlFor="name" className="text-right">
              UDisc Display Name
            </Label> */}
            <Input
              id="udiscDisplayName"
              type="number"
              value={newTag}
              onChange={handleTagChange}
              className="min-w-[150px]"
              placeholder="Enter new tag #"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => updateTag(tagsEntry.kindeId, newTag)}
            type="submit"
          >
            Save changes
          </Button>
          {/* <DialogClose asChild>
            <Button type="button" variant="secondary">
              Dismiss
            </Button>
          </DialogClose> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTagDialog;
