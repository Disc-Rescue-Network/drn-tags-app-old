"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";
import { TAGS_API_BASE_URL } from "../networking/apiExports";
import { UserProfile } from "../types";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
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

  const [userProfile, setUserProfile] = useState<UserProfile>();

  useEffect(() => {
    const checkUDiscDisplayName = async () => {
      setLoading(true);
      if (isAuthenticated && user) {
        console.log("Checking UDisc display name status for user:", user);
        // Ensure user.email is not null before using it
        const accessToken = getAccessToken(); // Assume getAccessToken is async
        try {
          const response = await fetch(
            `${TAGS_API_BASE_URL}/api/getUserDetails`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Correctly handle accessToken usage
              },
              body: JSON.stringify({
                kinde_id: user.id,
              }),
            }
          );

          const data = await response.json();
          console.log("data", data);
          setLoading(false);
          setUserProfile(data.user);
        } catch (error) {
          console.error("Failed to fetch UDisc display name status:", error);
          setLoading(false);
        }
      }
    };

    checkUDiscDisplayName();
  }, [isAuthenticated, user]);

  useEffect(() => {
    console.log("userProfile", userProfile);
  }, [userProfile]);

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
        udisc_display_name: userProfile?.udisc_display_name,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setLoading(false);
        toast({
          variant: "default",
          title: "Success",
          description: "User settings successfully updated.",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  if (!userProfile) return null;

  return (
    <div className="grid min-h-screen w-full">
      <main className="flex flex-1 flex-col h-3/5 gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex">
          <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        </div>
        <Card className="mr-4">
          <CardHeader>
            <CardTitle>UDisc Display Name</CardTitle>
            <CardDescription>
              Used to identify your scores on UDisc Live for the tags season.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <Input
                placeholder="UDisc Display Name"
                value={userProfile?.udisc_display_name}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    user_id: userProfile?.user_id,
                    udisc_display_name: e.target.value,
                  })
                }
                disabled={loading}
              />
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button onClick={saveDisplayName}>Save</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
