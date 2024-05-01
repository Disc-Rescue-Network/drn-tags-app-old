"use client";

import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { TagsEvent } from "../types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { min, subMinutes } from "date-fns";

// Assuming event.start is a Date object representing the event start time
// and event.checkInPeriod is a number representing the check-in period duration in minutes

interface CheckInButtonProps {
  event: TagsEvent;
  checkIn: () => void;
  isMobile: boolean;
  isLoading: boolean;
}
const convertToHighestCommonFactor = (timeValue: string) => {
  const [value, unit] = timeValue.split(" ");

  if (unit === "sec") {
    return `${value} sec`;
  }

  if (unit === "min") {
    const totalMinutes = Number(value);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;

      let result = `${days} day`;
      if (remainingHours > 0) {
        result += ` ${remainingHours} hr`;
      }
      result += ` ${minutes} min`;

      return result;
    }

    let result = "";
    if (hours > 0) {
      result += `${hours} hr`;
    }
    result += ` ${minutes} min`;

    return result.trim();
  }

  // console.log("timeValue", timeValue);
  return timeValue;
};

export default function CheckInButton(props: CheckInButtonProps) {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const { event, checkIn, isMobile, isLoading } = props;
  const [timeUntilCheckIn, setTimeUntilCheckIn] = useState("");

  let timeValue =
    timeUntilCheckIn.split(" ")[4] +
    " " +
    timeUntilCheckIn.split(" ")[5] +
    " " +
    timeUntilCheckIn.split(" ")[6] +
    " " +
    timeUntilCheckIn.split(" ")[7];

  if (timeValue.includes("undefined")) {
    timeValue =
      timeUntilCheckIn.split(" ")[4] + " " + timeUntilCheckIn.split(" ")[5];
  }
  // console.log("timeValue", timeValue);
  const abbreviatedTimeValue = timeValue
    .replace("minutes", "min")
    .replace("hours", "hrs");
  // console.log("abbreviatedTimeValue", abbreviatedTimeValue);
  const finalTimeValue = convertToHighestCommonFactor(abbreviatedTimeValue);

  useEffect(() => {
    const checkInEndtime = subMinutes(new Date(event.dateTime), 15).getTime();
    // console.log("checkInEndtime", new Date(checkInEndtime));
    const checkInStartTime = checkInEndtime - event.checkInPeriod * 60 * 1000;
    // console.log("checkInStartTime", new Date(checkInStartTime));
    const eventDateTime = new Date(event.dateTime).getTime();

    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const nowMinus15 = subMinutes(new Date(), 15).getTime();
      const timeLeft = Math.max(0, checkInStartTime - now);
      // console.log("timeLeft", timeLeft);
      const minutesLeft = Math.floor(timeLeft / 1000 / 60);
      // console.log("minutesLeft", minutesLeft);
      const secondsLeft = Math.floor(timeLeft / 1000);
      // console.log("secondsLeft", secondsLeft);

      const finalTimeValue = convertToHighestCommonFactor(`${minutesLeft} min`);
      let timeUntilCheckIn = `Check in opens in ${finalTimeValue}`;
      // console.log("timeUntilCheckIn", timeUntilCheckIn);

      if (minutesLeft < 1) {
        timeUntilCheckIn = `Check in opens in ${secondsLeft} seconds`;
      }

      // console.log("timeUntilCheckIn", timeUntilCheckIn);

      // console.log("check in open?", now >= checkInStartTime);
      // console.log("before start time?", now < eventDateTime);
      // console.log("now", new Date(now));
      // console.log("event start time", new Date(eventDateTime));

      setIsCheckInOpen(now >= checkInStartTime && now < eventDateTime);
      setTimeUntilCheckIn(timeUntilCheckIn);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [event]);

  if (isLoading || !timeUntilCheckIn) return null;

  return isCheckInOpen ? (
    <Button className="text-xs" onClick={checkIn}>
      Check In
    </Button>
  ) : isMobile ? (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <Label className="text-xs">{finalTimeValue}</Label>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Label className="text-xs">{timeUntilCheckIn}</Label>
      </PopoverContent>
    </Popover>
  ) : (
    <div className="flex items-center space-x-2">
      <Clock className="h-5 w-5 text-gray-500" />
      <Label className="text-xs">{timeUntilCheckIn}</Label>
    </div>
  );
}
