"use client";

import React, { useEffect, useState } from "react";
import {
  LeaderboardEntry,
  RunningScoreEntry,
  EnhancedLeaderboardEntry,
} from "../types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "./DataTable-tags";
import "./Leaderboard.css";
import { columns } from "./columns-tags";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TAGS_API_BASE_URL } from "../networking/apiExports";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);

  const fetchLeaderboardData = async (courseId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${TAGS_API_BASE_URL}/api/leaderboard/${courseId}`
      );
      if (!response.ok) {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch leaderboard data",
        });
        throw new Error("Failed to fetch leaderboard data");
      }
      setLoading(false);
      return await response.json();
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch leaderboard data",
      });
      console.error("Error fetching leaderboard data:", error);
      throw error;
    }
  };

  const [leaderboardData, setLeaderboardData] = useState<
    EnhancedLeaderboardEntry[] | null
  >(null);

  const [dataAsOf, setDataAsOf] = useState<string | null>(null);

  const [alcyonLeaderboardData, setAlcyonLeaderboardData] = useState<
    EnhancedLeaderboardEntry[] | null
  >(null);
  const [alcyonDataAsOf, setAlcyonDataAsOf] = useState<string | null>(
    "05/13/2024"
  );

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await fetchLeaderboardData("org_155e4b351474");
        console.log("Leaderboard data", data);
        setDataAsOf(data.data.lastRoundPlayedOverall);
        setLeaderboardData(data.data.leaderboard);
      } catch (error) {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch leaderboard data",
        });
      }
    };

    fetchLeaderboard();
  }, []);

  // const alcyonLeaderboardData: EnhancedLeaderboardEntry[] = [
  //   {
  //     position: 1,
  //     name: "Ben Riesenbach",
  //     points: 37.5,
  //     currentTag: -1,
  //     roundsPlayed: 2,
  //     averageScorePerRound: 37.5 / 2,
  //   },
  //   {
  //     position: 2,
  //     name: "Brandon Hasko",
  //     points: 34.5,
  //     currentTag: -1,
  //     roundsPlayed: 2,
  //     averageScorePerRound: 34.5 / 2,
  //   },
  //   {
  //     position: 3,
  //     name: "Dan Heller",
  //     points: 34.5,
  //     currentTag: -1,
  //     roundsPlayed: 2,
  //     averageScorePerRound: 34.5 / 2,
  //   },
  //   {
  //     position: 4,
  //     name: "Chris Deck",
  //     points: 29.5,
  //     currentTag: -1,
  //     roundsPlayed: 2,
  //     averageScorePerRound: 29.5 / 2,
  //   },
  //   {
  //     position: 5,
  //     name: "Dickie DG",
  //     points: 29,
  //     currentTag: -1,
  //     roundsPlayed: 2,
  //     averageScorePerRound: 29 / 2,
  //   },
  //   {
  //     position: 6,
  //     name: "Tim Holovachuk",
  //     points: 21.5,
  //     currentTag: -1,
  //     roundsPlayed: 2,
  //     averageScorePerRound: 21.5 / 2,
  //   },
  //   {
  //     position: 7,
  //     name: "Marc Garcia",
  //     points: 20.5,
  //     currentTag: -1,
  //     roundsPlayed: 2,
  //     averageScorePerRound: 20.5 / 2,
  //   },
  //   {
  //     position: 8,
  //     name: "Hunter Bostwick",
  //     points: 20,
  //     currentTag: -1,
  //     roundsPlayed: 1,
  //     averageScorePerRound: 20,
  //   },
  //   {
  //     position: 9,
  //     name: "David Voynow",
  //     points: 19.5,
  //     currentTag: -1,
  //     roundsPlayed: 2,
  //     averageScorePerRound: 19.5 / 2,
  //   },
  //   {
  //     position: 10,
  //     name: "Andrew Stocklin",
  //     points: 19,
  //     currentTag: -1,
  //     roundsPlayed: 1,
  //     averageScorePerRound: 19,
  //   },
  //   {
  //     position: 11,
  //     name: "Steve Finger",
  //     points: 17.5,
  //     currentTag: -1,
  //     roundsPlayed: 2,
  //     averageScorePerRound: 17.5 / 2,
  //   },
  //   {
  //     position: 12,
  //     name: "Rich Bostwick",
  //     points: 14,
  //     currentTag: -1,
  //     roundsPlayed: 1,
  //     averageScorePerRound: 14,
  //   },
  //   {
  //     position: 13,
  //     name: "Zack Gross",
  //     points: 14,
  //     currentTag: -1,
  //     roundsPlayed: 1,
  //     averageScorePerRound: 14,
  //   },
  //   {
  //     position: 14,
  //     name: "Dave Schnatterer",
  //     points: 12,
  //     currentTag: -1,
  //     roundsPlayed: 2,
  //     averageScorePerRound: 12 / 2,
  //   },
  //   {
  //     position: 15,
  //     name: "Matt Esteves",
  //     points: 12,
  //     currentTag: -1,
  //     roundsPlayed: 1,
  //     averageScorePerRound: 12,
  //   },
  //   {
  //     position: 16,
  //     name: "Danny Betz",
  //     points: 12,
  //     currentTag: -1,
  //     roundsPlayed: 1,
  //     averageScorePerRound: 12,
  //   },
  //   {
  //     position: 17,
  //     name: "Derek Krykewycz",
  //     points: 10,
  //     currentTag: -1,
  //     roundsPlayed: 2,
  //     averageScorePerRound: 10 / 2,
  //   },
  //   {
  //     position: 18,
  //     name: "Michael Coffey",
  //     points: 7.5,
  //     currentTag: -1,
  //     roundsPlayed: 2,
  //     averageScorePerRound: 7.5 / 2,
  //   },
  //   {
  //     position: 19,
  //     name: "Michael Sheehan",
  //     points: 7.5,
  //     currentTag: -1,
  //     roundsPlayed: 0,
  //     averageScorePerRound: 0,
  //   },
  //   {
  //     position: 20,
  //     name: "Eric Brigandi",
  //     points: 7,
  //     currentTag: -1,
  //     roundsPlayed: 2,
  //     averageScorePerRound: 7 / 2,
  //   },
  //   {
  //     position: 21,
  //     name: "Andrew Finger",
  //     points: 7,
  //     currentTag: -1,
  //     roundsPlayed: 1,
  //     averageScorePerRound: 7,
  //   },
  //   {
  //     position: 22,
  //     name: "Dave Clements",
  //     points: 6.5,
  //     currentTag: -1,
  //     roundsPlayed: 1,
  //     averageScorePerRound: 6.5,
  //   },
  //   {
  //     position: 23,
  //     name: "Ryan OShea",
  //     points: 6.5,
  //     currentTag: -1,
  //     roundsPlayed: 1,
  //     averageScorePerRound: 6.5,
  //   },
  //   {
  //     position: 24,
  //     name: "Sonny Ciocco",
  //     points: 6.5,
  //     currentTag: -1,
  //     roundsPlayed: 1,
  //     averageScorePerRound: 6.5,
  //   },
  //   {
  //     position: 25,
  //     name: "Cody Kulik",
  //     points: 4.5,
  //     currentTag: -1,
  //     roundsPlayed: 1,
  //     averageScorePerRound: 4.5,
  //   },
  //   {
  //     position: 26,
  //     name: "Drew Jackson",
  //     points: 4.5,
  //     currentTag: -1,
  //     roundsPlayed: 1,
  //     averageScorePerRound: 4.5,
  //   },
  //   {
  //     position: 27,
  //     name: "Ed Stewart",
  //     points: 4.5,
  //     currentTag: -1,
  //     roundsPlayed: 1,
  //     averageScorePerRound: 4.5,
  //   },
  //   {
  //     position: 28,
  //     name: "Mitch Wishart",
  //     points: 1,
  //     currentTag: -1,
  //     roundsPlayed: 1,
  //     averageScorePerRound: 1,
  //   },
  // ];

  useEffect(() => {
    const fetchAlcyonLeaderboard = async () => {
      try {
        const data = await fetchLeaderboardData("org_1aa61d133053a");
        console.log("Leaderboard data", data);
        setAlcyonDataAsOf(data.data.lastRoundPlayedOverall);
        setAlcyonLeaderboardData(data.data.leaderboard);
      } catch (error) {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch leaderboard data",
        });
      }
    };

    fetchAlcyonLeaderboard();
  }, []);

  return (
    <Tabs defaultValue="tranq">
      <TabsList>
        <TabsTrigger value="tranq">Tranquility Trails</TabsTrigger>
        <TabsTrigger value="alcyon">Alycon Woods</TabsTrigger>
      </TabsList>
      <TabsContent value="tranq">
        <Card>
          <CardHeader>
            <CardTitle>Tranquility Tags Standings</CardTitle>
          </CardHeader>
          <CardContent className="p-0 grid gap-8 w-full">
            {loading && <Skeleton className="h-80 p-4 m-4" />}
            {leaderboardData && (
              <DataTable columns={columns} data={leaderboardData} />
            )}
            <Card className="legend m-6">
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex flex-row gap-4">
                  <span className="podium-1"></span> 1st Place (Gold)
                </div>
                <div className="flex flex-row gap-4">
                  <span className="podium-2"></span> 2nd Place (Silver)
                </div>
                <div className="flex flex-row gap-4">
                  <span className="podium-3"></span> 3rd Place (Bronze)
                </div>
                <div className="flex flex-row gap-4">
                  <span className="qualifier"></span> Qualifies for Invitational
                  (Top 16)
                </div>
              </CardContent>
              <CardFooter className="text-sm italic">
                *Data as of {dataAsOf ? format(dataAsOf, "MM/dd/yyyy") : ""}
              </CardFooter>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="alcyon">
        <Card>
          <CardHeader>
            <CardTitle>Alcyon Woods Tags Standings</CardTitle>
          </CardHeader>
          <CardContent className="p-0 grid gap-8 w-full">
            {loading && <Skeleton className="h-80 p-4 m-4" />}
            {alcyonLeaderboardData && (
              <DataTable columns={columns} data={alcyonLeaderboardData} />
            )}
            <Card className="legend m-6">
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex flex-row gap-4">
                  <span className="podium-1"></span> 1st Place (Gold)
                </div>
                <div className="flex flex-row gap-4">
                  <span className="podium-2"></span> 2nd Place (Silver)
                </div>
                <div className="flex flex-row gap-4">
                  <span className="podium-3"></span> 3rd Place (Bronze)
                </div>
                <div className="flex flex-row gap-4">
                  <span className="qualifier"></span> Qualifies for Invitational
                  (Top 16)
                </div>
              </CardContent>
              <CardFooter className="text-sm italic">
                *Data as of{" "}
                {alcyonDataAsOf ? format(alcyonDataAsOf, "MM/dd/yyyy") : ""}
              </CardFooter>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Leaderboard;
