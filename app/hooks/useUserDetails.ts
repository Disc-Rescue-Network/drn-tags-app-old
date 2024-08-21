import { useState, useEffect } from "react";
import {
  KindeAccessToken,
  KindeUser,
} from "@kinde-oss/kinde-auth-nextjs/types";
import { UserProfile } from "../types";
import { TAGS_API_BASE_URL } from "../networking/apiExports";
import { useUserCourses } from "./useUserCourses";

export const useUserDetails = (
  isAuthenticated: boolean | null,
  user: KindeUser | null,
  getAccessToken: { (): KindeAccessToken | null; (): any }
) => {
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
  const [loading, setLoading] = useState(false);
  const { course } = useUserCourses();

  // console.log("User details:", userProfile);
  // console.log("User:", user);
  // console.log("Is authenticated:", isAuthenticated);

  const fetchUserDetails = async () => {
    //console.log("Fetching user details...");
    if (isAuthenticated && user) {
      setLoading(true);
      const accessToken = getAccessToken();
      //console.log("Access token:", accessToken);
      try {
        const bodyIn = JSON.stringify({
          kinde_id: user.id,
          courseId: "org_155e4b351474",
        });
        //console.log("Body in:", bodyIn);
        const response = await fetch(
          `${TAGS_API_BASE_URL}/api/getUserDetails`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: bodyIn,
          }
        );
        // console.log("Response:", response);

        const data = await response.json();
        //console.log("User details:", data);
        const lastKnownTagOut = data.lastKnownTagOut;
        if (lastKnownTagOut) {
          setUserProfile({ ...data.user, lastKnownTagOut });
        } else {
          setUserProfile(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [course.orgCode, isAuthenticated, user]);

  return { userProfile, setUserProfile, loading, fetchUserDetails };
};
