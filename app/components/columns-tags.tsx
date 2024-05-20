import { ColumnDef } from "@tanstack/react-table";
import { EnhancedLeaderboardEntry, LeaderboardEntry } from "../types";
import {
  Medal,
  Minus,
  MoveUp,
  MoveDown,
  ChevronUp,
  ChevronDown,
  ChevronsLeftRight,
  Dot,
} from "lucide-react";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Label } from "@/components/ui/label";

export const columns: ColumnDef<EnhancedLeaderboardEntry>[] = [
  {
    accessorKey: "position",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Position"
        className="max-w-[70px]"
      />
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
      <DataTableColumnHeader
        column={column}
        title="Name"
        className="min-w-[150px]"
      />
    ),
    cell: (info) => {
      return (
        <div className="flex flex-row min-w-fit items-center justify-start gap-2">
          <Label className="min-w-fit text-ellipsis">
            {(info.getValue() as string).toString()}
          </Label>
          {info.row.original.change === "up" && (
            <div className="flex flex-row gap-1 justify-center items-center">
              <ChevronUp className="w-4 h-4 text-green-600" />
              <Label className="text-xxs">
                {info.row.original.previousPosition -
                  info.row.original.position}
              </Label>
            </div>
          )}
          {info.row.original.change === "down" && (
            <div className="flex flex-row gap-1 justify-center items-center">
              <ChevronDown className="w-4 h-4 text-red-600" />
              <Label className="text-xxs">
                {Math.abs(
                  info.row.original.previousPosition -
                    info.row.original.position
                )}
              </Label>
            </div>
          )}
          {info.row.original.change === "steady" && (
            <div className="flex flex-row gap-0 justify-center items-center">
              <Dot className="w-6 h-6" />
              <Minus className="w-2 h-2" />
            </div>
          )}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
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
      <DataTableColumnHeader column={column} title="Avg Score/Round" />
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
