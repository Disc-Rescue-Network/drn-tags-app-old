// useLogin.ts
import { useState, useEffect, useRef } from "react";
import { TAGS_API_BASE_URL } from "../networking/apiExports";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  KindeAccessToken,
  KindeUser,
} from "@kinde-oss/kinde-auth-nextjs/types";

export const useLogin = (
  isAuthenticated: boolean | null,
  user: KindeUser | null,
  getAccessToken: { (): KindeAccessToken | null; (): any }
) => {
  const [loading, setLoading] = useState(false);
  const [doesAccountExist, setDoesAccountExist] = useState(false);
  const loginAttempted = useRef(false);

  useEffect(() => {
    const login = async () => {
      //   if (loading) return;
      setLoading(true);
      if (isAuthenticated && user && !loginAttempted.current) {
        // console.log("Checking db for user:", user);
        loginAttempted.current = true; // Set this to prevent future executions
        // console.log("Checking db for user:", user);
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

          // console.log("Response status:", response.status);

          if (response.status === 201) {
            // console.log("Account created successfully");
            setDoesAccountExist(true);
          }

          if (response.status === 200) {
            // console.log("Account exists");
            setDoesAccountExist(true);
          }

          const data = await response.json();
          // console.log("Login status:", data);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch UDisc display name status:", error);
          setLoading(false);
        }
      } else {
        // console.log("User is not authenticated or user is missing");
      }
    };

    login();
  }, [getAccessToken, isAuthenticated, loading, user]);

  return { loading, doesAccountExist };
};
