import Link from "next/link";
import {
  ArrowUpRight,
  Bird,
  Map,
  MapPin,
  Rabbit,
  Turtle,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { addMinutes, format, formatISO, set } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
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
import { EventPreview } from "@/app/types";

interface EventPreviewProps {
  data: EventPreview;
}

const layouts = [
  "Short Tees",
  "Long Tees",
  "Short 4s, Long 3s",
  "Long 4s, Short 3s",
  "Mullet",
]; // Array of layout options

// Define the form schema using Zod
const eventSchema = z.object({
  date: z.coerce.date(),
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
  uDiscEventURL: z.string().refine((url) => isValidUDiscURL(url), {
    message: "Invalid uDisc URL. Must end with '?tab=scores'.",
  }),
  maxSignups: z.number().min(1),
  layout: z.string().min(1),
  checkInPeriod: z.number().min(1),
});

const EventPreviewComponent = (props: EventPreviewProps) => {
  const event = props.data;
  const checkInEndTime = addMinutes(new Date(event.date), -15);
  const formattedCheckInEndTime = format(checkInEndTime, "MMM d, yyyy h:mm aa");

  return (
    <Card className="text-left w-full">
      <CardHeader className="p-4">
        <CardDescription
          className="text-balance leading-relaxed grid grid-cols-2 w-full"
          style={{ gridTemplateColumns: "60% 40%" }}
        >
          <div className="text-left text-xs">
            {event.date && event.time ? (
              <>
                {format(
                  set(new Date(event.date), {
                    hours: Number(event.time.split(":")[0]),
                    minutes: Number(event.time.split(":")[1]),
                  }),
                  window.innerWidth <= 768 ? "EEE, MMM d" : "EEEE, MMMM do"
                )}{" "}
                @{" "}
                {format(
                  set(new Date(event.date), {
                    hours: Number(event.time.split(":")[0]),
                    minutes: Number(event.time.split(":")[1]),
                  }),
                  "h:mm a"
                )}
              </>
            ) : (
              <span>&nbsp;</span>
            )}
          </div>
          <div className="flex flex-row gap-1 items-center justify-end text-xs text-right">
            <MapPin className="h-4 w-4" /> {event.location}
          </div>
        </CardDescription>

        <CardTitle>{event.eventName}</CardTitle>
      </CardHeader>
      <CardFooter className="flex flex-row gap-4 w-full justify-between items-end md:flex-row lg:flex-row p-4">
        <div className="flex flex-col gap-4 justify-start items-start p-0 m-0 md:flex-col lg:flex-col w-[60%]">
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

export default function EventForm() {
  // Define your form
  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      date: new Date(),
      time: "",
      location: "Tranquility Trails",
      format: "Singles",
      leagueName: "",
      eventName: "Tags Event",
      uDiscEventURL: "",
      maxSignups: 72,
      layout: "Short Tees",
      checkInPeriod: 30,
    },
  });

  function onSubmit(data: z.infer<typeof eventSchema>) {
    console.log(data);

    // Validate uDisc URL
    if (!isValidUDiscURL(data.uDiscEventURL)) {
      // Display error toast if URL is invalid
      toast({
        variant: "destructive",
        title: "Invalid uDisc URL",
        description:
          'The uDisc URL must be a valid URL and end with "?tab=scores".',
      });
      return; // Exit early if URL is invalid
    }

    // Make POST request to API endpoint
    fetch(`${TAGS_API_BASE_URL}/api/create-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful response from API
        console.log("Event created successfully:", data);
        toast({
          variant: "default",
          title: "Event created successfully",
          description: "Your event has been successfully created.",
        });
      })
      .catch((error) => {
        // Handle errors
        console.error("Error creating event:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create event. Please try again later.",
        });
      });
  }

  console.log(form.getValues());
  const layout = form.watch("layout");
  const checkInPeriod = form.watch("checkInPeriod");
  const maxSignups = form.watch("maxSignups");
  const date = form.watch("date");
  const time = form.watch("time");
  const location = form.watch("location");
  const format = form.watch("format");
  const eventName = form.watch("eventName");
  const uDiscEventURL = form.watch("uDiscEventURL");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium text-center ">
              Create Event
            </legend>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <FormDescription>Day of the event.</FormDescription>
                  <FormControl>
                    <DatePickerWithPresets field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
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
                      placeholder="Select time"
                      {...field}
                      disabled={!form.getValues("date")}
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
                    <Input placeholder="Singles" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="layout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Layout</FormLabel>
                  <FormDescription>
                    The layout for the event. You can configure this in
                    &apos;Course Settings&apos;.
                  </FormDescription>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {layouts.map((layout) => (
                            <SelectItem key={layout} value={layout}>
                              {layout}
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
              name="uDiscEventURL"
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <Card className="h-max bg-muted/20">
        <CardHeader className="p-4">
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <EventPreviewComponent data={form.getValues()} />
        </CardContent>
      </Card>
    </div>
  );
}
