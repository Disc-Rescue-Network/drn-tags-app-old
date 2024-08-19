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
import { useUserDetails } from "../hooks/useUserDetails";

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

  const { userProfile, setUserProfile, fetchUserDetails } = useUserDetails(
    isAuthenticated,
    user,
    getAccessToken
  );

  useEffect(() => {
    console.log("userProfile", userProfile);
    if (!userProfile) {
      fetchUserDetails();
    }
  }, []);

  const { toast } = useToast();

  const saveDisplayName = async () => {
    if (!user) {
      console.error("User is not defined");
      return;
    }

    setLoading(true);

    const accessToken = getAccessToken(); // Assume getAccessToken is defined elsewhere and is synchronous or handled accordingly

    try {
      const response = await fetch(
        `${TAGS_API_BASE_URL}/api/update-udisc-display-name`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            kinde_id: user.id,
            udisc_display_name: userProfile?.udisc_display_name,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 400) {
          // Handle 400 error specifically
          const errorData = await response.json();
          toast({
            variant: "destructive",
            title: "Error",
            description: errorData.message || "An error occurred",
            duration: 3000,
          });
          setLoading(false);
          return;
        }
      }
      const data = await response.json();
      // console.log("Success:", data);
      setLoading(false);
      toast({
        variant: "default",
        title: "Success",
        description: "User settings successfully updated.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred",
        duration: 3000,
      });
    }
  };

  if (!userProfile) {
    console.error("User profile is not defined");
    return null;
  }

  return (
    <div className="grid min-h-screen w-full">
      <main className="flex flex-1 flex-col h-3/5 gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex">
          <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        </div>
        <Card className="mr-4">
          <CardHeader>
            <CardTitle>UDisc Full Name</CardTitle>
            <CardDescription>
              Used to identify your scores on UDisc Live for the tags season.
              Enter this exactly as it appears on UDisc. You can find this in
              your UDisc settings under{" "}
              <strong>
                &quot;Full Name (for league/event scorecards)&quot;
              </strong>{" "}
              or copy your name as it appears in the league leaderboard.
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
          <CardFooter className="px-6 py-4">
            <Button onClick={saveDisplayName}>Save</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
