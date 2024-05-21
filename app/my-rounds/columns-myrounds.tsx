import { ColumnDef } from "@tanstack/react-table";
import { PlayerRound } from "../types"; // Ensure this import points to where your PlayerRound type is defined
import { ChevronUp, ChevronDown } from "lucide-react"; // Assuming you're using Lucide icons for visual indicators
import { DataTableColumnHeader } from "../components/data-table-column-header";

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
    accessorKey: "EventModel.location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: (info) => info.getValue(),
    enableSorting: true,
    filterFn: (row, id, value) => {
      console.log("Filtering:", {
        rowValue: row.getValue(id),
        filterValue: value,
      });
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
      console.log("Filtering:", {
        rowValue: row.getValue(id),
        filterValue: value,
      });
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "EventModel.eventName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event" />
    ),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "EventModel.dateTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event Date" />
    ),
    cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
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
};
