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
  Division: string;
  Data: PlayerData[];
}

export interface PlayerData {
  POS: string;
  NAME: string;
  SCORE: string;
  THRU: string;
}
