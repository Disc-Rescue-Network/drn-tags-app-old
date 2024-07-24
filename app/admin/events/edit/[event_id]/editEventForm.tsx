"use client";

import { Info, Loader2, Map, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { addMinutes, format, formatISO, set, subMinutes } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePickerWithPresets } from "@/app/components/DatePickerWithPresets";
import { TAGS_API_BASE_URL } from "@/app/networking/apiExports";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import * as React from "react";
import { Division, EventPreview, LayoutModel, TagsEvent } from "@/app/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { KindeOrganization } from "@kinde-oss/kinde-auth-nextjs/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { time } from "console";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

interface EventPreviewProps {
  data: EventPreview;
}

const formats = [
  { format_id: 1, name: "Singles" },
  { format_id: 2, name: "Doubles" },
  { format_id: 3, name: "Triples" },
  { format_id: 4, name: "Match Play" },
]; // Array of format options

// const layouts = [
//   "Short Tees",
//   "Long Tees",
//   "Short 4s, Long 3s",
//   "Long 4s, Short 3s",
//   "Mullet",
// ]; // Array of layout options

const layoutSchema = z.object({
  layout_id: z.number().optional(),
  name: z.string(),
  par: z.string(),
});

// Define the form schema using Zod
const eventSchema = z.object({
  event_id: z.number().optional(),
  dateTime: z.date({
    required_error: "This field is required",
  }),
  date: z.date({ required_error: "This field is required" }),
  time: z
    .string({
      required_error: "This field is required",
    })
    .min(1, { message: "This field is required" }),
  location: z
    .string({
      required_error: "This field is required",
    })
    .min(1, { message: "This field is required" }),
  format: z
    .string({
      required_error: "This field is required",
    })
    .min(1, { message: "This field is required" }),
  leagueName: z.string().optional(),
  eventName: z.string().min(1),
  udiscLeagueURL: z.string().refine((url) => isValidUDiscURL(url), {
    message: "Invalid uDisc URL. Must end with '?tab=scores'.",
  }),
  maxSignups: z.number().min(1),
  layout: layoutSchema,
  checkInPeriod: z.number().min(1),
  divisions: z.array(
    z.object({ division_id: z.number(), name: z.string(), active: z.boolean() })
  ),
  courseId: z.string().optional(),
});

const EventPreviewComponent = (props: EventPreviewProps) => {
  const event = props.data;
  const checkInEndTime = addMinutes(new Date(event.dateTime), -15);
  let formattedCheckInEndTime = "";
  try {
    formattedCheckInEndTime = format(checkInEndTime, "MMM d, yyyy h:mm aa");
  } catch (error) {
    console.error("Invalid time value:", checkInEndTime);
  }

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  // console.log("Event Date Time:", event.dateTime);

  let dateTime;

  if (!event.date || !event.time) {
    dateTime = "Invalid Date";
  } else {
    const date = new Date(event.date);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    dateTime = new Date(`${localDate}T${event.time}`);
    // console.log("Event Date Time:", dateTime);
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Card className="text-left w-full">
      <CardHeader className="p-4">
        <CardDescription
          className="text-balance leading-relaxed grid grid-cols-2 w-full"
          style={{ gridTemplateColumns: "60% 40%" }}
        >
          <div className="text-left text-xs">
            {/* {dateTime.toString() !== "Invalid Date" ? (
              <>
                {format(
                  new Date(dateTime),
                  isMobile ? "EEE, MMM d" : "EEEE, MMMM do"
                )}{" "}
                @ {format(new Date(dateTime), "h:mm a")}
              </>
            ) : (
              <span>&nbsp;</span>
            )} */}
            {format(
              event.dateTime,
              isMobile ? "EEE, MMM d, h:mm a" : "EEEE, MMMM do, h:mm a"
            )}{" "}
          </div>
          <div className="flex flex-row gap-1 items-center justify-end text-xs text-right text-nowrap">
            <MapPin className="h-4 w-4" /> {event.location}
          </div>
        </CardDescription>

        <CardTitle>{event.eventName}</CardTitle>
      </CardHeader>
      <CardFooter className="flex flex-row gap-4 w-full justify-between items-end md:flex-row lg:flex-row p-4">
        <div className="flex flex-col gap-4 justify-start items-start p-0 m-0 md:flex-col lg:flex-col w-[60%]">
          <div className="flex flex-row gap-1 items-center justify-start">
            <Map className="h-4 w-4" />
            <Label className="text-xs">{event.layout.name}</Label>
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
                <TooltipContent className="text-xs">
                  5 / {event.maxSignups} Total Signups
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex flex-row gap-1 h-full w-full items-end justify-end">
          <Button className="text-xs">Check In</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

function isValidUDiscURL(url: string): boolean {
  const uDiscDomain = "udisc.com"; // Define uDisc domain
  const uDiscTabParam = "?tab=scores"; // Define required tab parameter

  // Check if URL is valid and ends with "?tab=scores"
  return (
    url.startsWith("http://") ||
    (url.startsWith("https://") && // Check if URL starts with http:// or https://
      url.includes(uDiscDomain) && // Check if URL contains uDisc domain
      url.endsWith(uDiscTabParam))
  ); // Check if URL ends with "?tab=scores"
}

export default function EditEventForm({
  params,
}: {
  params: { event: TagsEvent };
}) {
  let event = params.event;
  // console.log("EVENT IN:", event);
  event.dateTime = new Date(event.dateTime);

  let eventDate = new Date(event.dateTime).toLocaleDateString();
  let eventTime = new Date(event.dateTime).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Define your form
  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      event_id: event.event_id,
      dateTime: new Date(event.dateTime),
      date: new Date(eventDate),
      time: eventTime,
      location: event.location,
      format: event.format,
      leagueName: event.leagueName,
      eventName: event.eventName,
      udiscLeagueURL: event.udiscLeagueURL,
      maxSignups: event.maxSignups,
      layout: event.layout || null,
      checkInPeriod: event.checkInPeriod,
      divisions: event.divisions,
      courseId: event.courseId,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = form;

  const { toast } = useToast();

  const [previewOpen, setPreviewOpen] = React.useState(false); // State to control preview modal
  const { isLoading, isAuthenticated, user, organization } =
    useKindeBrowserClient();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function onSubmit(data: z.infer<typeof eventSchema>) {
    // console.log("on submit called");
    setIsSubmitting(true);
    // console.log(data);

    const date = new Date(data.date);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    const dateTime = new Date(`${localDate}T${data.time}`);
    // console.log("FINAL DateTime:", dateTime);

    // Now you can use dateTime in your submit logic
    // For example:
    const eventData = {
      ...data,
      dateTime,
      date: undefined,
      time: undefined,
      courseId: organization,
    };
    delete eventData.date;
    delete eventData.time;

    setPreviewOpen(false); // Close preview modal

    // Validate uDisc URL
    if (!isValidUDiscURL(data.udiscLeagueURL)) {
      // Display error toast if URL is invalid
      toast({
        variant: "destructive",
        title: "Invalid uDisc URL",
        description:
          'The uDisc URL must be a valid URL and end with "?tab=scores".',
        duration: 3000,
      });
      setIsSubmitting(false);
      return; // Exit early if URL is invalid
    }

    // console.log(JSON.stringify(data));

    //Make POST request to API endpoint
    fetch(`${TAGS_API_BASE_URL}/api/events/${event.event_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => {
        if (!response.ok) {
          setIsSubmitting(false);
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful response from API
        // console.log("Event edited successfully:", data);
        setIsSubmitting(false);
        toast({
          variant: "default",
          title: "Event edited successfully",
          description: "Your event has been successfully edited.",
          duration: 3000,
        });
      })
      .catch((error) => {
        // Handle errors
        console.error("Error editing event:", error);
        setIsSubmitting(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to edit event. Please try again later.",
          duration: 3000,
        });
      });
  }

  const layout = watch("layout");
  const checkInPeriod = watch("checkInPeriod");
  const maxSignups = watch("maxSignups");
  const date = watch("date");
  const time = watch("time");
  const location = watch("location");
  const format = watch("format");
  const eventName = watch("eventName");
  const udiscLeagueURL = watch("udiscLeagueURL");
  const divisionsWatch = watch("divisions");

  const dateValue = getValues().date;
  const timeValue = getValues().time;

  if (!dateValue || !timeValue) {
    console.error("Date or time is empty");
  } else {
    const dateTmp = new Date(dateValue);
    const localDate = new Date(
      dateTmp.getTime() - dateTmp.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    const dateTime = new Date(`${localDate}T${timeValue}`);
    // console.log("FINAL DateTime:", dateTime);
    setValue("dateTime", dateTime);
  }

  // console.log(getValues());
  // console.log(errors);

  const currentEvent: any = getValues();
  // console.log("Current Event:", currentEvent);

  let differences: { field: string; previousValue: any; newValue: any }[] = [];

  Object.keys(event as any).forEach((key) => {
    if (
      key === "Divisions" ||
      key === "CheckedInPlayers" ||
      key === "updatedAt" ||
      key === "createdAt"
    ) {
      // console.log("Skipping key:", key);
      return;
    }

    if (key === "divisions") {
      const activeCurrentDivisions = currentEvent.divisions
        .filter((division: any) => division.active)
        .sort((a: any, b: any) => a.division_id - b.division_id);

      const activeEventDivisions = (event as TagsEvent).divisions.sort(
        (a: any, b: any) => a.division_id - b.division_id
      );

      if (
        JSON.stringify(activeCurrentDivisions) !==
        JSON.stringify(activeEventDivisions)
      ) {
        differences.push({
          field: key,
          previousValue: activeEventDivisions,
          newValue: activeCurrentDivisions,
        });
      }
      return;
    }

    if (key === "layout_id") {
      return;
    }

    if (key === "layout") {
      if (currentEvent.layout.layout_id !== event.layout.layout_id) {
        differences.push({
          field: key,
          newValue: currentEvent.layout,
          previousValue: event.layout,
        });
      }
      return;
    }

    if (key === "dateTime") {
      if (currentEvent.date && currentEvent.time) {
        const date = new Date(currentEvent.date);
        const localDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
        const dateTime = new Date(`${localDate}T${currentEvent.time}`);
        if (dateTime.getTime() !== event.dateTime.getTime()) {
          differences.push({
            field: key,
            newValue: dateTime,
            previousValue: event.dateTime,
          });
        }
      }
      return;
    }

    if ((event as any)[key] !== currentEvent[key]) {
      differences.push({
        field: key,
        newValue: currentEvent[key],
        previousValue: (event as any)[key],
      });
    }
  });

  console.log("Differences:", differences);

  // console.log("Org Code:", organization);

  const [layouts, setLayouts] = React.useState<LayoutModel[]>([]);
  const [divisions, setDivisions] = React.useState<Division[]>([]);

  async function fetchSettingsData() {
    if (!organization) {
      console.error("Organization not found");
      return null;
    }

    // console.log("Fetching settings data...");
    try {
      const response = await fetch(
        `${TAGS_API_BASE_URL}/api/fetch-course-settings/${organization}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch settings data");
      }
      // console.log("Settings data fetched successfully");
      const data = await response.json();
      // console.log("Settings data:", data);
      return data; // Return the fetched settings data
    } catch (error) {
      console.error("Error fetching settings data:", error);
      return null;
    }
  }

  // Use useEffect to fetch settings data when the component mounts
  useEffect(() => {
    // Fetch settings data
    console.log("Fetching settings data...");
    fetchSettingsData()
      .then((settingsData) => {
        if (!settingsData) {
          console.error("Settings data not found");
          return;
        }
        console.log("Settings data:", settingsData);

        // Extract relevant fields from settingsData to prepopulate the form
        console.log("Divisions data:", settingsData.divisions);

        setLayouts(settingsData.layouts);
        setValue("layout", event.layout || settingsData.layouts[0]); // Set default or first layout

        // Update divisions with active status based on event divisions
        const updatedDivisions = settingsData.divisions.map(
          (division: Division) => ({
            ...division,
            active: event.divisions.some(
              (eventDivision: any) => eventDivision.name === division.name
            ),
          })
        );

        setDivisions(updatedDivisions);

        // Set the divisions field in the form with the updated divisions
        setValue("divisions", updatedDivisions);

        console.log("Form default values set successfully");
      })
      .catch((error) => {
        console.error("Error setting default values:", error);
      });
  }, [organization]); // Empty dependency array to run the effect only once when the component mounts

  function isLayoutModel(value: any): value is LayoutModel {
    return value && typeof value.name === "string";
  }

  function formatValue(value: any) {
    if (value instanceof Date) {
      return value.toLocaleString();
    } else if (isLayoutModel(value)) {
      return value.name;
    } else if (Array.isArray(value)) {
      return value.map((division) => division.name).join(", ");
    } else {
      return value;
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium text-center ">
              Create Event
            </legend>

            <Controller
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <FormDescription>Day of the event.</FormDescription>
                  <FormControl>
                    <DatePickerWithPresets
                      field={{
                        ...field,
                        value: field.value ? new Date(field.value) : undefined,
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormDescription>
                    The check in period will always end 15 minutes before the
                    event starts.
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      disabled={!form.watch("date")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormDescription>The location of the event.</FormDescription>
                  <FormControl>
                    <Input placeholder="Tranquility Trails" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormDescription>
                    The name of the event. Example: &apos;Tags Kickoff&apos;.
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Tags Kickoff" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxSignups"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Signups</FormLabel>
                  <FormDescription>
                    The maximum number of signups allowed for the event.
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="72"
                      min={1}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.setValue("maxSignups", Number(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checkInPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check In Period (minutes)</FormLabel>
                  <FormDescription>
                    The time period when you will allow check-ins. The check in
                    period will always end 15 minutes before the event starts.
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="30"
                      min={1}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.setValue("checkInPeriod", Number(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium text-center ">
              Misc Event Details
            </legend>
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Format</FormLabel>
                  <FormDescription>
                    The format of the event. Example: &apos;Doubles&apos;.
                  </FormDescription>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {formats.map((format) => (
                            <SelectItem
                              key={format.format_id}
                              value={format.name}
                            >
                              {format.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="divisions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Divisions</FormLabel>
                  <FormDescription>
                    Select the divisions you want to add for the event
                  </FormDescription>
                  <FormControl>
                    <Table className="relative">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Division Name</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {field.value
                          .filter(
                            (division: Division) =>
                              division.name.startsWith("M") ||
                              division.name.startsWith("F")
                          )
                          .sort((a, b) => {
                            // First sort by name prefix 'M' or 'F'
                            if (a.name[0] === "M" && b.name[0] === "F")
                              return -1;
                            if (a.name[0] === "F" && b.name[0] === "M")
                              return 1;
                            // If both start with the same letter, sort by division_id
                            return a.division_id - b.division_id;
                          })
                          .map((division: Division) => (
                            <TableRow key={division.division_id}>
                              <TableCell>{division.name}</TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant={
                                    division.active
                                      ? "destructive"
                                      : "secondary"
                                  }
                                  onClick={() => {
                                    const newValue = field.value.map(
                                      (div: Division) =>
                                        div.division_id === division.division_id
                                          ? { ...div, active: !div.active }
                                          : div
                                    );
                                    field.onChange(newValue);
                                  }}
                                >
                                  {division.active ? "Remove" : "Add"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="layout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Layout</FormLabel>
                  <FormDescription>
                    The layout of the course for the event.
                  </FormDescription>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(value) => {
                        // Assuming onChange from Select gives us an object we need
                        field.onChange(
                          layouts.find(
                            (layout) => layout.layout_id?.toString() === value
                          )
                        );
                      }}
                      value={field.value?.layout_id?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {layouts.map((layout) => (
                            <SelectItem
                              key={layout.layout_id}
                              value={layout.layout_id!.toString()} // or layout.layout_id if using IDs
                            >
                              {layout.name} (Par {layout.par})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors.layout?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="udiscLeagueURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UDisc Event URL</FormLabel>
                  <FormDescription>
                    The URL of the event on UDisc. On Desktop, click the
                    &apos;scores&apos; tab on the event page and then copy the
                    URL. On Mobile, click &apos;View Leaderboard&apos; & then
                    click &apos;Share&apos; to copy the URL.
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Enter UDisc Event URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => setPreviewOpen(true)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <Label>Please wait</Label>
              </>
            ) : (
              "Preview Changes"
            )}
          </Button>
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogContent className="max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Preview Changes</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-2">
                {differences.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-2 items-center justify-start"
                  >
                    <Label
                      className="text-sm"
                      style={{ textDecoration: "line-through" }}
                    >
                      {formatValue(item.previousValue)}
                    </Label>
                    &nbsp;→&nbsp;
                    <Label className="text-sm">
                      {formatValue(item.newValue)}
                    </Label>
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-blue-500"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Submit Edits
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
      <div className="fixed top-[190px] right-[50px] z-50">
        <Card className="h-max w-full min-w-[600px] bg-muted/20 hidden md:block">
          <CardHeader className="p-4">
            <CardTitle>Preview Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {differences.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row gap-2 items-center justify-start"
                >
                  <Label
                    className="text-sm"
                    style={{ textDecoration: "line-through" }}
                  >
                    {formatValue(item.previousValue)}
                  </Label>
                  &nbsp;→&nbsp;
                  <Label className="text-sm">
                    {formatValue(item.newValue)}
                  </Label>
                </div>
              ))}
              <EventPreviewComponent data={form.getValues()} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
