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
import { TagsEvent, UserProfile } from "../types";
import { TAGS_API_BASE_URL } from "../networking/apiExports";
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

interface CheckInFormProps {
  userProfile: UserProfile;
  event: TagsEvent;
  kinde_id: string;
  onSubmit: (formData: any) => void;
  //   checkInStarted: boolean;
  setCheckInStarted: (value: boolean) => void;
  onClose: () => void;
}

const CheckInForm = (props: CheckInFormProps) => {
  const {
    userProfile,
    event,
    kinde_id,
    onSubmit,
    // checkInStarted,
    setCheckInStarted,
    onClose,
  } = props;

  console.log("Event In: ", event);

  const { register, handleSubmit, setValue } = useForm();

  const [udisc_display_name, setUdiscDisplayName] = useState("");
  const [tagIn, setTagIn] = useState("");
  const [division_id, setDivisionId] = useState("");
  const [paid] = useState(false); // default to false

  const {
    permissions,
    isLoading,
    isAuthenticated,
    user,
    accessToken,
    organization,
    userOrganizations,
  } = useKindeBrowserClient();

  useEffect(() => {
    if (userProfile && userProfile.udisc_display_name) {
      setUdiscDisplayName(userProfile.udisc_display_name);
    }
  }, [userProfile]);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const event_id = event.event_id;

    console.log(division_id);

    const formData = {
      udisc_display_name: udisc_display_name,
      tagIn: parseInt(tagIn, 10),
      division_id: parseInt(division_id),
      paid,
      event_id,
      kinde_id: kinde_id!,
    };

    console.log("Form Data: ", formData);

    // If the user is authenticated and the UDisc display name was missing, update the user profile
    if (!userProfile?.udisc_display_name) {
      fetch(`${TAGS_API_BASE_URL}/api/update-udisc-display-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          kinde_id: kinde_id,
          udisc_display_name: udisc_display_name,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    // Submit the check-in data
    onSubmit(formData);
    onClose();
  };

  console.log("User Profile: ", userProfile);

  return (
    <Dialog open={true} onOpenChange={setCheckInStarted}>
      <DialogContent className="max-width-90">
        <DialogHeader>
          <DialogTitle>Check In</DialogTitle>
          <DialogDescription>
            Please fill out the below form to complete your check in.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="udiscDisplayName" className="col-span-1">
              UDisc Display Name:
            </Label>
            <Input
              id="udiscDisplayName"
              value={udisc_display_name}
              onChange={(e) => setUdiscDisplayName(e.target.value)}
              className="col-span-1"
              placeholder="Enter your UDisc display name"
              required
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="tagIn" className="col-span-1">
              Tag In:
            </Label>
            <Input
              id="tagIn"
              type="number"
              value={tagIn}
              onChange={(e) => setTagIn(e.target.value)}
              className="col-span-1"
              placeholder="Enter your current tag number"
              required
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="division_id" className="col-span-1">
              Division:
            </Label>
            {event.divisions.length > 0 ? (
              <Select
                value={division_id}
                onValueChange={(e) => setDivisionId(e)}
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
            ) : (
              <Input
                id="division_id"
                type="number"
                value={division_id}
                onChange={(e) => setDivisionId(e.target.value)}
                className="col-span-1"
                placeholder="Enter your division ID"
                required
              />
            )}
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

export default CheckInForm;
