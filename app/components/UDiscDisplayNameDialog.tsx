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

const UDiscDisplayNameDialog = () => {
  const {
    permissions,
    isLoading,
    isAuthenticated,
    user,
    accessToken,
    organization,
    userOrganizations,
    getPermission,
    getBooleanFlag,
    getIntegerFlag,
    getFlag,
    getStringFlag,
    getClaim,
    getAccessToken,
    getToken,
    getIdToken,
    getOrganization,
    getPermissions,
    getUserOrganizations,
  } = useKindeBrowserClient();

  console.log("udisc dialog code running");

  const { loading: loginLoading, doesAccountExist } = useLogin(
    isAuthenticated,
    user,
    getAccessToken
  );

  console.log("Does account exist:", doesAccountExist);
  console.log("Login loading:", loginLoading);
  console.log("Is authenticated:", isAuthenticated);
  console.log("User:", user);

  const { loading: displayNameLoading, isUDiscNameMissing } =
    useCheckUDiscDisplayName(
      isAuthenticated,
      user,
      getAccessToken,
      doesAccountExist
    );

  console.log("Is UDisc name missing:", isUDiscNameMissing);
  console.log("Display name loading:", displayNameLoading);

  const [loading, setLoading] = useState(false);
  const [isDialogDismissed, setIsDialogDismissed] = useState(
    !!Cookies.get("udiscDisplayNameDismissed")
  ); // Convert cookie value to boolean

  const [udiscDisplayName, setUdiscDisplayName] = useState("");
  const loginAttempted = useRef(false);

  const handleDisplayNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUdiscDisplayName(event.target.value);
  };

  const { toast } = useToast();

  const saveDisplayName = () => {
    if (!user) {
      console.error("User is not defined");
      return;
    }

    setLoading(true);

    const accessToken = getAccessToken(); // Assume getAccessToken is defined elsewhere and is synchronous or handled accordingly

    fetch(`${TAGS_API_BASE_URL}/api/update-udisc-display-name`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        kinde_id: user.id,
        udisc_display_name: udiscDisplayName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // if (data.success) {
        //   setUDiscNameMissing(false); // Assuming you have this state to close the dialog or handle UI changes
        // }
        toast({
          variant: "default",
          title: "Success",
          description: "User settings successfully updated.",
          duration: 3000,
        });
        setLoading(false);
        setIsDialogDismissed(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  const handleDialogDismiss = () => {
    Cookies.set("udiscDisplayNameDismissed", "true");
    setIsDialogDismissed(true);
  };

  if (isDialogDismissed) {
    return null;
  }

  return (
    <Dialog
      open={isUDiscNameMissing && !loading && !isDialogDismissed}
      onOpenChange={handleDialogDismiss}
    >
      <DialogContent className="max-w-[325px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>UDisc Display Name Missing</DialogTitle>
          <DialogDescription className="text-sm">
            This is used to identify your scores on UDisc Live for the tags
            season. Enter this exactly as it appears on UDisc. You can find this
            in your UDisc settings under{" "}
            <strong>&quot;Full Name (for league/event scorecards)&quot;</strong>{" "}
            or copy your name as it appears in the league leaderboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            {/* <Label htmlFor="name" className="text-right">
              UDisc Display Name
            </Label> */}
            <Input
              id="udiscDisplayName"
              value={udiscDisplayName}
              onChange={handleDisplayNameChange}
              className="min-w-[150px]"
              placeholder="Enter your UDisc Display Name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={saveDisplayName} type="submit">
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

export default UDiscDisplayNameDialog;
