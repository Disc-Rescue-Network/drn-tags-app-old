"use client";

import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { TAGS_API_BASE_URL } from "../networking/apiExports";
import { LayoutModel, PlayerRound } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { Line } from "react-chartjs-2";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DataTable } from "./DataTable-myrounds";
import { columns } from "./columns-myrounds";
import { format, set } from "date-fns";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Register the necessary chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home: NextPage = () => {
  const { isLoading, isAuthenticated, user } = useKindeBrowserClient();
  // console.log("User:", user);

  const [loading, setLoading] = useState<boolean>(true);

  const [allChartData, setAllChartData] = useState<any>({});
  const [last5ChartData, setLast5ChartData] = useState<any>({});
  const [last10ChartData, setLast10ChartData] = useState<any>({});
  const [last20ChartData, setLast20ChartData] = useState<any>({});

  const [chartOptions, setChartOptions] = useState<any>({});

  const [playerRounds, setPlayerRounds] = useState<PlayerRound[]>([]);
  const [lowestTag, setLowestTag] = useState<number | null>(null);
  const [lowestLeague, setLowestLeague] = useState<string | null>(null);
  const [lowestCurrentTag, setLowestCurrentTag] = useState<number | null>(null);
  const [lowestCurrentLeague, setLowestCurrentLeague] = useState<string | null>(
    null
  );
  const [tagMovement, setTagMovement] = useState<number | null>(null);
  const [bestFinish, setBestFinish] = useState<PlayerRound | null>(null);
  const [tagPerLeague, setTagPerLeague] = useState<Map<string, Set<number>>>(
    new Map()
  );
  const [bestRound, setBestRound] = useState<{
    score: number;
    date: Date;
    location: string;
    layout: LayoutModel;
    relativeScoreText: string;
    color: string;
  } | null>(null);

  useEffect(() => {
    const fetchPlayerRounds = async (kindeId: string) => {
      setLoading(true);
      // console.log("Fetching player rounds for user:", kindeId);
      try {
        const response = await fetch(
          `${TAGS_API_BASE_URL}/api/fetch-player-rounds/${kindeId}`
        );
        const data: PlayerRound[] = await response.json();
        // console.log(data);
        setPlayerRounds(data);

        // Prepare chart data for each filter
        setAllChartData(prepareChartData(data));
        setLast5ChartData(prepareChartData(data.slice(-5)));
        setLast10ChartData(prepareChartData(data.slice(-10)));
        setLast20ChartData(prepareChartData(data.slice(-20)));

        //TESTING ONLY
        // let TESTDATAONLY = data.concat(data, data, data, data);
        // // console.log(TESTDATAONLY);
        // setPlayerRounds(TESTDATAONLY);
        // setAllChartData(prepareChartData(TESTDATAONLY));
        // setLast5ChartData(prepareChartData(TESTDATAONLY.slice(-5)));
        // setLast10ChartData(prepareChartData(TESTDATAONLY.slice(-10)));
        // setLast20ChartData(prepareChartData(TESTDATAONLY.slice(-20)));

        const lowTag = findLowestTagLeague(data).lowestTag;
        const lowestLeague = findLowestTagLeague(data).lowestLeague;
        setLowestTag(lowTag);
        setLowestLeague(lowestLeague);

        const lowCurrentTag = findLowestTagOutFromLastRounds(data)?.tagOut;
        const lowCurrentLeague =
          findLowestTagOutFromLastRounds(data)?.leagueName;
        setLowestCurrentTag(lowCurrentTag || null);
        setLowestCurrentLeague(lowCurrentLeague || null);

        setTagMovement(getTagMovementForMostRecentRound(data));
        setBestFinish(getBestFinish(data));
        setTagPerLeague(mapTagsToLeagues(data));
        setBestRound(findBestScoreRound(data));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch player rounds:", error);
        toast({
          title: "Failed to fetch player rounds",
          description: "Please try again later",
          variant: "destructive",
          duration: 3000,
        });
      }
    };

    fetchPlayerRounds(user?.id!);
  }, [user]);

  const getTagMovementForMostRecentRound = (
    rounds: PlayerRound[]
  ): number | null => {
    if (rounds.length === 0) {
      // console.log("No rounds found");
      return null; // Return null if there are no rounds to evaluate
    }

    // Sort rounds by the `updatedAt` field in descending order
    const sortedRounds = rounds.sort(
      (a, b) =>
        new Date(b.EventModel.dateTime).getTime() -
        new Date(a.EventModel.dateTime).getTime()
    );

    // console.log("Sorted rounds:", sortedRounds);

    // Get the most recent round
    const mostRecentRound = sortedRounds[0];

    // console.log("Most recent round:", mostRecentRound);

    // Calculate the movement from tagIn to tagOut
    if (mostRecentRound.tagIn === null) {
      // console.log("No tagIn value found");
      return null; // If tagIn is null, it means there's no previous tag to compare
    }

    // console.log(
    //   "Tag movement:",
    //   mostRecentRound.tagOut - mostRecentRound.tagIn
    // );
    return mostRecentRound.tagOut - mostRecentRound.tagIn;
  };
  const getBestFinish = (rounds: PlayerRound[]): PlayerRound | null => {
    // Filter out rounds where place is 0 or null
    const validRounds = rounds.filter((round) => round.place > 0);

    if (validRounds.length === 0) {
      return null; // Return null if there are no valid rounds to evaluate
    }

    // Use reduce to find the round with the lowest place value
    const bestFinish = validRounds.reduce((best, current) => {
      return current.place < best.place ? current : best;
    });

    return bestFinish;
  };

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

  // Function to map tags to leagues
  const mapTagsToLeagues = (
    rounds: PlayerRound[]
  ): Map<string, Set<number>> => {
    const leagues = new Map<string, Set<number>>();

    rounds.forEach((round) => {
      const leagueName = round.EventModel.leagueName!;
      const currentTag = round.tagOut;

      if (!leagues.has(leagueName)) {
        leagues.set(leagueName, new Set());
      }
      leagues.get(leagueName)?.add(currentTag);
    });

    return leagues;
  };

  // Function to find the league with the lowest tag for a specific player
  const findLowestTagLeague = (
    rounds: PlayerRound[]
  ): { lowestLeague: string | null; lowestTag: number | null } => {
    const leagueTags: Map<string, number> = new Map(); // Maps league name to the lowest tag number found in that league

    // Filter out rounds where tagOut is 0 or null
    const validRounds = rounds.filter((round) => round.tagOut > 0);

    validRounds.forEach((round) => {
      const leagueName = round.EventModel.leagueName!;
      const currentTag = round.tagOut;
      const existingTag = leagueTags.get(leagueName);

      if (!existingTag || currentTag < existingTag) {
        leagueTags.set(leagueName, currentTag);
      }
    });

    if (leagueTags.size === 0) {
      return { lowestLeague: null, lowestTag: null };
    }

    // Find the league name associated with the lowest tag
    let lowestLeague = null;
    let lowestTag = Infinity;
    for (const [leagueName, tagNumber] of leagueTags) {
      if (tagNumber < lowestTag) {
        lowestTag = tagNumber;
        lowestLeague = leagueName;
      }
    }

    return { lowestLeague, lowestTag };
  };
  const prepareChartData = (rounds: PlayerRound[]) => {
    const labels = rounds.map((round) =>
      new Date(round.EventModel.dateTime).toLocaleDateString()
    );
    const data = rounds.map((round) => round.place);

    // setAllChartData({
    //   labels,
    //   datasets: [
    //     {
    //       label: "Place Over Time",
    //       data,
    //       fill: false,
    //       borderColor: "rgb(75, 192, 192)",
    //       tension: 0.1,
    //     },
    //   ],
    // });

    setChartOptions({
      scales: {
        y: {
          reverse: true,
          title: {
            display: true,
            text: "Place",
          },
        },
      },
    });

    return {
      labels,
      datasets: [
        {
          label: "Place Over Time",
          data,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  };

  const hasChartData = (data: any): boolean => {
    return (
      data.datasets &&
      data.datasets.length > 0 &&
      data.datasets[0].data.length > 0
    );
  };

  // console.log("AllChartData:", allChartData);
  // console.log("Last5ChartData:", last5ChartData);
  // console.log("Last10ChartData:", last10ChartData);
  // console.log("Last20ChartData:", last20ChartData);

  // Function to find the round with the lowest (best) score
  const findBestScoreRound = (
    rounds: PlayerRound[]
  ): {
    score: number;
    date: Date;
    location: string;
    layout: LayoutModel;
    relativeScoreText: string;
    color: string;
  } | null => {
    // console.log("Rounds:", rounds);
    if (rounds.length === 0) {
      // console.log("No rounds found, can't find best score");
      return null; // No rounds available
    }

    // Find the round with the lowest score
    const bestRound = rounds.reduce((best, current) =>
      current.score < best.score ? current : best
    );

    const par = bestRound?.EventModel?.layout?.par ?? 0;
    const relativeScore = bestRound.score - parseInt(par);
    const relativeScoreText = `${relativeScore > 0 ? "+" : ""}${relativeScore}`;
    const color =
      relativeScore < 0
        ? "text-green-500"
        : relativeScore > 0
        ? "text-red-500"
        : "";

    // console.log("Best round:", bestRound);
    // Extract the details from the best round
    return {
      score: bestRound.score,
      date: bestRound.EventModel.dateTime,
      location: bestRound.EventModel.location,
      layout: bestRound.EventModel.layout,
      relativeScoreText: relativeScoreText,
      color: color,
    };
  };

  // Function to extract the last round from each unique league
  const getLastRoundPerLeague = (
    rounds: PlayerRound[]
  ): Map<string, PlayerRound> => {
    const lastRounds = new Map<string, PlayerRound>();

    rounds.forEach((round) => {
      const leagueName = round.EventModel.leagueName!;
      const existingRound = lastRounds.get(leagueName);
      if (
        !existingRound ||
        new Date(round.EventModel.dateTime) >
          new Date(existingRound.EventModel.dateTime)
      ) {
        lastRounds.set(leagueName, round);
      }
    });

    return lastRounds;
  };

  // Function to find the lowest tagOut from the last rounds of each league
  const findLowestTagOutFromLastRounds = (
    rounds: PlayerRound[]
  ): { leagueName: string; tagOut: number } | null => {
    const lastRounds = getLastRoundPerLeague(rounds);
    let lowestTagOut = Infinity;
    let leagueWithLowestTagOut = null;

    lastRounds.forEach((round, leagueName) => {
      if (round.tagOut < lowestTagOut) {
        lowestTagOut = round.tagOut;
        leagueWithLowestTagOut = leagueName;
      }
    });

    if (leagueWithLowestTagOut === null) {
      return null;
    }

    return {
      leagueName: leagueWithLowestTagOut,
      tagOut: lowestTagOut,
    };
  };

  return (
    <div
      className={
        user
          ? "grid grid-col-1 p-2 lg:p-6 gap-4 h-full w-full text-center items-start"
          : "flex flex-col max-h-[60dvh] p-4 lg:p-6 gap-4 h-full w-full text-center items-start"
      }
    >
      <h1 className="text-lg text-left font-semibold md:text-2xl">My Rounds</h1>

      <div
        className="flex flex-1 w-full m-auto min-h-[50dvh] h-full items-center justify-center rounded-lg border border-dashed shadow-sm p-2 bg-muted/60"
        x-chunk="dashboard-02-chunk-1"
      >
        {user ? (
          <div className="flex flex-col items-center gap-4 p-0 w-full text-center">
            <div className="lg:grid lg:grid-cols-2 xl:grid-cols-4 p-0 w-full gap-6">
              {!loading ? (
                <div className="grid grid-cols-1 gap-2 items-end">
                  {lowestLeague != null && (
                    <Card className="flex flex-col h-fit min-h-[170px] items-center justify-center">
                      <CardHeader className="pb-2">
                        <CardDescription>
                          Lowest Tag (Season Long)
                        </CardDescription>
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
                    <Card className="flex flex-col h-fit min-h-[170px] items-center justify-center">
                      <CardHeader className="pb-2">
                        <CardDescription>Best Round</CardDescription>
                        <CardTitle
                          className={`text-4xl relative ${bestRound.color}`}
                        >
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
                </div>
              ) : (
                <Skeleton className="w-full h-48" />
              )}
              {!loading ? (
                <div className="grid grid-cols-1 gap-2 items-end mt-2 lg:mt-0">
                  {bestFinish != null && (
                    <Card className="flex flex-col h-fit min-h-[170px] items-center justify-center">
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
                    <Card className="flex flex-col h-fit min-h-[170px] items-center justify-center">
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
                <Skeleton className="w-full h-48" />
              )}

              {!loading ? (
                <>
                  {hasChartData(allChartData) && (
                    <Tabs
                      defaultValue="all"
                      className="col-span-2 mt-2 lg:mt-0"
                    >
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="last5">Last 5</TabsTrigger>
                        <TabsTrigger value="last10">Last 10</TabsTrigger>
                        <TabsTrigger value="last20">Last 20</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all">
                        <Card>
                          <CardHeader>
                            <CardDescription>Recent Placements</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Line data={allChartData} options={chartOptions} />
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="last5">
                        <Card>
                          <CardHeader>
                            <CardDescription>Recent Placements</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Line
                              data={last5ChartData}
                              options={chartOptions}
                            />
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="last10">
                        <Card>
                          <CardHeader>
                            <CardDescription>Recent Placements</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Line
                              data={last10ChartData}
                              options={chartOptions}
                            />
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="last20">
                        <Card>
                          <CardHeader>
                            <CardDescription>Recent Placements</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Line
                              data={last20ChartData}
                              options={chartOptions}
                            />
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  )}
                </>
              ) : (
                <Skeleton className="w-full h-48" />
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center gap-1 text-center">
                <Progress />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {playerRounds.length > 0 ? (
                  <div className="grid grid-cols-1 gap-8">
                    <DataTable columns={columns} data={playerRounds} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                      No data to show yet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Check back later when more data is available.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Please login to view your rounds
            </h3>
            <p className="text-sm text-muted-foreground">
              Make sure to save your udisc display name in your profile settings
              in order to associate previous rounds with your account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
