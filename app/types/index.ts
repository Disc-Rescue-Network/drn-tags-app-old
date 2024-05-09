import { StaticImageData } from "next/image";
import { PlayersWithDivisions } from "../admin/events/[event_id]/page";

export interface Score {
  id: number;
  name: string;
  points: number;
  roundsPlayed: number;
  avatarUrl: string;
}

export type Scores = Score[];

export interface DivisionResults {
  division: string;
  division_data: PlayerData[];
}

export interface Division {
  division_id: number;
  name: string;
  active: boolean;
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
  kinde_id: string;
}

export interface TagsEvent {
  event_id: number;
  dateTime: Date;
  location: string;
  format: string;
  uDiscEventURL: string;
  maxSignups: number;
  leagueName?: string;
  eventName: string;
  layout: string;
  checkInPeriod: number;
  courseId: string;
  Divisions: Division[];
  data?: DivisionResults[];
  CheckedInPlayers?: CheckInData[];
}

export interface EventPreview {
  dateTime: Date;
  date?: Date;
  time?: string;
  location: string;
  format: string;
  uDiscEventURL: string;
  maxSignups: number;
  leagueName?: string;
  eventName: string;
  layout: string;
  checkInPeriod: number;
  // CheckedInPlayers?: string[];
}

export interface CourseSettingsData {
  courseName: string;
  layouts: { name: string }[];
  holes: { hole_id: number; active: boolean }[];
  divisions: { division_id: number; name: string; active: boolean }[];
  city: string;
  state: string;
  shortCode: string;
  venmoUsername?: string;
  cashappUsername?: string;
}

export interface Layout {
  layout_id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  orgCode: string;
}

export type SuggestionFormData = {
  suggestion: string;
};

export interface CheckInFormData {
  uDiscDisplayName: string;
  tagIn: number;
  divisionId: number;
  paid: boolean;
  event_id: number;
  kinde_id: string | null; // assuming kinde_id can be null for unauthenticated check-ins
}

export type CheckInData = {
  checkInId: number;
  udisc_display_name: string;
  tagIn: number;
  tagOut: number | null;
  place: number | null;
  pointsScored: number | null;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
  kinde_id: string;
  event_id: number;
  division_id: number;
  division_name: string;
};

export interface CardModel {
  starting_hole: number;
  event_id: number;
  player_check_ins: PlayersWithDivisions[];
}
