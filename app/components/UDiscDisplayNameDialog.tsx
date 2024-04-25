"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import React, { useEffect, useRef, useState } from "react";
import { TAGS_API_BASE_URL } from "../networking/apiExports";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Input } from "@/components/ui/input";

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

  const [loading, setLoading] = useState(false);

  const [isUDiscNameMissing, setUDiscNameMissing] = useState(false);
  const [udiscDisplayName, setUdiscDisplayName] = useState("");
  const [doesAccountExist, setDoesAccountExist] = useState(false);
  const loginAttempted = useRef(false);

  useEffect(() => {
    const login = async () => {
      if (isLoading) return;
      setLoading(true);
      if (isAuthenticated && user && !loginAttempted.current) {
        loginAttempted.current = true; // Set this to prevent future executions
        console.log("Checking db for user:", user);
        // Ensure user.email is not null before using it
        const accessToken = getAccessToken(); // Assume getAccessToken is async
        try {
          const response = await fetch(`${TAGS_API_BASE_URL}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`, // Correctly handle accessToken usage
            },
            body: JSON.stringify({
              userId: user.id,
              email: user.email,
              first_name: user.given_name,
              last_name: user.family_name,
            }),
          });

          if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            setLoading(false);
            throw new Error(message);
          }

          if (response.status === 201) {
            console.log("Account created successfully");
            setDoesAccountExist(true);
          }

          if (response.status === 200) {
            console.log("Account exists");
            setDoesAccountExist(true);
          }

          const data = await response.json();
          console.log("Login status:", data);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch UDisc display name status:", error);
          setLoading(false);
        }
      }
    };

    login();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const checkUDiscDisplayName = async () => {
      setLoading(true);
      if (isAuthenticated && user && doesAccountExist) {
        console.log("Checking UDisc display name status for user:", user);
        // Ensure user.email is not null before using it
        const accessToken = getAccessToken(); // Assume getAccessToken is async
        try {
          const response = await fetch(
            `${TAGS_API_BASE_URL}/api/check-udisc-display-name`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Correctly handle accessToken usage
              },
              body: JSON.stringify({
                userId: user.id,
              }),
            }
          );

          const data = await response.json();
          console.log("UDisc display name status:", data);

          if (!data.hasUDiscDisplayName) {
            console.log("User is missing UDisc display name");
            setUDiscNameMissing(true);
          }
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch UDisc display name status:", error);
          setLoading(false);
        }
      }
    };

    checkUDiscDisplayName();
  }, [doesAccountExist, isAuthenticated, user]);

  const handleDisplayNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUdiscDisplayName(event.target.value);
  };

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
        if (data.success) {
          setUDiscNameMissing(false); // Assuming you have this state to close the dialog or handle UI changes
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  //   if (isUDiscNameMissing) return null;
  return (
    <Dialog open={isUDiscNameMissing && !loading}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>UDisc Display Name Missing</DialogTitle>
          <DialogDescription>
            Please enter your UDisc display name to continue, as it is needed to
            track your rounds.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            {/* <Label htmlFor="name" className="text-right">
              UDisc Display Name
            </Label> */}
            <Input
              id="udiscDisplayName"
              value={udiscDisplayName}
              onChange={handleDisplayNameChange}
              className="w-80"
              placeholder="Enter your UDisc display name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={saveDisplayName} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UDiscDisplayNameDialog;
