import { useState, useEffect } from "react";
import {
  KindeAccessToken,
  KindeUser,
} from "@kinde-oss/kinde-auth-nextjs/types";
import { UserProfile } from "../types";
import { TAGS_API_BASE_URL } from "../networking/apiExports";

export const useUserDetails = (
  isAuthenticated: boolean | null,
  user: KindeUser | null,
  getAccessToken: { (): KindeAccessToken | null; (): any }
) => {
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isAuthenticated && user) {
        setLoading(true);
        const accessToken = getAccessToken();
        try {
          const response = await fetch(
            `${TAGS_API_BASE_URL}/api/getUserDetails`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                kinde_id: user.id,
              }),
            }
          );

          const data = await response.json();
          setUserProfile(data.user);
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, [isAuthenticated, user]);

  return { userProfile, setUserProfile, loading };
};
