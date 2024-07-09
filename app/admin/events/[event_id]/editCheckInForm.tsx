"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, FormEvent, useEffect } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { PlayersWithDivisions } from "./page";
import { TAGS_API_BASE_URL } from "@/app/networking/apiExports";
import { TagsEvent } from "@/app/types";
import { Checkbox } from "@/components/ui/checkbox";

export interface EditCheckInFormProps {
  player: PlayersWithDivisions;
  editCheckInStarted: boolean;
  onSubmit: (formData: any) => void;
  onClose: () => void;
}

const EditCheckInForm = (props: EditCheckInFormProps) => {
  const { player, editCheckInStarted, onClose, onSubmit } = props;
  const { accessToken } = useKindeBrowserClient();

  const [event, setEvent] = useState<TagsEvent | null>(null);
  const [editedPlayerDetails, setEditedPlayerDetails] =
    useState<PlayersWithDivisions>(player);

  const getEventDetails = async () => {
    // Get the event details
    const response = await fetch(
      `${TAGS_API_BASE_URL}/api/events/${player.event_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // console.log("Response: ", response);
    setEvent(await response.json());
  };

  useEffect(() => {
    getEventDetails();
  }, []);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = {
      player: editedPlayerDetails,
    };

    // console.log("Form Data: ", formData);

    // Submit the check-in data
    onSubmit(formData.player);
    onClose();
  };

  return (
    <Dialog open={editCheckInStarted} onOpenChange={onClose}>
      <DialogContent className="max-width-90">
        <DialogHeader>
          <DialogTitle>Edit Player Check In</DialogTitle>
          <DialogDescription>
            Please update the check-in information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="udisc_display_name">Player Name</Label>
            <Input
              id="udisc_display_name"
              type="text"
              value={editedPlayerDetails.udisc_display_name}
              onChange={(e) => {
                // console.log("Value: ", e.target.value);
                setEditedPlayerDetails({
                  ...editedPlayerDetails,
                  udisc_display_name: e.target.value,
                });
              }}
            />
            <Label htmlFor="division_id">Division</Label>
            {event && (
              <Select
                value={editedPlayerDetails.division_id.toString()}
                onValueChange={(e) => {
                  // console.log("Division ID: ", e);
                  setEditedPlayerDetails({
                    ...editedPlayerDetails,
                    division_id: parseInt(e),
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {event.divisions.map((division) => (
                      <SelectItem
                        key={division.division_id}
                        value={division.division_id.toString()}
                      >
                        {division.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            <Label htmlFor="tagIn">Tag In</Label>
            <Input
              id="tagIn"
              type="number"
              value={editedPlayerDetails.tagIn}
              onChange={(e) => {
                setEditedPlayerDetails({
                  ...editedPlayerDetails,
                  tagIn: parseInt(e.target.value),
                });
              }}
            />
            <div className="flex flex-row gap-2">
              <Label htmlFor="paid">Paid</Label>
              <Checkbox
                id="paid"
                checked={editedPlayerDetails.paid}
                onCheckedChange={(e) => {
                  setEditedPlayerDetails({
                    ...editedPlayerDetails,
                    paid: e ? true : false,
                  });
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Dismiss
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCheckInForm;
