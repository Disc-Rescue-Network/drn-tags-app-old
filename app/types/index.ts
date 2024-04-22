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
