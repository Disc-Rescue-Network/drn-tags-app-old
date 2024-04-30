import React from "react";
import {
  LeaderboardEntry,
  RunningScoreEntry,
  EnhancedLeaderboardEntry,
} from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./DataTable-tags";
import "./Leaderboard.css";
import { columns } from "./columns-tags";

interface LeaderboardProps {
  leaderboardEntries: LeaderboardEntry[];
  runningScoresData: RunningScoreEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  leaderboardEntries,
  runningScoresData,
}) => {
  // Helper function to compute rounds played and average points
  const enhanceLeaderboardEntries = (
    entries: LeaderboardEntry[]
  ): EnhancedLeaderboardEntry[] => {
    return entries.map((entry) => {
      const scores = runningScoresData.filter(
        (points) => points.name === entry.name
      );
      const roundsPlayed = scores.length;
      const totalPoints = scores.reduce(
        (acc, points) => acc + points.pointsScored,
        0
      );
      const averageScorePerRound =
        roundsPlayed > 0 ? Number((totalPoints / roundsPlayed).toFixed(2)) : 0;

      return {
        ...entry,
        roundsPlayed,
        averageScorePerRound,
      };
    });
  };

  const enhancedEntries = enhanceLeaderboardEntries(leaderboardEntries);
  const sortedScores = enhancedEntries.sort((a, b) => b.points - a.points);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tranquility Tags Standings</CardTitle>
      </CardHeader>
      <CardContent className="p-0 grid gap-8 w-full">
        <DataTable columns={columns} data={sortedScores} />
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
        </Card>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
