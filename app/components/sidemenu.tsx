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
  CalendarPlus,
  CalendarSearch,
  Currency,
  Home,
  LayoutDashboard,
  LineChart,
  Medal,
  NotebookText,
  Package2,
  ScrollText,
  Settings,
  ShieldCheck,
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { register } from "module";
import { SuggestionFormData } from "../types";
import { useForm } from "react-hook-form";

function SideMenu() {
  const pathname = usePathname();
  // console.log("pathname: ", pathname);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

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
          duration: 3000,
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SuggestionFormData>();

  const onSubmit = (data: SuggestionFormData) => {
    console.log(data);
    const subject = encodeURIComponent("Suggestion for Tags App");
    const body = encodeURIComponent(
      data.suggestion + "\n\nSubmitted by: " + user?.email + "\n\n"
    );

    if (isMobile) {
      window.location.href = `mailto:support@discrescuenetwork.com?subject=${subject}&body=${body}`;
    } else {
      const mailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=support@discrescuenetwork.com&su=${subject}&body=${body}`;
      window.open(mailUrl, "_blank");
    }
    console.log("Submitted suggestion");
  };

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
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={
                    pathname === "/admin/create-event" ? "secondary" : "ghost"
                  }
                  className="w-full justify-start flex gap-2 my-1"
                >
                  <Link
                    href="/admin/create-event"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <CalendarPlus className="h-4 w-4" />
                    Create Event
                  </Link>
                </Button>

                <Button
                  asChild
                  variant={
                    pathname === "/admin/manage-events" ? "secondary" : "ghost"
                  }
                  className="w-full justify-start flex gap-2 my-1"
                >
                  <Link
                    href="/admin/manage-events"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <CalendarSearch className="h-4 w-4" />
                    Manage Events
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={
                    pathname === "/admin/course-settings"
                      ? "secondary"
                      : "ghost"
                  }
                  className="w-full justify-start flex gap-2 my-1"
                >
                  <Link
                    href="/admin/course-settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Settings className="h-4 w-4" />
                    Course Settings
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
        <div className="p-4 mt-2 w-full">
          <Card className="p-4">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Suggestion Box</CardTitle>
              <CardDescription>
                Have a suggestion for us? Let us know!
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Drawer>
                <DrawerTrigger>
                  <Button
                    asChild
                    variant="default"
                    className="w-full justify-start flex gap-2 my-1"
                  >
                    <div className="flex flex-row gap-2">
                      <NotebookText className="h-4 w-4" />
                      {isMobile ? "Submit" : "Submit Feedback"}
                    </div>
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Submit Suggestion</DrawerTitle>
                    <DrawerDescription>
                      Type your comments or suggestions here.
                    </DrawerDescription>
                  </DrawerHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col w-full p-4 items-center text-left justify-center gap-8 md:flex">
                      <Label className="block w-full">
                        <Textarea
                          {...register("suggestion", { required: true })}
                          className="form-textarea mt-1 mb-2 block w-full"
                          rows={3}
                          placeholder="Enter your suggestion"
                        />
                        {errors.suggestion && (
                          <span className="text-red-500">
                            This field is required
                          </span>
                        )}
                      </Label>
                    </div>
                    <DrawerFooter>
                      <Button type="submit">Submit</Button>
                      <DrawerClose>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </form>
                </DrawerContent>
              </Drawer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
