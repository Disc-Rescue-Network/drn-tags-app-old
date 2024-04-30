"use client";

import type { NextPage } from "next";
import { useState, useEffect, use } from "react";
import { Event } from "../types";
import { TAGS_API_BASE_URL } from "../networking/apiExports";
import { format } from "date-fns";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Map, MapPin, User } from "lucide-react";
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

const CheckIn: NextPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const { isAuthenticated, user } = useKindeBrowserClient();

  const [unauthenticatedCheckIn, setUnauthenticatedCheckIn] = useState(false);
  const [ignoreLoginErrors, setIgnoreLoginErrors] = useState(false);

  const handleAlertDialogDismiss = () => {
    setUnauthenticatedCheckIn(false);
  };

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
        const futureEvents = data.filter((event: Event) => {
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
        });
      });
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     console.log("Fetched events data:", events);
  //     // Filter events that are in the future
  //     const futureEvents = events.filter((event: Event) => {
  //       const eventDate = new Date(event.dateTime);
  //       const currentDate = new Date();

  //       console.log("Event Date:", eventDate);
  //       console.log("Current Date:", currentDate);
  //       console.log("Comparison Result:", eventDate > currentDate);

  //       return eventDate > currentDate;
  //     });
  //     console.log("Future events:", futureEvents);
  //     setEvents(futureEvents);
  //   }, 1000); // Update every second

  //   return () => {
  //     clearInterval(intervalId); // Clear the interval when the component unmounts
  //   };
  // }, [events]); // Recreate the interval whenever the data changes

  const PROD_READY = true;

  const checkIn = () => {
    console.log("Checking in...");
    if (!isAuthenticated || !user) {
      setUnauthenticatedCheckIn(true);
    }
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
            // {!PROD_READY ? (
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
                      <Card className="text-left w-full" key={event.id}>
                        <CardHeader className="p-4">
                          <CardDescription
                            className="text-balance leading-relaxed grid grid-cols-2 w-full"
                            style={{ gridTemplateColumns: "60% 40%" }}
                          >
                            <div className="text-left text-xs">
                              {format(
                                new Date(event.dateTime),
                                isMobile ? "EEE, MMM d" : "EEEE, MMMM do"
                              )}{" "}
                              @ {format(new Date(event.dateTime), "h:mm a")}
                            </div>
                            <div className="flex flex-row gap-1 items-center justify-end text-xs text-right">
                              <MapPin className="h-4 w-4" /> {event.location}
                            </div>
                          </CardDescription>

                          <CardTitle>{event.eventName}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex flex-row gap-4 w-full justify-between items-end md:flex-row lg:flex-row p-4">
                          <div className="flex flex-col gap-4 justify-start items-start p-0 m-0 w-full md:flex-col lg:flex-col">
                            <div className="flex flex-row gap-1 items-center justify-start">
                              <Map className="h-4 w-4" />
                              <Label className="text-xs">{event.layout}</Label>
                            </div>
                            <div className="flex flex-row gap-1 items-center justify-start">
                              <User className="h-4 w-4" />
                              <Label className="text-xs">{event.format}</Label>
                            </div>
                            {isMobile ? (
                              <div className="flex flex-row w-full gap-1 items-center justify-start">
                                <Progress
                                  value={(5 / event.maxSignups) * 100}
                                  max={event.maxSignups}
                                  aria-label="Sign ups"
                                />
                                <Popover>
                                  <PopoverTrigger>
                                    <Info className="w-4 h-4" />{" "}
                                  </PopoverTrigger>
                                  <PopoverContent className="text-xs">
                                    5 / {event.maxSignups} Total Signups
                                  </PopoverContent>
                                </Popover>
                              </div>
                            ) : (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Progress
                                      value={(5 / event.maxSignups) * 100}
                                      max={event.maxSignups}
                                      aria-label="Sign ups"
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    5 / {event.maxSignups} Total Signups
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <div className="flex flex-row gap-1 h-full w-full items-end justify-end">
                            <CheckInButton
                              event={event}
                              checkIn={checkIn}
                              isMobile={isMobile}
                              isLoading={isLoading}
                            />
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
        <AlertDialog
          open={unauthenticatedCheckIn}
          onOpenChange={handleAlertDialogDismiss}
        >
          <AlertDialogContent className="w-80">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Continue without logging in?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-left">
                In order to save your user settings, round history and more, you
                will need to log in. However, you can continue without logging
                in. <br></br> <br></br>Please note that your data may not be
                saved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => setIgnoreLoginErrors(true)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default CheckIn;
