"use client";

import type { NextApiRequest, NextApiResponse, NextPage } from "next";
import { useState, useEffect, use } from "react";
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
import { Info, Map, MapPin, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useCheckUDiscDisplayName } from "../../hooks/useCheckUDiscDisplayName";
import { useLogin } from "../../hooks/useLogin";
import { useUserDetails } from "../../hooks/useUserDetails";
import { TagsEvent } from "@/app/types";
import { TAGS_API_BASE_URL } from "@/app/networking/apiExports";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

const ManageEvents: NextPage = () => {
  const [events, setEvents] = useState<TagsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  const { userProfile, setUserProfile } = useUserDetails(
    isAuthenticated,
    user,
    getAccessToken
  );

  const router = useRouter();

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
          eventDate.setHours(0, 0, 0, 0);

          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);

          console.log("Event Date:", eventDate);
          console.log("Current Date:", currentDate);
          console.log("Comparison Result:", eventDate >= currentDate);

          return eventDate >= currentDate;
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

  function openEvent(event: TagsEvent) {
    return () => {
      router.push(`/admin/events/${event.event_id}`);
    };
  }

  function editEvent(event: TagsEvent) {
    return () => {
      router.push(`/admin/events/edit/${event.event_id}`);
    };
  }

  return (
    <div className="grid min-h-screen w-full text-center items-start">
      <main className="flex flex-1 min-h-96 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex">
          <h1 className="text-lg font-semibold md:text-2xl">Manage Events</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {isLoading ? (
                <Skeleton className="w-full h-24" />
              ) : (
                <Table className="w-full text-left relative">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.event_id}>
                        <TableCell>{event.eventName}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {format(new Date(event.dateTime), "MM/dd/yyyy")}
                        </TableCell>
                        <TableCell className="grid grid-cols-3 gap-4">
                          <Button variant="default" onClick={openEvent(event)}>
                            Manage
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={editEvent(event)}
                          >
                            Edit Details
                          </Button>

                          <Button variant="destructive">Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageEvents;
