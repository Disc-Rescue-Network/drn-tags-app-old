"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useUserCourses } from "../hooks/useUserCourses";
import { Course } from "../types/Course";
import { Skeleton } from "@/components/ui/skeleton";

export function ComboBox() {
  const {
    course,
    setCourse,
    courses,
    isSwitchingOrgs,
    setIsSwitchingOrgs,
    belongsToOrg,
    errorMessage,
    showErrorMessage,
    loading,
  } = useUserCourses();
  const [open, setOpen] = React.useState(false);

  console.log("Current course:", course);
  console.log("All courses:", courses);

  return (
    <>
      {loading ? (
        <Skeleton className="w-[200px] h-[30px] rounded" />
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {course ? course.courseName : "Select course..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search course..." />
              <CommandList>
                <CommandEmpty>No course found.</CommandEmpty>
                <CommandGroup>
                  {courses.map((courseLocal) => (
                    <CommandItem
                      key={courseLocal.orgCode}
                      value={courseLocal.courseName}
                      onSelect={(selectedCourse) => {
                        setCourse(courseLocal);
                        setIsSwitchingOrgs(true);
                        setOpen(false);
                      }}
                    >
                      <LoginLink
                        orgCode={courseLocal.orgCode}
                        className="flex flex-row items-center gap-2"
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            course.courseName === courseLocal.courseName
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {courseLocal.courseName}
                      </LoginLink>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
