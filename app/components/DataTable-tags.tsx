// src/components/DataTable.tsx
import React from "react";
import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { LeaderboardEntry } from "../types";

interface DataTableProps {
  columns: ColumnDef<LeaderboardEntry>[];
  data: LeaderboardEntry[];
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Modify the getRowClassName function or create a similar utility to include the qualifier class
  const getRowClassName = (position: number) => {
    if (position >= 1 && position <= 3) {
      return `podium-${position}`; // existing podium classes
    } else if (position <= 16) {
      return "qualifier"; // new qualifier class for positions 4 to 16
    }
    return ""; // default, no additional class
  };

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            className={getRowClassName(row.original.position)}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
