"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BadgeDollarSign,
  BadgePlus,
  Bell,
  BellRing,
  Currency,
  Home,
  LineChart,
  Medal,
  NotebookText,
  Package2,
  ScrollText,
} from "lucide-react";
import DRNIconLogo from "@/public/assets/icon_logo_transparent_fullsize.png";
import DRNFullLogo from "@/public/assets/full_logo_transparent_1740x300.png";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Course, KindeOrganization } from "../layout";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Combo } from "next/font/google";
import { ComboBox } from "./comboBox";
import { API_BASE_URL } from "../networking/apiExports";
import { Skeleton } from "@/components/ui/skeleton";

function SideMenu() {
  const pathname = usePathname();
  // console.log("pathname: ", pathname);

  const [belongsToOrg, setBelongsToOrg] = useState(false);
  const [course, setCourse] = useState<Course>({
    orgCode: "",
    courseName: "",
  });
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  const [showErrorMessage, setShowErrorMessage] = useState(true);
  const [errorMessage, setErrorMessage] = useState("Testing");

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

  const { toast } = useToast();
  const orgCode = getOrganization() as unknown as string;
  // console.log("orgCode at root: ", orgCode);
  const orgCodes = getUserOrganizations() as unknown as string[];
  // console.log("orgCodes at root: ", orgCodes);

  useEffect(() => {
    const fetchCourse = async () => {
      if (isLoading) return;
      // console.log("fetching course for orgCode", orgCode);
      if (!orgCode || orgCode === "" || orgCode === "org_6c3b341e563") {
        console.error("Organization code is required");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Organization code is required.",
        });
        setBelongsToOrg(false);
        return;
      }

      try {
        // console.log(`${API_BASE_URL}/course/${orgCode}`);

        const accessToken = getAccessToken();

        const response = await axios.get(`${API_BASE_URL}/course/${orgCode}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // console.log(response);
        const data = response.data;
        // console.log(data);
        setCourse(data);
        setBelongsToOrg(true);
      } catch (error) {
        console.error(`Error fetching course for orgCode ${orgCode}: ${error}`);
        setErrorMessage(
          `Error fetching course for orgCode ${orgCode}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        setShowErrorMessage(true);
        setBelongsToOrg(false);
      }
    };

    fetchCourse();

    const fetchCourses = async () => {
      // console.log("fetching courses for orgCodes", orgCodes);
      if (orgCodes === undefined || orgCodes === null) {
        console.error("No organization codes provided");
        setErrorMessage("No organization codes found. Please contact support.");
        setShowErrorMessage(true);
        return;
      }

      if (orgCodes.length === 0) {
        console.error("No organization codes provided");
        setErrorMessage("No organization codes found. Please contact support.");
        setShowErrorMessage(true);
        return;
      }

      try {
        const accessToken = getToken();
        const response = await axios.get(`${API_BASE_URL}/courses`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: { orgCodes: orgCodes },
        });

        const fetchedCourses: Course[] = response.data;
        // console.log(fetchedCourses);
        setAllCourses(fetchedCourses);
      } catch (error) {
        console.error(`Error fetching courses: ${error}`);
        setErrorMessage(
          `Error fetching courses: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        setShowErrorMessage(true);
      }
    };

    fetchCourses();
  }, [orgCode, orgCodes]);

  // if (isLoading) return <div>Loading...</div>;

  // console.log("isAuthenticated: ", isAuthenticated);
  // console.log("user: ", user);

  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-3/7 lg:w-1/5">
      <div className="flex max-h-screen flex-col gap-2 ">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <Image
              src={DRNFullLogo}
              width={0}
              height={0}
              alt="Disc Rescue Network"
              style={{ width: "auto", height: "auto" }} // optional
            />
          </div>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {/* <h2 className="my-4 px-4 text-lg font-semibold tracking-tight">
              Analyze
            </h2> */}

            <Button
              asChild
              variant={pathname === "/" ? "secondary" : "ghost"}
              className="w-full justify-start flex gap-2 my-1"
            >
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Medal className="h-4 w-4" />
                Leaderboard
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/check-in" ? "secondary" : "ghost"}
              className="w-full justify-start flex gap-2 my-1"
            >
              <Link
                href="/check-in"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Check In
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/my-rounds" ? "secondary" : "ghost"}
              className="w-full justify-start flex gap-2 my-1"
            >
              <Link
                href="/my-rounds"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <NotebookText className="h-4 w-4" />
                My Rounds
              </Link>
            </Button>

            {course.orgCode === "org_155e4b351474" && (
              <>
                <h2 className="my-4 px-4 text-lg font-semibold tracking-tight">
                  Admin Tools
                </h2>

                <Button
                  asChild
                  variant={pathname === "/admin" ? "secondary" : "ghost"}
                  className="w-full justify-start flex gap-2 my-1"
                >
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Medal className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
        {/* <div className="mt-auto p-4">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full background-primary-red">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
}

export default SideMenu;
