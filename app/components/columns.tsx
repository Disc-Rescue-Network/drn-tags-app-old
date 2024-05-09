import { ColumnDef } from "@tanstack/react-table";
import NameList from "./NameList";
import { FaArrowUp, FaArrowDown, FaCircle } from "react-icons/fa";

export interface PlayerData {
  POS: string;
  NAME: string;
  SCORE: string;
  THRU: string;
}

export const columns: ColumnDef<PlayerData>[] = [
  {
    accessorKey: "POS",
    header: "Position",
    cell: (info) => info.getValue(),
    // cell: ({ getValue }) => {
    //   const change = getValue() as "up" | "down" | "steady" | undefined;
    //   switch (change) {
    //     case "up":
    //       return <FaArrowUp className="text-green-500" />;
    //     case "down":
    //       return <FaArrowDown className="text-red-500" />;
    //     case "steady":
    //       return <FaCircle className="text-gray-500" />;
    //     default:
    //       return null; // Render nothing if no change information is available
    //   }
    // },
  },
  {
    accessorKey: "NAME", // Make sure this now expects an array of strings
    header: () => "Name",
    cell: ({ getValue }) => <NameList names={(getValue() as string[]) || []} />,
  },
  {
    accessorKey: "SCORE",
    header: "Score",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "THRU",
    header: "Thru",
    cell: (info) => info.getValue(),
  },
];
