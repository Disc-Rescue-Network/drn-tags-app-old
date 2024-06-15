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
import {
  Check,
  Handshake,
  Info,
  Map,
  MapPin,
  MoreHorizontal,
  Pencil,
  ShieldAlert,
  Undo,
  User,
  X,
} from "lucide-react";
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
import { DataTableColumnHeader } from "@/app/components/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableAllEvents } from "./DataTableAllEvents";

const ManageEvents: NextPage = () => {
  const [events, setEvents] = useState<TagsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const statuses = [
    {
      value: false,
      label: "Not Paid",
      icon: ShieldAlert,
    },
    {
      value: true,
      label: "Paid",
      icon: Check,
    },
  ];

  const labels = [
    {
      value: "paid",
      label: "Paid",
    },
    {
      value: "unpaid",
      label: "Not Paid",
    },
  ];

  const columns: ColumnDef<TagsEvent>[] = [
    // {
    //   accessorKey: "event_id",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Event ID" />
    //   ),
    //   enableSorting: true,
    //   cell: ({ row }) => {
    //     return (
    //       <Label className="max-w-[500px] truncate font-medium flex flex-row gap-2 min-w-fit">
    //         {row.original.event_id}
    //       </Label>
    //     );
    //   },
    // },
    {
      accessorKey: "eventName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Event Name" />
      ),
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <Label className="max-w-[500px] truncate font-medium flex flex-row gap-2 min-w-fit">
            {row.original.eventName}
          </Label>
        );
      },
    },
    {
      accessorKey: "dateTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Event Date" />
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const eventDate = new Date(row.original.dateTime);
        return (
          <Label className="max-w-[500px] truncate font-medium flex flex-row gap-2 min-w-fit">
            {format(eventDate, "MM/dd/yyyy h:mm a")}
          </Label>
        );
      },
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <Label className="max-w-[500px] truncate font-medium flex flex-row gap-2 min-w-fit">
            {row.original.location}
          </Label>
        );
      },
    },
    {
      accessorKey: "layout",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Layout" />
      ),
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <Label className="max-w-[500px] truncate font-medium flex flex-row gap-2 min-w-fit">
            {row.original.layout.name}
          </Label>
        );
      },
    },
    {
      accessorKey: "checkedInPlayers",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Check Ins" />
      ),
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <Label className="max-w-[500px] truncate font-medium flex flex-row gap-2 min-w-fit">
            {row.original.CheckedInPlayers?.length} / {row.original.maxSignups}
          </Label>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const event = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => openEvent(event)}>
                <div className="flex flex-row gap-2 justify-center items-center">
                  <Info className="w-4 h-4" /> Manage Event
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editEvent(event)}>
                <div className="flex flex-row gap-2 justify-center items-center">
                  <Pencil className="w-4 h-4" /> Edit Event Details
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => deleteEvent(event)}>
                <div className="flex flex-row gap-2 justify-center items-center">
                  <X className="w-4 h-4" /> Delete Event
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
    console.log("Opening event:", event.event_id);
    router.push(`/admin/events/${event.event_id}`);
  }

  function deleteEvent(event: TagsEvent) {
    console.log("Deleting event:", event.event_id);
    fetch(`${TAGS_API_BASE_URL}/api/events/${event.event_id}`, {
      method: "DELETE",
    })
      .then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          console.log("Event deleted successfully");
          toast({
            variant: "default",
            title: "Event Deleted",
            description: "The event has been deleted successfully",
            duration: 3000,
          });
          const updatedEvents = events.filter(
            (e) => e.event_id !== event.event_id
          );
          setEvents(updatedEvents);
        } else {
          console.error("Error deleting event:", response.status);
          toast({
            variant: "destructive",
            title: "Error",
            description:
              "There was an error deleting the event. Please try again later",
            duration: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "There was an error deleting the event. Please try again later",
          duration: 3000,
        });
      });
  }

  function editEvent(event: TagsEvent) {
    router.push(`/admin/events/edit/${event.event_id}`);
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
            <div className="grid grid-cols-1 gap-8">
              {isLoading ? (
                <Skeleton className="w-full h-24" />
              ) : (
                <DataTableAllEvents columns={columns} data={events} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageEvents;
