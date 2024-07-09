// useCheckUDiscDisplayName.ts
import {
  KindeAccessToken,
  KindeUser,
} from "@kinde-oss/kinde-auth-nextjs/types";
import { useState, useEffect } from "react";
import { TAGS_API_BASE_URL } from "../networking/apiExports";

export const useCheckUDiscDisplayName = (
  isAuthenticated: boolean | null,
  user: KindeUser | null,
  getAccessToken: { (): KindeAccessToken | null; (): any },
  doesAccountExist: boolean
) => {
  const [loading, setLoading] = useState(false);
  const [isUDiscNameMissing, setUDiscNameMissing] = useState(false);

  useEffect(() => {
    const checkUDiscDisplayName = async () => {
      setLoading(true);
      if (isAuthenticated && user && doesAccountExist) {
        // console.log("Checking UDisc display name status for user:", user);
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
          // console.log("UDisc display name status:", data);

          if (!data.hasUDiscDisplayName) {
            // console.log("User is missing UDisc display name");
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

  return { loading, isUDiscNameMissing };
};
