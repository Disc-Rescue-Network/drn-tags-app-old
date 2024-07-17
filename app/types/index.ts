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
  change: string;
  previousPosition: number;
  kindeId: string;
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
  lastKnownTagOut?: number;
}

export interface TagsEvent {
  event_id: number;
  dateTime: Date;
  location: string;
  format: string;
  udiscLeagueURL: string;
  maxSignups: number;
  leagueName?: string;
  eventName: string;
  layout: LayoutModel;
  checkInPeriod: number;
  courseId: string;
  divisions: Division[];
  data?: DivisionResults[];
  CheckedInPlayers?: CheckInData[];
}

export interface EventPreview {
  dateTime: Date;
  date?: Date;
  time?: string;
  location: string;
  format: string;
  udiscLeagueURL: string;
  maxSignups: number;
  leagueName?: string;
  eventName: string;
  layout: LayoutModel;
  checkInPeriod: number;
  // CheckedInPlayers?: string[];
}

export interface CourseSettingsData {
  courseName: string;
  layouts: LayoutModel[];
  holes: { hole_id: number; active: boolean }[];
  divisions: { division_id: number; name: string; active: boolean }[];
  city: string;
  state: string;
  shortCode: string;
  venmoUsername?: string;
  cashappUsername?: string;
}

export interface LayoutModel {
  layout_id?: number; // Auto-increment primary key
  name: string; // Can hold up to 255 characters
  createdAt?: Date; // Stores date and time
  updatedAt?: Date; // Stores date and time
  orgCode?: string; // Can hold up to 255 characters
  par: string; // The new field you added, assumed to be an integer
}

// export interface Layout {
//   layout_id: number;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
//   orgCode: string;
// }

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
  card_id: number | null;
  starting_hole: number;
  event_id: number;
  player_check_ins: PlayersWithDivisions[];
}

export interface HoleModel {
  hold_id: number;
  hole_number: number;
  active: boolean;
}

export interface PlayerRound {
  checkInId: number;
  udisc_display_name: string;
  tagIn: number | null;
  tagOut: number;
  place: number;
  pointsScored: number;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
  kinde_id: string;
  event_id: number;
  division_id: number;
  card_id: number | null;
  score: number;
  thru: number;
  EventModel: TagsEvent;
  division: Division;
}
