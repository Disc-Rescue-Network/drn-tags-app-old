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
import { PlayerLookupComboBox } from "./playerLookupComboBox";
import { ArrowLeftRight, ArrowUpDown } from "lucide-react";
import { all } from "axios";

interface SwapTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  swapTags: (user1Id: string, user2Id: string) => void;
  tagsEntry: EnhancedLeaderboardEntry;
  allPlayers: EnhancedLeaderboardEntry[];
}

const SwapTagDialog = (props: SwapTagDialogProps) => {
  const { open, onOpenChange, swapTags, tagsEntry, allPlayers } = props;
  const [selectedPlayer, setSelectedPlayer] =
    useState<EnhancedLeaderboardEntry | null>(allPlayers[0]);

  const handleSwap = () => {
    if (selectedPlayer) {
      swapTags(tagsEntry.kindeId, selectedPlayer.kindeId);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[350px] lg:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Swap Tags</DialogTitle>
          <DialogDescription className="text-sm">
            Select a player to swap tags with {tagsEntry.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 py-4 w-full">
          <div className="flex flex-row w-full gap-4 lg:flex-col justify-center mr-auto ml-auto">
            <Label className="text-sm lg:text-medium">{tagsEntry.name}</Label>
            <Label className="text-sm lg:text-medium">
              Tag #{tagsEntry.currentTag}
            </Label>
          </div>
          {isMobile ? (
            <ArrowUpDown className="h-6 w-6" />
          ) : (
            <ArrowLeftRight className="h-8 w-8" />
          )}
          <div className="grid grid-cols-1 col-span-1 lg:col-span-4 gap-4 justify-center text-center items-center">
            <PlayerLookupComboBox
              items={allPlayers}
              selectedValue={selectedPlayer}
              onSelect={setSelectedPlayer}
            />
            {selectedPlayer && <Label>Tag #{selectedPlayer.currentTag}</Label>}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSwap} type="button">
            Swap Tags
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SwapTagDialog;
