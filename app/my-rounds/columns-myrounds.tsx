import { ColumnDef } from "@tanstack/react-table";
import { PlayerRound } from "../types"; // Ensure this import points to where your PlayerRound type is defined
import { ChevronUp, ChevronDown } from "lucide-react"; // Assuming you're using Lucide icons for visual indicators
import { DataTableColumnHeader } from "../components/data-table-column-header";
import { Label } from "@/components/ui/label";

export const columns: ColumnDef<PlayerRound>[] = [
  // {
  //   accessorKey: "udisc_display_name",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Player Name" />
  //   ),
  //   cell: (info) => info.getValue(),
  //   enableSorting: true,
  //   enableHiding: true,
  // },
  {
    accessorKey: "EventModel.dateTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event Date" />
    ),
    cell: (info) => {
      const utcDateTimeStr = info.getValue() as string;
      const date = new Date(utcDateTimeStr); // Convert UTC date-time string to Date object

      // Adjust the date to the local time zone
      const localDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
      );

      return localDate.toLocaleDateString(); // Format to local date string
    },
  },
  {
    accessorKey: "EventModel.location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: (info) => info.getValue(),
    enableSorting: true,
    filterFn: (row, id, value) => {
      // console.log("Filtering:", {
      //   rowValue: row.getValue(id),
      //   filterValue: value,
      // });
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "EventModel.layout.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Layout" />
    ),
    cell: (info) => info.getValue(),
    enableSorting: true,
    filterFn: (row, id, value) => {
      // console.log("Filtering:", {
      //   rowValue: row.getValue(id),
      //   filterValue: value,
      // });
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "place",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Place" />
    ),
    cell: (info) => info.getValue()?.toString() ?? "",
    enableSorting: true,
  },
  {
    accessorKey: "pointsScored",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Points Scored" />
    ),
    cell: (info) => info.getValue()?.toString() ?? "",
  },
  {
    accessorKey: "score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Score" />
    ),
    cell: (info) => {
      const score = info.getValue()?.toString() ?? "";
      const par = info.row.original.EventModel.layout.par;
      const relativeScore = parseInt(score) - parseInt(par);
      const relativeScoreText = `${
        relativeScore > 0 ? "+" : ""
      }${relativeScore}`;
      const color =
        relativeScore < 0
          ? "text-green-500"
          : relativeScore > 0
          ? "text-red-500"
          : "";

      return (
        <div className="flex flex-row min-w-fit items-center justify-start gap-2">
          <Label className={`min-w-fit text-ellipsis ${color}`}>
            {score} ({relativeScoreText})
          </Label>
        </div>
      );
    },
  },
  {
    accessorKey: "division.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Division" />
    ),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "tagIn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tag In" />
    ),
    cell: (info) => info.getValue()?.toString() ?? "",
  },
  {
    accessorKey: "tagOut",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tag Out" />
    ),
    cell: (info) => info.getValue()?.toString() ?? "",
  },
  {
    accessorKey: "EventModel.eventName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event" />
    ),
    cell: (info) => info.getValue(),
  },
];

export const columnHeadersArrayRounds: { [key: string]: string } = {
  udisc_display_name: "UDisc Display Name",
  EventModel_location: "Location",
  "EventModel_layout.name": "Layout",
  EventModel_eventName: "Event",
  EventModel_dateTime: "Event Date",
  division_name: "Division",
  tagIn: "Tag In",
  tagOut: "Tag Out",
  place: "Place",
  pointsScored: "Points Scored",
  score: "Score",
};
