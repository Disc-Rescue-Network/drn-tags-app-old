import React from "react";
import { Scores } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "./Leaderboard.css";

interface LeaderboardProps {
  scores: Scores;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  const sortedScores = scores.sort((a, b) => b.score - a.score);
  const podium = sortedScores.slice(0, 3);
  const others = sortedScores.slice(3);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tranquility Tags Standings</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="podium">
          {podium.map((score, index) => {
            const className =
              index === 0 ? "first" : index === 1 ? "second" : "third";
            return (
              <div key={score.id} className={className}>
                <Avatar className="hidden h-9 w-9 sm:flex">
                  {/* <AvatarImage src={score.avatarUrl} alt="Avatar" /> */}
                  <AvatarFallback>{index + 1}</AvatarFallback>
                </Avatar>
                {/* <div
                  className="avatar"
                  style={{ backgroundImage: `url(${score.avatarUrl})` }}
                ></div> */}
                <strong>{score.name}</strong>
                <span>{score.score}</span>
              </div>
            );
          })}
        </div>
        {sortedScores.slice(3).map((score, index) => (
          <>
            <div className="flex items-center gap-4" key={score.id}>
              <Avatar className="hidden h-9 w-9 sm:flex">
                {/* <AvatarImage src={score.avatarUrl} alt="Avatar" /> */}
                <AvatarFallback>{index + 4}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{score.name}</p>
                <p className="text-sm text-muted-foreground">
                  Rounds Played: {score.roundsPlayed || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Avg Score: {score.score / score.roundsPlayed || 0}
                </p>
              </div>
              <div className="ml-auto font-medium">{score.score}</div>
            </div>
          </>
        ))}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
