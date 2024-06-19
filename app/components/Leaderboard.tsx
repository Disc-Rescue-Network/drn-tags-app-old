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
        // setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch leaderboard data",
        });
        throw new Error("Failed to fetch leaderboard data");
      }
      // setLoading(false);
      return await response.json();
    } catch (error) {
      // setLoading(false);
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
        // setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch leaderboard data",
        });
      }
    };

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const fetchAlcyonLeaderboard = async () => {
      try {
        const data = await fetchLeaderboardData("org_1aa61d133053a");
        console.log("Leaderboard data", data);
        setAlcyonDataAsOf(data.data.lastRoundPlayedOverall);
        setAlcyonLeaderboardData(data.data.leaderboard);
      } catch (error) {
        // setLoading(false);
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
            {/* {loading && <Skeleton className="h-80 p-4 m-4" />} */}
            {leaderboardData && (
              <DataTable
                columns={columns}
                data={leaderboardData}
                loading={loading}
              />
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
            {/* {loading && <Skeleton className="h-80 p-4 m-4" />} */}
            {alcyonLeaderboardData && (
              <DataTable
                columns={columns}
                data={alcyonLeaderboardData}
                loading={loading}
              />
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
