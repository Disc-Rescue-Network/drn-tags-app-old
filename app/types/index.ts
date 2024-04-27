import { StaticImageData } from "next/image";

export interface Score {
  id: number;
  name: string;
  points: number;
  roundsPlayed: number;
  avatarUrl: string;
}

export type Scores = Score[];

export interface Division {
  division: string;
  division_data: PlayerData[];
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
  points: number;
  currentTag: number;
  // roundsPlayed: number;
  // averageScorePerRound: number; // New property for average points per round
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
export interface UserProfile {
  user_id: number;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  texting_opt_in_status?: boolean;
  account_type?: string;
  home_course?: string;
  udisc_display_name?: string;
}

export interface Event {
  id: number;
  date: Date;
  time: string;
  location: string;
  format: string;
  uDiscEventURL: string;
  maxSignups: number;
  leagueName?: string;
  eventName: string;
  layout: string;
  checkInPeriod: number;
  data?: Division[];
}

export interface EventPreview {
  date: Date;
  time: string;
  location: string;
  format: string;
  uDiscEventURL: string;
  maxSignups: number;
  leagueName?: string;
  eventName: string;
  layout: string;
  checkInPeriod: number;
}
