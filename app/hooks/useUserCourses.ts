import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../networking/apiExports";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Course } from "../interfaces/Course";

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
interface CourseResponse {
  id: number;
  type: string;
  attributes: Course;
}

interface ApiResponse {
  data: CourseResponse[];
}

export const useUserCourses = (): UserCoursesHook => {
  const [orgCode, setOrgCode] = useState<string>("");
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
  const [loading, setLoading] = useState<boolean>(true);

  const {
    user,
    getOrganization,
    getUserOrganizations,
    getToken,
    isLoading,
    isAuthenticated,
  } = useKindeBrowserClient();

  const fetchCourse = async (orgCodeIn: string) => {
    setLoading(true);
    if (!orgCodeIn || orgCodeIn === "" || orgCodeIn === "org_6c3b341e563") {
      setErrorMessage("Organization code is required.");
      setShowErrorMessage(true);
      setBelongsToOrg(false);
      return;
    }

    try {
      const accessToken = await getToken();
      const response = await axios.get<ApiResponse>(
        `${API_BASE_URL}/courses?orgCode=${orgCodeIn}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = response.data;
      // console.log("Response data: ", data);
      const course = data.data[0].attributes;
      setCourse(course);
      setBelongsToOrg(true);
    } catch (error) {
      setErrorMessage(
        `Error fetching course for orgCode ${orgCodeIn}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setShowErrorMessage(true);
      setBelongsToOrg(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async (orgCodesIn: string[]) => {
    setLoading(true);

    if (orgCodesIn.length === 0) {
      setErrorMessage("No organization codes found. Please contact support.");
      setShowErrorMessage(true);
      return;
    }

    try {
      const accessToken = await getToken();
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/courses`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { orgCode: orgCodesIn },
      });
      const courseResponse = response.data.data as CourseResponse[];
      const fetchedCourses: Course[] = courseResponse.map(
        (courseResponse) => courseResponse.attributes
      );
      // console.log("Courses data: ", fetchedCourses);
      setCourses(fetchedCourses);
    } catch (error) {
      setErrorMessage(
        `Error fetching courses: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // console.log("Checking user courses");
      const orgCodeJSON = getOrganization() as unknown as JSON;
      const orgCode = JSON.parse(JSON.stringify(orgCodeJSON)).orgCode;
      setOrgCode(orgCode);
      fetchCourse(orgCode);

      const orgCodesJSON = getUserOrganizations() as unknown as JSON;
      const orgCodes = JSON.parse(JSON.stringify(orgCodesJSON)).orgCodes;
      fetchCourses(orgCodes);
    }
  }, [user, isLoading]);

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
