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

const courseSchema = z.object({
  courseName: z.string().min(1, "Course name is required."),
  layouts: z
    .array(
      z.object({
        name: z.string(),
      })
    )
    .nonempty("At least one layout is required."),
  holes: z.array(z.boolean()),
  venmoUsername: z.string().optional(),
  cashappUsername: z.string().optional(),
  divisions: z.array(z.boolean()),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const AdminTools: NextPage = () => {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseName: "",
      layouts: [{ name: "" }],
      holes: Array(18).fill(false),
      divisions: Array(10).fill(false),
      venmoUsername: "",
      cashappUsername: "",
    },
  });

  const { control, handleSubmit, watch, register, getValues } = form;

  const { isLoading, isAuthenticated, user } = useKindeBrowserClient();

  const router = useRouter();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "layouts",
  });

  watch("courseName");
  watch("layouts");
  watch("holes");
  watch("divisions");
  watch("venmoUsername");
  watch("cashappUsername");
  console.log(getValues());

  useEffect(() => {
    if (isLoading) return;
    if (!user || !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading && !user) return <div>Loading...</div>;

  const onSubmit = (data: CourseFormValues) => {
    console.log(data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="courseName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Course Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`layouts.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Layout {index + 1}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={`Layout ${index + 1}`} />
                  </FormControl>
                  <Button onClick={() => remove(index)}>Remove</Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="button" onClick={() => append({ name: "" })}>
            Add More Layouts
          </Button>
          {/* Additional fields go here */}
          <Button type="submit">Save Settings</Button>
        </form>
      </Form>
      {/* <Form {...{ control }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("courseName")} placeholder="Course Name" />
          {errors.courseName && <p>{errors.courseName.message}</p>}

          {fields.map((field, index) => (
            <div key={field.id}>
              <Input
                {...register(`layouts.${index}` as const)}
                placeholder={`Layout ${index + 1}`}
              />
              <Button onClick={() => remove(index)}>Remove</Button>
            </div>
          ))}
          <Button onClick={() => append({ name: "" })}>Add More Layouts</Button>

          <div>
            {Array.from({ length: 18 }, (_, i) => (
              <>
                <Checkbox
                  key={i}
                  id="holesToAvoid"
                  {...register(`holes.${i}` as const)}
                />
                <label
                  htmlFor="holesToAvoid"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {`Hole ${i + 1}`}
                </label>
              </>
            ))}
          </div>

          <Input {...register("venmoUsername")} placeholder="Venmo Username" />
          <Input
            {...register("cashappUsername")}
            placeholder="Cashapp Username"
          />

          <div>
            {[
              "MPO",
              "FPO",
              "MA1",
              "FA1",
              "MA2",
              "FA2",
              "MA3",
              "FA3",
              "MA4",
              "FA4",
            ].map((div, index) => (
              <>
                <Checkbox
                  key={div}
                  id="divisions"
                  {...register(`divisions.${index}` as const)}
                />
                <label
                  htmlFor="divisions"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {div}
                </label>
              </>
            ))}
          </div>

          <Button type="submit">Save Settings</Button>
        </form>
      </Form> */}
    </div>
  );
};

export default AdminTools;
