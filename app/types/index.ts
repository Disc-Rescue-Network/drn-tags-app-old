import { StaticImageData } from "next/image";

export interface Score {
  id: number;
  name: string;
  score: number;
  roundsPlayed: number;
  avatarUrl: string;
}

export type Scores = Score[];

export interface Division {
  division: string;
  division_data: PlayerData[];
}

export interface Event {
  league_name: string;
  data: Division[];
}

export interface PlayerData {
  POS: string;
  NAME: string;
  SCORE: string;
  THRU: string;
  change?: "up" | "down" | "steady"; // Indicating position change
}

export interface LeaderboardEntry {
  position: number;
  name: string;
  score: number;
  currentTag: number;
  // roundsPlayed: number;
  // averageScorePerRound: number; // New property for average score per round
}
export interface EnhancedLeaderboardEntry extends LeaderboardEntry {
  roundsPlayed: number;
  averageScorePerRound: number;
}

export interface RunningScoreEntry {
  roundDate: string;
  name: string;
  place: number;
  tagIn: string | null;
  tagOut: number;
  pointsScored: number;
}
