import { ColumnDef } from "@tanstack/react-table";
import { LeaderboardEntry } from "../types";
import { Medal } from "lucide-react";
import { DataTableColumnHeader } from "./data-table-column-header";

export const columns: ColumnDef<LeaderboardEntry>[] = [
  {
    accessorKey: "position",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Position" />
    ),
    cell: (info) => (
      <div className="flex flex-row gap-1">
        {getPodiumIcon(info.row.original.position)}
        {(info.getValue() as string).toString()}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "points",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Points Total" />
    ),
    cell: (info) => (info.getValue() as string).toString(),
  },
  {
    accessorKey: "currentTag",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Current Tag" />
    ),
    cell: (info) => {
      const value = info.getValue();
      return value ? (value as string).toString() : "";
    },
  },
  {
    accessorKey: "roundsPlayed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rounds Played" />
    ),
    cell: (info) => (info.getValue() as string).toString(),
  },
  {
    accessorKey: "averageScorePerRound",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Score/Round" />
    ),
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

export const columnHeadersArrayTags: { [key: string]: string } = {
  position: "Position",
  name: "Name",
  points: "Points",
  currentTag: "Current Tag",
  roundsPlayed: "Rounds Played",
  averageScorePerRound: "Average Score/Round",
};
