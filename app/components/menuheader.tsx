"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import DRNLightLogo from "@/public/tags_logo_lightmode_long.png";
import DRNDarkLogo from "@/public/tags_logo_darkmode_long.png";
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
  NotebookText,
  ShieldCheck,
  CalendarSearch,
  CalendarPlus,
  LayoutDashboard,
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
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { DialogTrigger } from "@/components/ui/dialog";
import { ComboBox } from "./comboBox";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@radix-ui/react-label";
import { register } from "module";
import { SuggestionFormData } from "../types";
import { useForm } from "react-hook-form";
import { Course } from "../types/Course";
import { useUserCourses } from "../hooks/useUserCourses";

interface KindeUser {
  family_name: string;
  given_name: string;
  picture: string;
  email: string;
  id: string;
}

function MenuHeader() {
  const {
    isLoading,
    isAuthenticated,
    user,
    organization,
    getAccessToken,
    getToken,
    getOrganization,
    getUserOrganizations,
  } = useKindeBrowserClient();

  const orgCode = organization?.orgCode;

  // // console.log("isAuthenticated: ", isAuthenticated);
  // // console.log("user: ", user);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // console.log("width: ", width);
      setIsMobile(width <= 1080);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const {
    courses,
    course,
    isSwitchingOrgs,
    belongsToOrg,
    errorMessage,
    showErrorMessage,
  } = useUserCourses();
  const { theme } = useTheme();

  const pathname = usePathname();

  const { toast } = useToast();

  const [systemTheme, setSystemTheme] = useState("light"); // Default to light theme

  // Step 1: Declare a state variable for the logo
  const [logo, setLogo] = useState(DRNLightLogo);

  useEffect(() => {
    // Existing logic to determine if the system theme is dark
    if (typeof window !== "undefined") {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setSystemTheme("dark");
      } else {
        setSystemTheme("light");
      }
    }

    // Step 2 & 3: Move the logo determination logic into the useEffect
    const currentLogo =
      theme === "system"
        ? systemTheme === "dark"
          ? DRNDarkLogo
          : DRNLightLogo
        : theme === "dark"
        ? DRNDarkLogo
        : DRNLightLogo;

    // Update the logo state
    setLogo(currentLogo);
  }, [theme, systemTheme]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SuggestionFormData>();

  const onSubmit = (data: SuggestionFormData) => {
    // console.log(data);
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
    // console.log("Submitted suggestion");
  };

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
                src={logo}
                width={0}
                height={0}
                alt="Disc Rescue Network"
                style={{ width: "auto", height: "auto", maxHeight: "50px" }}
              />
            </div>
          </div>
          <nav className="grid gap-2 text-lg font-medium">
            {/* <h2 className="my-4 px-4 text-lg font-semibold tracking-tight">
              Analyze
            </h2> */}
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
                  <Medal className="h-4 w-4" />
                  Leaderboard
                </Link>
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
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
                  <NotebookText className="h-4 w-4" />
                  My Rounds
                </Link>
              </Button>
            </DialogTrigger>
            {(course.orgCode === "org_6108516784ae" ||
              course.orgCode === "org_155e4b351474") && (
              <>
                <h2 className="my-4 px-4 text-lg font-semibold tracking-tight">
                  Admin Tools
                </h2>

                <DialogTrigger asChild>
                  <Button
                    asChild
                    variant={pathname === "/admin/tags" ? "secondary" : "ghost"}
                    className="w-full justify-start flex gap-2 my-1"
                  >
                    <Link
                      href="/admin/tags"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <Medal className="h-4 w-4" />
                      Tags
                    </Link>
                  </Button>
                </DialogTrigger>

                {/* <DialogTrigger asChild>
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
                </DialogTrigger> */}
                <DialogTrigger asChild>
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
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button
                    asChild
                    variant={
                      pathname === "/admin/manage-events"
                        ? "secondary"
                        : "ghost"
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
                </DialogTrigger>
                <DialogTrigger asChild>
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
                </DialogTrigger>
              </>
            )}

            <div className="p-4 mt-2 w-full">
              <Card className="p-4 items-center">
                <CardHeader className="py-4 px-1 pt-0">
                  <CardTitle>Suggestion Box</CardTitle>
                  <CardDescription className="text-xs xl:text-sm">
                    Have a suggestion for us? Let us know!
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:pt-0">
                  <Drawer>
                    <DrawerTrigger>
                      <Button
                        asChild
                        variant="default"
                        className="w-full items-center justify-start flex gap-2 my-1"
                      >
                        <div className="flex flex-row gap-2">
                          <NotebookText className="h-4 w-4" />
                          Submit Feedback
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
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
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
          </nav>
        </SheetContent>
      </Sheet>
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
                href="https://www.discrescuenetwork.com/bugreport"
                className="flex items-center gap-3 rounded-lg px-1 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <MessageCircleQuestion className="h-4 w-4" />
                Support
              </Link>
            </DropdownMenuItem>
            {courses.length > 1 && <DropdownMenuSeparator />}

            {courses.length > 1 && <ComboBox />}

            {isAuthenticated && <DropdownMenuSeparator className="mt-2" />}

            {isAuthenticated ? (
              <DropdownMenuItem>
                <LogoutLink>
                  <div className="flex items-center gap-3 rounded-lg px-1 py-2 text-muted-foreground transition-all hover:text-primary">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </div>
                </LogoutLink>
              </DropdownMenuItem>
            ) : (
              <></>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-4">
          <LoginLink orgCode="org_22c313232f39a">
            <Button
              variant="link"
              size="icon"
              className="w-full justify-start flex gap-2 my-1 p-2"
            >
              Login
            </Button>
          </LoginLink>
          <RegisterLink orgCode="org_22c313232f39a">
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
