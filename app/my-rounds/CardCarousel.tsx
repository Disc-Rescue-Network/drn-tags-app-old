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
import { ChevronLeft, ChevronRight } from "lucide-react";

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

export default function CardCarousel(props: CardCarouselProps) {
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

  const nextCard = () => {
    setCurrentCard((prevCard) => (prevCard + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentCard((prevCard) =>
      prevCard === 0 ? cards.length - 1 : prevCard - 1
    );
  };

  return (
    <div className="flex flex-col relative w-80">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${currentCard * 100}%)` }}
        >
          {cards.map((card, index) => (
            <div key={index} className="min-w-full flex-shrink-0">
              <Card className="flex flex-col h-fit min-h-[170px] max-w-[315px] items-center justify-center">
                <CardHeader className="pb-2">
                  <CardDescription>{card.title}</CardDescription>
                  <CardTitle className={card.style}>{card.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {card.content}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <Button
        onClick={prevCard}
        variant="ghost"
        className="absolute top-1/2 left-2 transform -translate-y-1/2 m-0 p-2"
      >
        <ChevronLeft className="w-4 h-4 m-0 p-0" />
      </Button>
      <Button
        onClick={nextCard}
        variant="ghost"
        className="absolute top-1/2 right-3 transform -translate-y-1/2 m-0 p-2"
      >
        <ChevronRight className="w-4 h-4 m-0 p-0" />
      </Button>
    </div>
  );
}
