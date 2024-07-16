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
import { format } from "date-fns";
import { useUserCourses } from "../hooks/useUserCourses";

const LeaderboardAdmin = () => {
  const [loading, setLoading] = useState(true);
  const {
    courses,
    course,
    isSwitchingOrgs,
    belongsToOrg,
    errorMessage,
    showErrorMessage,
  } = useUserCourses();

  const [leaderboardData, setLeaderboardData] = useState<
    EnhancedLeaderboardEntry[] | null
  >(null);
  const [dataAsOf, setDataAsOf] = useState<string | null>(null);

  const fetchLeaderboardData = async () => {
    // console.log("fetchLeaderboardData course:", course);
    try {
      setLoading(true);
      const response = await fetch(
        `${TAGS_API_BASE_URL}/api/leaderboard/${course.orgCode}`
      );
      // console.log("Response:", response);
      if (!response.ok) {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch leaderboard data",
        });
        throw new Error("Failed to fetch leaderboard data");
      }
      // console.log("Response OK");
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

  useEffect(() => {
    // console.log("Course:", course);
    if (course.courseName !== "") {
      fetchLeaderboardData()
        .then((result) => {
          const data = result.data;
          console.log("Leaderboard data", data);
          setLeaderboardData(data.leaderboard);
          setDataAsOf(data.lastRoundPlayedOverall);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching leaderboard data:", error);
        });
    }
  }, [course]);

  return (
    <Card className="border-none p-0 m-0">
      <CardHeader>
        <CardTitle>{course.courseName} Standings</CardTitle>
      </CardHeader>
      <CardContent className="p-0 grid gap-8 w-full">
        <div className="grid grid-cols-1 gap-4">
          <DataTable
            columns={columns}
            data={leaderboardData || []}
            setLeaderboardData={setLeaderboardData}
            loading={loading}
            admin={true}
            qualiferCount={course.courseName === "Tranquility Trails" ? 16 : 32}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardAdmin;
