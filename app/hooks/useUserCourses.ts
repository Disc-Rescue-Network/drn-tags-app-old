"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../networking/apiExports";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Course } from "../types/Course";

interface UserCoursesHook {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  course: Course;
  setCourse: (course: Course) => void;
  isSwitchingOrgs: boolean;
  setIsSwitchingOrgs: (isSwitchingOrgs: boolean) => void;
  belongsToOrg: boolean;
  errorMessage: string;
  showErrorMessage: boolean;
  loading: boolean;
}

export const useUserCourses = (): UserCoursesHook => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course>({
    orgCode: "",
    courseName: "",
    state: "",
    city: "",
    shortCode: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    activeForLostAndFound: false,
    shortLink: "",
    link: "",
  });
  const [isSwitchingOrgs, setIsSwitchingOrgs] = useState(false);
  const [belongsToOrg, setBelongsToOrg] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    user,
    organization,
    userOrganizations,
    getOrganization,
    getUserOrganizations,
    getToken,
    isLoading,
    isAuthenticated,
  } = useKindeBrowserClient();

  const orgCode = organization?.orgCode;
  // console.log("orgCodes orignal: ", getUserOrganizations());
  const orgCodes = userOrganizations;
  // console.log("orgCodes: ", orgCodes);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoading]);

  const fetchCourse = async (orgCodeIn: string) => {
    if (!orgCodeIn || orgCodeIn === "" || orgCodeIn === "org_6c3b341e563") {
      setErrorMessage("Organization code is required.");
      setShowErrorMessage(true);
      setBelongsToOrg(false);
      return;
    }

    try {
      const accessToken = await getToken();
      const response = await axios.get(`${API_BASE_URL}/course/${orgCodeIn}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      // console.log("Course data: ", data);
      setCourse(data);
      setBelongsToOrg(true);
    } catch (error) {
      setErrorMessage(
        `Error fetching course for orgCode ${orgCodeIn}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setShowErrorMessage(true);
      setBelongsToOrg(false);
    }
  };

  const fetchCourses = async (orgCodesIn: string[]) => {
    if (orgCodesIn.length === 0) {
      setErrorMessage("No organization codes found. Please contact support.");
      setShowErrorMessage(true);
      return;
    }

    console.log("orgCodesIn: ", orgCodesIn);

    try {
      const accessToken = await getToken();
      // console.log("accessToken: ", accessToken);
      const queryString = orgCodesIn
        .map((code) => `orgCodes[]=${encodeURIComponent(code)}`)
        .join("&");
      console.log("queryString: ", queryString);
      const response = await axios.get(
        `${API_BASE_URL}/courses?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const fetchedCourses: Course[] = response.data;
      console.log("Course data: ", fetchedCourses);
      setCourses(fetchedCourses);
    } catch (error) {
      setErrorMessage(
        `Error fetching courses: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setShowErrorMessage(true);
    }
  };

  useEffect(() => {
    if (user && orgCode) {
      fetchCourse(orgCode);
    }
    if (user && orgCodes) {
      fetchCourses(orgCodes.orgCodes);
    }
  }, [user, isLoading, orgCode, orgCodes]);

  return {
    courses,
    setCourses,
    course,
    setCourse,
    isSwitchingOrgs,
    setIsSwitchingOrgs,
    belongsToOrg,
    errorMessage,
    showErrorMessage,
    loading,
  };
};
