// src/components/DataTable.tsx

"use client";
import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { EnhancedLeaderboardEntry, LeaderboardEntry } from "../types";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableRowActions } from "./data-table-row-actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { TAGS_API_BASE_URL } from "../networking/apiExports";
import EditTagDialog from "./editTagDialog";
import SwapTagDialog from "./swapTagDialog";
import { useUserCourses } from "../hooks/useUserCourses";

interface DataTableProps {
  columns: ColumnDef<EnhancedLeaderboardEntry>[];
  data: EnhancedLeaderboardEntry[];
  setLeaderboardData: React.Dispatch<
    React.SetStateAction<EnhancedLeaderboardEntry[] | null>
  >;
  sort?: string;
  loading: boolean;
  admin: boolean;
  qualiferCount: number;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  setLeaderboardData,
  sort,
  loading,
  admin,
  qualiferCount,
}) => {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const initialSorting: SortingState = sort
    ? [
        {
          id: "id", // Assuming you want to sort by "ID"
          desc: sort === "desc", // If `sort` is "desc", set `desc` to true; otherwise false
        },
      ]
    : [];
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Modify the getRowClassName function or create a similar utility to include the qualifier class
  const getRowClassName = (position: number) => {
    if (position >= 1 && position <= 3) {
      return `podium-${position}`; // existing podium classes
    } else if (position <= qualiferCount) {
      return "qualifier"; // new qualifier class for positions 4 to 16
    }
    return ""; // default, no additional class
  };

  const SKELETON_ROWS = 10;
  const router = useRouter();
  const [editingTag, setEditingTag] = React.useState<boolean>(false);
  const [swappingTag, setSwappingTag] = React.useState<boolean>(false);
  const [tagsEntry, setTagsEntry] =
    React.useState<EnhancedLeaderboardEntry | null>(null);
  const { course, courses } = useUserCourses();
  const orgCode = course.orgCode;

  // Function to update the tag
  async function updateTag(kinde_id: string, newTag: number) {
    console.log("Updating tag:", kinde_id, newTag);
    try {
      const response = await fetch(
        `${TAGS_API_BASE_URL}/api/update-tag/${kinde_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newTag, orgCode }),
        }
      );
      if (!response.ok) {
        console.error("Failed to update tag");
        toast({
          title: "Error",
          description: "Failed to update tag",
          variant: "destructive",
          duration: 3000,
        });
      }
      const data = await response.json();
      console.log("Tag updated successfully:", data);
      toast({
        title: "Success",
        description: "Tag updated successfully",
        variant: "default",
        duration: 3000,
      });
      setEditingTag(false);
      // Update the leaderboardData
      setLeaderboardData((prevData) => {
        if (!prevData) return null;
        const updatedData = prevData.map((entry) => {
          if (entry.kindeId === kinde_id) {
            return { ...entry, currentTag: newTag };
          }
          return entry;
        });
        return updatedData;
      });

      return data;
    } catch (error) {
      console.error("Error updating tag:", error);
      toast({
        title: "Error",
        description: "Failed to update tag",
        variant: "destructive",
        duration: 3000,
      });
      throw error;
    }
  }

  // Function to swap tags
  async function swapTags(user1Id: string, user2Id: string) {
    try {
      const response = await fetch(`${TAGS_API_BASE_URL}/api/swap-tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user1Id, user2Id, orgCode }),
      });
      if (!response.ok) {
        console.error("Failed to swap tags");
        toast({
          title: "Error",
          description: "Failed to swap tags",
          variant: "destructive",
          duration: 3000,
        });
      }
      const data = await response.json();
      console.log("Tags swapped successfully:", data);
      toast({
        title: "Success",
        description: "Tags swapped successfully",
        variant: "default",
        duration: 3000,
      });
      setSwappingTag(false);
      // Update the leaderboardData
      setLeaderboardData((prevData) => {
        if (!prevData) return null;
        const oldTag1 =
          prevData.find(
            (entry: EnhancedLeaderboardEntry) => entry.kindeId === user1Id
          )?.currentTag ?? 0;
        const oldTag2 =
          prevData.find(
            (entry: EnhancedLeaderboardEntry) => entry.kindeId === user2Id
          )?.currentTag ?? 0;
        const updatedData = prevData.map((entry) => {
          if (entry.kindeId === user1Id) {
            return { ...entry, currentTag: oldTag2 };
          } else if (entry.kindeId === user2Id) {
            return { ...entry, currentTag: oldTag1 };
          }
          return entry;
        });
        return updatedData;
      });
      return data;
    } catch (error) {
      console.error("Error swapping tags:", error);
      throw error;
    }
  }

  if (admin && !columns.find((col) => col.id === "actions")) {
    columns.push({
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          setEditingTag={setEditingTag}
          setSwappingTag={setSwappingTag}
          setTagsEntry={setTagsEntry}
        />
      ),
    });
  }

  return (
    <div className="space-y-4 lg:px-4">
      <DataTableToolbar searchName={"name"} table={table} />
      <div className="rounded-md border">
        <Table className="relative">
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
            {loading ? (
              Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                  {columns.map((_, colIndex) => (
                    <TableCell
                      key={`skeleton-cell-${rowIndex}-${colIndex}`}
                      className="h-10 w-full p-4"
                    >
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={
                    admin ? "" : getRowClassName(row.original.position)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {/* )} */}
        </Table>
      </div>
      <DataTablePagination table={table} />
      {tagsEntry && (
        <EditTagDialog
          open={editingTag}
          onOpenChange={setEditingTag}
          updateTag={updateTag}
          tagsEntry={tagsEntry}
        />
      )}
      {tagsEntry && (
        <SwapTagDialog
          open={swappingTag}
          onOpenChange={setSwappingTag}
          swapTags={swapTags}
          tagsEntry={tagsEntry}
          allPlayers={data}
        />
      )}
    </div>
  );
};
