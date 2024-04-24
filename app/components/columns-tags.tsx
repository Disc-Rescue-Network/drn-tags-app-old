import { ColumnDef } from "@tanstack/react-table";
import { LeaderboardEntry } from "../types";
import { Medal } from "lucide-react";

export const columns: ColumnDef<LeaderboardEntry>[] = [
  {
    accessorKey: "position",
    header: "Position",
    cell: (info) => (
      <div className="flex flex-row gap-1">
        {getPodiumIcon(info.row.original.position)}
        {(info.getValue() as string).toString()}
      </div>
    ),
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

// Function to return the podium icon based on the position
const getPodiumIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Medal color="gold" size={18} style={{ marginRight: "0.5rem" }} />;
    case 2:
      return (
        <Medal color="silver" size={18} style={{ marginRight: "0.5rem" }} />
      );
    case 3:
      return (
        <Medal color="#cd7f32" size={18} style={{ marginRight: "0.5rem" }} />
      );
    default:
      return null;
  }
};
