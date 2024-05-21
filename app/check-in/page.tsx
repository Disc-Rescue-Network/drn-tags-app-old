"use client";

import type { NextApiRequest, NextApiResponse, NextPage } from "next";
import { useState, useEffect, use } from "react";
import { CheckInData, CheckInFormData, TagsEvent } from "../types";
import { TAGS_API_BASE_URL } from "../networking/apiExports";
import { format, set } from "date-fns";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Info, Map, MapPin, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CheckInButton from "./checkInButton";
import { toast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCheckUDiscDisplayName } from "../hooks/useCheckUDiscDisplayName";
import { useLogin } from "../hooks/useLogin";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUserDetails } from "../hooks/useUserDetails";
import CheckInForm from "./checkInForm";

const CheckIn: NextPage = () => {
  const [events, setEvents] = useState<TagsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [checkInStarted, setCheckInStarted] = useState(false);
  // const [unauthenticatedCheckIn, setUnauthenticatedCheckIn] = useState(false);
  const [udiscDisplayName, setUdiscDisplayName] = useState("");

  const { isAuthenticated, user, getAccessToken } = useKindeBrowserClient();
  const { loading: loginLoading, doesAccountExist } = useLogin(
    isAuthenticated,
    user,
    getAccessToken
  );
  const { loading: displayNameLoading, isUDiscNameMissing } =
    useCheckUDiscDisplayName(
      isAuthenticated,
      user,
      getAccessToken,
      doesAccountExist
    );

  console.log("Does account exist:", doesAccountExist);
  console.log("Login loading:", loginLoading);
  console.log("Is authenticated:", isAuthenticated);
  console.log("User:", user);
  console.log("Is UDisc name missing:", isUDiscNameMissing);
  console.log("Display name loading:", displayNameLoading);

  const { userProfile, setUserProfile } = useUserDetails(
    isAuthenticated,
    user,
    getAccessToken
  );

  useEffect(() => {
    console.log("userProfile", userProfile);
  }, [userProfile]);

  useEffect(() => {
    setIsLoading(true);
    console.log("Fetching events data...");
    // Fetch events data from your API
    fetch(`${TAGS_API_BASE_URL}/api/events`)
      .then((response) => {
        console.log(response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Fetched events data:", data);
        // Filter events that are in the future
        const futureEvents = data.filter((event: TagsEvent) => {
          const eventDate = new Date(event.dateTime);
          const currentDate = new Date();

          console.log("Event Date:", eventDate);
          console.log("Current Date:", currentDate);
          console.log("Comparison Result:", eventDate > currentDate);

          return eventDate > currentDate;
        });
        console.log("Future events:", futureEvents);
        setEvents(futureEvents);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "There was an error fetching the events. Please try again later",
          duration: 3000,
        });
      });
  }, []);

  const beginUnauthenticatedCheckIn = () => {
    console.log("Beginning unauthenticated check in...");
    //bring up a form with no data prefilled
  };

  const [showLoginDisclaimer, setShowLoginDisclaimer] = useState(false);

  const [eventForCheckIn, setEventForCheckIn] = useState<TagsEvent | null>(
    null
  );

  const checkIn = (event: TagsEvent) => {
    console.log("Checking in to event: ", event);

    // check for authentication
    if (!user || !userProfile) {
      console.log("User or userProfile is missing...");
      setShowLoginDisclaimer(true);
      return;
    }

    //if they get here, they are logged in
    setEventForCheckIn(event);
    setCheckInStarted(true);
    console.log("Check-in started...");
  };

  const handleCheckInComplete = () => {
    console.log("check in complete...");
    setCheckInStarted(false);
  };

  const checkInPlayer = async (formData: CheckInFormData) => {
    console.log("Checking in player...", formData);
    try {
      const response = await fetch(`${TAGS_API_BASE_URL}/api/player-check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Check-in successful:", data);
      toast({
        variant: "default",
        title: "Check-in successful",
        description: "You have been successfully checked in.",
        duration: 3000,
      });

      // Find the event that the player is checking into
      const eventIndex = events.findIndex(
        (event) => event.event_id === formData.event_id
      );

      if (eventIndex !== -1) {
        // Create a new copy of the event and update its CheckedInPlayers array
        const updatedEvent = {
          ...events[eventIndex],
          CheckedInPlayers: [...events[eventIndex]!.CheckedInPlayers!, data],
        };

        // Create a new copy of the events array and replace the old event with the updated event
        const updatedEvents = [...events];
        updatedEvents[eventIndex] = updatedEvent;

        // Update the events state
        setEvents(updatedEvents);
      }

      return data; // Handle success
    } catch (error: any) {
      console.error("Failed to check in:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check in. Please try again later.",
        duration: 3000,
      });
    }
  };

  const handleAlertDialogDismiss = () => {
    // setUnauthenticatedCheckIn(false);
    setShowLoginDisclaimer(false);
  };

  useEffect(() => {
    const handleResize = () => {
      console.log("Window width:", window.innerWidth);
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        console.log("isMobile is true");
      } else {
        setIsMobile(false);
        console.log("isMobile is false");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isCheckedIn = (event: TagsEvent, kindeId: string) => {
    return event.CheckedInPlayers!.some(
      (player: CheckInData) => player.kinde_id === kindeId
    );
  };

  return (
    <div className="grid min-h-screen w-full text-center items-start">
      <main className="flex flex-1 min-h-96 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex">
          <h1 className="text-lg font-semibold md:text-2xl">Check In</h1>
        </div>
        <div
          className="flex flex-1 w-full m-auto h-full items-center justify-center rounded-lg border border-dashed shadow-sm p-2 bg-muted/60"
          x-chunk="dashboard-02-chunk-1"
        >
          {events.length === 0 ? (
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                No events running right now
              </h3>
              <p className="text-sm text-muted-foreground">
                Check back later when the admin has started an event.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full h-full justify-start items-start mb-auto">
              {isLoading ? (
                <Skeleton className="w-full h-24" />
              ) : (
                <div className="flex flex-col gap-4 w-full justify-start items-start">
                  {events
                    .filter((event) => new Date(event.dateTime) > new Date())
                    .sort(
                      (a, b) =>
                        new Date(a.dateTime).getTime() -
                        new Date(b.dateTime).getTime()
                    )
                    .map((event) => (
                      <Card className="text-left w-full" key={event.event_id}>
                        <CardHeader className="p-4">
                          <CardDescription
                            className="text-balance leading-relaxed items-center flex flex-row justify-between w-full"
                            style={{ gridTemplateColumns: "60% 40%" }}
                          >
                            {format(
                              new Date(event.dateTime),
                              isMobile ? "EEE, MMM d" : "EEEE, MMMM do"
                            )}{" "}
                            @ {format(new Date(event.dateTime), "h:mm a")}
                            <Label className="flex flex-row gap-2 justify-center items-center">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </Label>
                          </CardDescription>

                          <CardTitle>{event.eventName}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex flex-row gap-4 w-full justify-between items-end md:flex-row lg:flex-row p-4">
                          <div className="flex flex-col gap-4 justify-start items-start p-0 m-0 w-full md:flex-col lg:flex-col">
                            <div className="flex flex-row gap-1 items-center justify-start">
                              <Map className="h-4 w-4" />
                              <Label className="text-xs">
                                {event.layout.name}
                              </Label>
                            </div>
                            <div className="flex flex-row gap-1 items-center justify-start">
                              <User className="h-4 w-4" />
                              <Label className="text-xs">{event.format}</Label>
                            </div>
                            {isMobile ? (
                              <div className="flex flex-row w-full gap-1 items-center justify-start">
                                <Progress
                                  value={
                                    (event.CheckedInPlayers!.length /
                                      event.maxSignups) *
                                    100
                                  }
                                  max={event.maxSignups}
                                  aria-label="Sign ups"
                                />
                                <Popover>
                                  <PopoverTrigger>
                                    <Info className="w-4 h-4" />{" "}
                                  </PopoverTrigger>
                                  <PopoverContent className="text-xs">
                                    {event.CheckedInPlayers!.length} /{" "}
                                    {event.maxSignups} Total Signups
                                  </PopoverContent>
                                </Popover>
                              </div>
                            ) : (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Progress
                                      value={
                                        (event.CheckedInPlayers!.length /
                                          event.maxSignups) *
                                        100
                                      }
                                      max={event.maxSignups}
                                      aria-label="Sign ups"
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {event.CheckedInPlayers!.length} /{" "}
                                    {event.maxSignups} Total Signups
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          {isAuthenticated ? (
                            <div className="flex flex-row gap-1 h-full w-full items-end justify-end">
                              {isCheckedIn(event, user!.id) ? (
                                <Label className="text-xs flex flex-row gap-2">
                                  <Check className="w-4 h-4" />
                                  Checked In!
                                </Label>
                              ) : (
                                <CheckInButton
                                  event={event}
                                  checkIn={() => checkIn(event)}
                                  isMobile={isMobile}
                                  isLoading={isLoading}
                                />
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-row gap-1 h-full w-full items-end justify-end">
                              <Label>Login before checking in</Label>
                            </div>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
        <AlertDialog
          open={showLoginDisclaimer}
          onOpenChange={handleAlertDialogDismiss}
        >
          <AlertDialogContent className="w-80">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                You are not logged in
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-left">
                In order to continue, you will need to log in. If you do not
                have an account, you will need to create one. <br></br>{" "}
                <br></br>Please close this dialog and click the
                &apos;Login&apos; or &apos;Sign up&apos; button (top right) to
                continue.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Sounds good!</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {checkInStarted && eventForCheckIn && (
          <CheckInForm
            userProfile={userProfile!}
            event={eventForCheckIn!}
            kinde_id={userProfile!.kinde_id}
            onSubmit={checkInPlayer} // Pass the function directly
            setCheckInStarted={setCheckInStarted}
            onClose={handleCheckInComplete}
          />
        )}
      </main>
    </div>
  );
};

export default CheckIn;
