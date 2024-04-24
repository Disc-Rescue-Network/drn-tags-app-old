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
  // Helper function to compute rounds played and average score
  const enhanceLeaderboardEntries = (
    entries: LeaderboardEntry[]
  ): EnhancedLeaderboardEntry[] => {
    return entries.map((entry) => {
      const scores = runningScoresData.filter(
        (score) => score.name === entry.name
      );
      const roundsPlayed = scores.length;
      const totalPoints = scores.reduce(
        (acc, score) => acc + score.pointsScored,
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
  const sortedScores = enhancedEntries.sort((a, b) => b.score - a.score);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tranquility Tags Standings</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        <DataTable columns={columns} data={sortedScores} />
        {/* <div className="podium">
          {podium.map((score, index) => {
            const className =
              index === 0 ? "first" : index === 1 ? "second" : "third";
            return (
              <div key={score.position} className={className}>
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src={score.avatarUrl} alt="Avatar" /> 
                  <AvatarFallback>{score.position}</AvatarFallback>
                </Avatar>
                <div
                  className="avatar"
                  style={{ backgroundImage: `url(${score.avatarUrl})` }}
                ></div> 
                <strong>{score.name}</strong>
                <span>{score.score}</span>
                <span>Current Tag: {score.currentTag}</span>
              </div>
            );
          })}
        </div>

        {sortedScores.slice(3).map((score, index) => (
          <>
            <div className="flex items-center gap-4" key={score.position}>
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={score.avatarUrl} alt="Avatar" />
                <AvatarFallback>{score.position}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{score.name}</p>
                <p className="text-sm text-muted-foreground">
                  {" "}
                  Current Tag: {score.currentTag}
                </p>
                <p className="text-sm text-muted-foreground">Avg Score: TBD</p> 
              </div>
              <div className="ml-auto font-medium">{score.score}</div>
            </div>
          </>
        ))} */}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
