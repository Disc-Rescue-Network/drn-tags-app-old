"use client";

import type { NextPage } from "next";
import { useState, useEffect } from "react";
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
import { Map, MapPin, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CheckIn: NextPage = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
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
        const futureEvents = data.filter(
          (event: Event) => new Date(event.date) > new Date()
        );
        console.log("Future events:", futureEvents);
        setEvents(futureEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const PROD_READY = true;

  const checkIn = () => {
    console.log("Checking in...");
    // Check in logic here
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
          {/* {events.length === 0 ? ( */}
          {!PROD_READY ? (
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
              {events
                .sort(
                  (a, b) =>
                    new Date(`${a.date}T${a.time}Z`).getTime() -
                    new Date(`${b.date}T${b.time}Z`).getTime()
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
                            new Date(event.date),
                            window.innerWidth <= 768
                              ? "EEE, MMM d"
                              : "EEEE, MMMM do"
                          )}{" "}
                          @{" "}
                          {format(
                            new Date(`${event.date}T${event.time}Z`),
                            "h:mm a"
                          )}
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
                      </div>
                      <div className="flex flex-row gap-1 h-full w-full items-end justify-end">
                        <Button className="text-xs" onClick={checkIn}>
                          Check In
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CheckIn;
