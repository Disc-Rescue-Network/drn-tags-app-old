"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DatePickerWithPresetsProps {
  field: {
    value: Date | undefined;
    onChange: (value: Date | undefined) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<HTMLInputElement>;
  };
}

export function DatePickerWithPresets({ field }: DatePickerWithPresetsProps) {
  const [date, setDate] = React.useState<Date>();

  React.useEffect(() => {
    setDate(field.value); // Sync internal state with external field value
  }, [field.value]);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    field.onChange(newDate); // Important: propagate changes up to the form!
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "max-w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={(value) =>
            handleDateChange(addDays(new Date(), parseInt(value)))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={handleDateChange} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
