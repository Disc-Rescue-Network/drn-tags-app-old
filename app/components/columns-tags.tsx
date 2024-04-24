import { ColumnDef } from "@tanstack/react-table";
import { LeaderboardEntry } from "../types";

export const columns: ColumnDef<LeaderboardEntry>[] = [
  {
    accessorKey: "position",
    header: "Position",
    cell: (info) => (info.getValue() as string).toString(),
  },
  { accessorKey: "name", header: "Name", cell: (info) => info.getValue() },
  {
    accessorKey: "score",
    header: "Score",
    cell: (info) => (info.getValue() as string).toString(),
  },
  {
    accessorKey: "currentTag",
    header: "Current Tag",
    cell: (info) => (info.getValue() as string).toString(),
  },
  {
    accessorKey: "roundsPlayed",
    header: "Rounds Played",
    cell: (info) => (info.getValue() as string).toString(),
  },
  {
    accessorKey: "averageScorePerRound",
    header: "Avg Score/Round",
    cell: (info) => (info.getValue() as string).toString(),
  }, // Format to 1 decimal place
];
