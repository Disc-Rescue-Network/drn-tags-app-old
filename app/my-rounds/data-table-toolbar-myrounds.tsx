"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { columnHeadersArrayRounds } from "./columns-myrounds";
import { useMemo } from "react";
import { DataTableFacetedFilter } from "../components/data-table-faceted-filter";
import DataTableViewOptions from "../components/data-table-view-options";

interface DataTableToolbarProps<TData> {
  searchName: string;
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  searchName,
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Assuming `tableData` is the data fed into the table
  const uniqueLocations = useMemo(() => {
    const values = table
      .getCoreRowModel()
      .flatRows.map((row) => row.getValue("EventModel_location")) as string[];
    return Array.from(new Set(values));
  }, [table]);

  console.log("uniqueLocations", uniqueLocations);

  // Convert the Set to an array and map it to the format needed for the options
  const locationOptions = Array.from(uniqueLocations).map((location) => ({
    value: location,
    label: location,
  }));

  console.log("locationOptions", locationOptions);

  const uniqueLayouts = useMemo(() => {
    const values = table
      .getCoreRowModel()
      .flatRows.map((row) =>
        row.getValue("EventModel_layout.name")
      ) as string[];
    return Array.from(new Set(values));
  }, [table]);

  console.log("uniqueLayouts", uniqueLayouts);

  const layoutOptions = Array.from(uniqueLayouts).map((layout) => ({
    value: layout,
    label: layout,
  }));

  console.log("layoutOptions", layoutOptions);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by event..."
          value={
            (table.getColumn(searchName)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(searchName)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("EventModel_location") && (
          <DataTableFacetedFilter
            column={table.getColumn("EventModel_location")}
            title="Location"
            options={locationOptions}
          />
        )}
        {table.getColumn("EventModel_layout.name") && (
          <DataTableFacetedFilter
            column={table.getColumn("EventModel_layout.name")}
            title="Layout"
            options={layoutOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions
        table={table}
        columnHeaders={columnHeadersArrayRounds}
      />
    </div>
  );
}
