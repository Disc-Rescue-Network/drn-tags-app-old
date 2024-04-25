import Link from "next/link";
import { ArrowUpRight, Bird, Rabbit, Turtle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatISO } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePickerWithPresets } from "@/app/components/DatePickerWithPresets";
import { API_BASE_URL, TAGS_API_BASE_URL } from "@/app/networking/apiExports";

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
});

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

  return (
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
                <FormControl>
                  <Input type="time" placeholder="Select time" {...field} />
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
                <FormControl>
                  <Input placeholder="Tranquility Trails" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Format</FormLabel>
                <FormControl>
                  <Input placeholder="Singles" {...field} />
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
                <FormControl>
                  <Input placeholder="Tags Kickoff" {...field} />
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
                <FormControl>
                  <Input type="number" placeholder="72" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
