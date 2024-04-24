"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";

import Link from "next/link";
import {
  CircleUser,
  Fullscreen,
  LogOut,
  Settings,
  Settings2,
  MessageCircleQuestion,
  MoveUpRight,
  Search,
  Bell,
  ClipboardPenLine,
  LineChart,
  Users,
  BadgeDollarSign,
  BadgePlus,
  BellRing,
  Home,
  Menu,
  ScrollText,
  Medal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ui/modeToggle";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { SheetTrigger, SheetContent } from "@/components/ui/sheet";
import DRNIconLogo from "@/public/assets/icon_logo_transparent_fullsize.png";
import { useEffect, useState } from "react";
import { Course } from "../layout";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "../networking/apiExports";
import DRNFullLogo from "@/public/assets/full_logo_transparent_1740x300.png";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ComboBox } from "./comboBox";

interface KindeUser {
  family_name: string;
  given_name: string;
  picture: string;
  email: string;
  id: string;
}

function MenuHeader() {
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

  const [course, setCourse] = useState<Course>({
    orgCode: "",
    courseName: "",
  });
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [belongsToOrg, setBelongsToOrg] = useState(false);

  const pathname = usePathname();

  const [showErrorMessage, setShowErrorMessage] = useState(true);
  const [errorMessage, setErrorMessage] = useState("Testing");

  const { toast } = useToast();
  const orgCode = getOrganization() as unknown as string;
  console.log("orgCode at root: ", orgCode);
  const orgCodes = getUserOrganizations() as unknown as string[];
  console.log("orgCodes at root: ", orgCodes);

  useEffect(() => {
    const fetchCourse = async () => {
      if (isLoading) return;
      console.log("fetching course for orgCode", orgCode);
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
        console.log(`${API_BASE_URL}/course/${orgCode}`);

        const accessToken = getAccessToken();

        const response = await axios.get(`${API_BASE_URL}/course/${orgCode}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response);
        const data = response.data;
        console.log(data);
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
      console.log("fetching courses for orgCodes", orgCodes);
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
        console.log(fetchedCourses);
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

  console.log("isAuthenticated: ", isAuthenticated);
  console.log("user: ", user);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col overflow-auto">
          <div className="flex h-14 items-center border-b px-1 mr-2 lg:h-[60px] lg:px-6 pb-2 gap-2">
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
          <nav className="grid gap-2 text-lg font-medium">
            <DialogTrigger asChild>
              <Button
                asChild
                variant={pathname === "/" ? "secondary" : "ghost"}
                className="w-full justify-start flex gap-2 my-1"
              >
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Home className="h-4 w-4" />
                  Check In
                </Link>
              </Button>
            </DialogTrigger>

            <h2 className="my-4 px-4 text-lg font-semibold tracking-tight">
              Analyze
            </h2>
            <DialogTrigger asChild>
              <Button
                asChild
                variant={pathname === "/leaderboard" ? "secondary" : "ghost"}
                className="w-full justify-start flex gap-2 my-1"
              >
                <Link
                  href="/leaderboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Medal className="h-4 w-4" />
                  Leaderboard
                </Link>
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button
                asChild
                variant={pathname === "/my-rounds" ? "secondary" : "ghost"}
                className="w-full justify-start flex gap-2 my-1"
              >
                <Link
                  href="/my-rounds"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <BellRing className="h-4 w-4" />
                  My Rounds
                </Link>
              </Button>
            </DialogTrigger>
            {course.orgCode === "org_155e4b351474" && (
              <>
                <h2 className="my-4 px-4 text-lg font-semibold tracking-tight">
                  Admin
                </h2>

                <DialogTrigger asChild>
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
                </DialogTrigger>
              </>
            )}

            {/* <div className="mt-auto p-4 w-full">
              <Card className="p-4">
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
          </nav>
        </SheetContent>
      </Sheet>
      {isAuthenticated && (
        <Button variant="outline" size="icon" className="m-auto h-8 w-8 ">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      )}
      <ModeToggle />

      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              {isLoading ? (
                <Skeleton className="h-8 w-8 rounded-full" />
              ) : (
                <Avatar>
                  <AvatarImage
                    src={user?.picture || ""}
                    alt="profile picture"
                  />
                  <AvatarFallback>
                    {user?.given_name?.slice(0, 1)}
                    {user?.family_name?.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
              )}

              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem>
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-lg px-1 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/support"
                className="flex items-center gap-3 rounded-lg px-1 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <MessageCircleQuestion className="h-4 w-4" />
                Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>My Course</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link
                href="/analytics"
                className="flex items-center gap-3 rounded-lg px-1 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                L&F Analytics
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/edit-pickup-options"
                className="flex items-center gap-3 rounded-lg px-1 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings2 className="h-4 w-4" />
                Edit Pickup Options
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/bulletin-board"
                className="flex items-center gap-3 rounded-lg px-1 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ClipboardPenLine className="h-4 w-4" />
                Bulletin Board
              </Link>
            </DropdownMenuItem>
            {course.courseName !== "" ? (
              <ComboBox currentCourse={course} allCourses={allCourses} />
            ) : (
              <Skeleton className="w-[200px] h-[30px] rounded" />
            )}
            {isAuthenticated && <DropdownMenuSeparator className="mt-2" />}

            {isAuthenticated ? (
              <DropdownMenuItem className="flex items-center gap-3 rounded-lg px-2 py-2 text-muted-foreground transition-all hover:text-primary">
                <LogOut className="h-4 w-4" />
                <LogoutLink>Log out</LogoutLink>
              </DropdownMenuItem>
            ) : (
              <></>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <LoginLink>
            <Button
              variant="link"
              size="icon"
              className="w-full justify-start flex gap-2 my-1 p-2"
            >
              Login
            </Button>
          </LoginLink>
          <RegisterLink orgCode="org_6c3b341e563">
            <Button
              variant="default"
              size="icon"
              className="w-full justify-start flex gap-2 my-1 p-2"
            >
              Sign up
            </Button>
          </RegisterLink>
        </div>
      )}
    </header>
  );
}
export default MenuHeader;
