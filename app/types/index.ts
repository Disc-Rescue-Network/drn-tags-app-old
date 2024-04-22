import { StaticImageData } from "next/image";

export interface Score {
  id: number;
  name: string;
  score: number;
  roundsPlayed: number;
  avatarUrl: string;
}

export type Scores = Score[];
