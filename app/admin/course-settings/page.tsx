"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NextPage } from "next";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { CourseSettingsData } from "@/app/types";
import { TAGS_API_BASE_URL } from "@/app/networking/apiExports";
import { KindeOrganization } from "@kinde-oss/kinde-auth-nextjs/types";

const fetchCourseSettings = async (orgCode: KindeOrganization) => {
  console.log("Fetching course settings for orgCode:", orgCode);
  const response = await fetch(
    `${TAGS_API_BASE_URL}/api/fetch-course-settings/${orgCode}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch course settings");
  }
  return await response.json();
};

const courseSchema = z.object({
  courseName: z.string().min(1, "Course name is required."),
  layouts: z
    .array(
      z.object({
        name: z.string(),
      })
    )
    .nonempty("At least one layout is required."),
  holes: z.array(
    z.object({
      hole_id: z.number(),
      hole_number: z.number(),
      active: z.boolean(),
    })
  ),
  //   venmoUsername: z.string().optional(),
  //   cashappUsername: z.string().optional(),
  divisions: z.array(
    z.object({
      division_id: z.number(),
      name: z.string(),
      active: z.boolean(),
    })
  ),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const AdminTools: NextPage = () => {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseName: "",
      layouts: [{ name: "" }],
      holes: Array.from({ length: 18 }, (_, index) => ({
        hole_id: index + 1,
        hole_number: index + 1,
        active: true,
      })),
      divisions: [
        { division_id: 1, name: "MPO", active: true },
        { division_id: 2, name: "FPO", active: false },
        { division_id: 3, name: "MA1", active: true },
        { division_id: 4, name: "FA1", active: false },
        { division_id: 5, name: "MA2", active: true },
        { division_id: 6, name: "FA2", active: false },
        { division_id: 7, name: "MA3", active: false },
        { division_id: 8, name: "FA3", active: false },
        { division_id: 9, name: "MA4", active: false },
        { division_id: 10, name: "FA4", active: false },
      ],
      //   venmoUsername: "",
      //   cashappUsername: "",
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    register,
    reset,
    getValues,
    formState,
  } = form;

  const { isLoading, isAuthenticated, user, organization } =
    useKindeBrowserClient();

  console.log("Org Code:", organization);

  const router = useRouter();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "layouts",
  });

  watch("courseName");
  watch("layouts");
  watch("holes");
  watch("divisions");
  //   watch("venmoUsername");
  //   watch("cashappUsername");
  console.log(getValues());

  console.log("Form State:", formState);
  console.log("Form Errors:", formState.errors);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
      return;
    }

    if (organization) {
      fetchCourseSettings(organization)
        .then((data) => {
          reset(data); // Assuming the fetched data matches the form's structure
          console.log("Fetched course settings:", data);
        })
        .catch((error) => {
          console.error("Failed to load settings:", error);
          toast({
            title: "Error",
            description: "Failed to load course settings",
          });
        });
    }
  }, [isLoading, user, organization, router, reset]);

  const onSubmit = async (data: CourseSettingsData) => {
    console.log("Form Data:", data);

    if (!isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You must be logged in to save settings.",
      });
      return;
    }

    if (!organization) {
      console.log("Organization:", organization);
      toast({
        title: "Unauthorized",
        description:
          "You must be logged in to an organization to perform this action.",
      });
      return;
    }

    // Inject orgCode into formData before submission
    const dataToSend = {
      ...data,
      orgCode: organization,
    };

    try {
      const response = await fetch(
        `${TAGS_API_BASE_URL}/api/save-course-settings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend), // Assuming your backend expects JSON data
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const result = await response.json();
      console.log("Course settings saved successfully:", result);
      toast({
        title: "Success",
        description: "Course settings saved successfully",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to submit the form",
      });
    }
  };

  if (isLoading && !user) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 text-left items-start justify-start gap-4 p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Course Name */}
          <FormField
            control={form.control}
            name="courseName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Course Name" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Dynamic Layouts */}
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`layouts.${index}.name`}
              render={({ field }) => (
                <div className="flex flex-row gap-1 items-end w-full">
                  <FormItem>
                    <FormLabel>Layout {index + 1}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={`Layout ${index + 1}`} />
                    </FormControl>
                  </FormItem>
                  <Button type="button" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </div>
              )}
            />
          ))}
          <Button type="button" onClick={() => append({ name: "" })}>
            + Add Layout
          </Button>

          {/* Starting Holes */}
          <div className="flex flex-col gap-2 justify-start items-start">
            <h1>Preferred Starting Holes</h1>
            <p className="text-sm text-gray-500">
              Note: Each event may override this setting.
            </p>
            <div className="flex flex-row gap-2 justify-start items-start">
              {form.watch("holes").map((hole, index) => (
                <FormField
                  key={hole.hole_id}
                  control={form.control}
                  name={`holes.${index}.active`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{`Hole ${hole.hole_number}`}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Venmo and CashApp Usernames */}
          {/* <FormField
            control={form.control}
            name="venmoUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venmo Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Venmo Username" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cashappUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CashApp Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="CashApp Username" />
                </FormControl>
              </FormItem>
            )}
          /> */}

          {/* Divisions */}
          <div className="flex flex-col gap-2 justify-start items-start">
            <h1>Divisions for Tags</h1>
            <div className="flex flex-row gap-2 justify-start items-start">
              {form.watch("divisions").map((division, index) => (
                <FormField
                  key={division.division_id}
                  control={form.control}
                  name={`divisions.${index}.active`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{division.name}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <Button type="submit">Save Settings</Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminTools;
