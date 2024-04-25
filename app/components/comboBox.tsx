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
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Course } from "../layout";

interface ComboBoxProps {
  currentCourse: Course;
  allCourses: Course[];
}

export function ComboBox(props: ComboBoxProps) {
  const { currentCourse, allCourses } = props;
  const [open, setOpen] = React.useState(false);
  const [orgCode, setOrgCode] = React.useState("");
  const [courseName, setCourseName] = React.useState(currentCourse.courseName);

  // console.log("Current course:", currentCourse);
  // console.log("All courses:", allCourses);

  React.useEffect(() => {
    if (currentCourse.orgCode) {
      setOrgCode(currentCourse.orgCode);
    }
  }, [currentCourse]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {courseName}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search course..." />
          <CommandEmpty>No course found.</CommandEmpty>
          <CommandGroup>
            {allCourses.map((course) => (
              <LoginLink key={course.orgCode} orgCode={course.orgCode}>
                <CommandItem
                  value={course.orgCode}
                  onSelect={(currentOrgCode) => {
                    setOrgCode(
                      currentOrgCode === orgCode ? "" : currentOrgCode
                    );
                    setCourseName(course.courseName);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      orgCode === course.orgCode ? "opacity-500" : "opacity-0"
                    )}
                  />
                  {course.courseName}
                </CommandItem>
              </LoginLink>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
