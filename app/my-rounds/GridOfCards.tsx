import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { useState } from "react";
import { LayoutModel, PlayerRound } from "../types";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

interface CardCarouselProps {
  lowestLeague: string | null;
  lowestTag: number | null;
  bestRound: {
    score: number;
    date: Date;
    location: string;
    layout: LayoutModel;
    relativeScoreText: string;
    color: string;
  } | null;
  bestFinish: PlayerRound | null;
  lowestCurrentLeague: string | null;
  lowestCurrentTag: number | null;
  loading: boolean;
}

const getOrdinalSuffix = (num: number): string => {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;

  // Handle special cases for numbers ending in 11-13
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${num}th`;
  }

  // Assign the correct suffix based on the last digit
  switch (lastDigit) {
    case 1:
      return `${num}st`;
    case 2:
      return `${num}nd`;
    case 3:
      return `${num}rd`;
    default:
      return `${num}th`;
  }
};

export default function GridOfCards(props: CardCarouselProps) {
  const {
    lowestLeague,
    lowestTag,
    bestRound,
    bestFinish,
    lowestCurrentLeague,
    lowestCurrentTag,
    loading,
  } = props;
  const [currentCard, setCurrentCard] = useState(0);
  const cards = [
    {
      title: "Lowest Tag (Season Long)",
      content: lowestLeague ? lowestLeague : "-",
      value: lowestTag ? lowestTag : "-",
      style: "text-4xl relative",
    },
    {
      title: "Best Round",
      content: bestRound?.location
        ? `${bestRound.location} - ${bestRound.layout.name} (${format(
            bestRound.date,
            "MM/dd/yyyy"
          )})`
        : "Loading...",
      value: `${bestRound?.score} (${bestRound?.relativeScoreText})`,
      style: `text-4xl relative ${bestRound?.color}`,
    },
    {
      title: "Best Finish",
      content: bestFinish?.EventModel.leagueName,
      value: getOrdinalSuffix(bestFinish?.place ?? 0),
      style: "text-4xl relative",
    },
    {
      title: "Best Current Tag",
      content: lowestCurrentLeague,
      value: lowestCurrentTag ? lowestCurrentTag : "-",
      style: "text-4xl relative",
    },
  ];
  return (
    <div className="flex flex-col w-full gap-4 justify-evenly items-center lg:flex-row">
      {!loading ? (
        <div className="flex flex-col w-full gap-4 justify-evenly items-center lg:flex-row">
          {lowestLeague != null && (
            <Card className="flex flex-col h-fit min-h-[170px] min-w-[300px] items-center justify-center">
              <CardHeader className="pb-2">
                <CardDescription>Lowest Tag (Season Long)</CardDescription>
                <CardTitle className="text-4xl relative">
                  {lowestTag ? lowestTag : "-"}
                  {/* {tagMovement! < 0 ? (
                    <div className="absolute right-8 bottom-5 flex flex-row gap-1 justify-center items-center">
                      <ChevronUp className="w-4 h-4 text-green-600" />
                      <Label className="text-xxs">{tagMovement}</Label>
                    </div>
                  ) : (
                    <div className="absolute right-8 bottom-5 flex flex-row gap-1 justify-center items-center">
                      <ChevronDown className="w-4 h-4 text-red-600" />
                      <Label className="text-xxs">
                        {Math.abs(tagMovement)}
                      </Label>
                    </div>
                  )} */}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* <div className="text-xs text-muted-foreground">
                  {tagMovement! >= 0 ? "+" : ""}
                  {tagMovement} from last round
                </div> */}
                <div className="text-xs text-muted-foreground">
                  {lowestLeague ? lowestLeague : "-"}
                </div>
              </CardContent>
            </Card>
          )}

          {bestRound != null && (
            <Card className="flex flex-col h-fit min-h-[170px] min-w-[300px] items-center justify-center">
              <CardHeader className="pb-2">
                <CardDescription>Best Round</CardDescription>
                <CardTitle className={`text-4xl relative ${bestRound.color}`}>
                  {bestRound.score} ({bestRound.relativeScoreText})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* <div className="text-xs text-muted-foreground">
                  {tagMovement! >= 0 ? "+" : ""}
                  {tagMovement} from last round
                </div> */}
                <div className="text-xs text-muted-foreground">
                  {bestRound?.location} - {bestRound?.layout.name} (
                  {bestRound && bestRound.date
                    ? format(bestRound.date, "MM/dd/yyyy")
                    : "Loading..."}
                </div>
              </CardContent>
            </Card>
          )}
          {bestFinish != null && (
            <Card className="flex flex-col h-fit min-h-[170px] min-w-[300px] items-center justify-center">
              <CardHeader className="pb-2">
                <CardDescription>Best Finish</CardDescription>
                <CardTitle className="text-4xl relative">
                  {getOrdinalSuffix(bestFinish.place)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {bestFinish.EventModel.leagueName}
                </div>
              </CardContent>
            </Card>
          )}
          {lowestCurrentLeague != null && (
            <Card className="flex flex-col h-fit min-h-[170px] min-w-[300px] items-center justify-center">
              <CardHeader className="pb-2">
                <CardDescription>Best Current Tag</CardDescription>
                <CardTitle className="text-4xl relative">
                  {lowestCurrentTag ? lowestCurrentTag : "-"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {lowestCurrentLeague}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="flex flex-col w-full gap-4 lg:flex-row">
          <Skeleton className="w-full h-48" />
          <Skeleton className="w-full h-48" />
          <Skeleton className="w-full h-48" />
          <Skeleton className="w-full h-48" />
        </div>
      )}
    </div>
  );
}
