"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "../../../components/data-table-view-options";

// import { statuses } from "../data/data";
import { DataTableFacetedFilterBoolean } from "./data-table-faceted-filter-boolean";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Check, ShieldAlert } from "lucide-react";
import { useMemo } from "react";
// import { columnHeadersArray } from "./columns";

interface DataTableToolbarProps<TData> {
  searchName: string;
  table: Table<TData>;
}

const columnHeadersArray: { [key: string]: string } = {
  udisc_display_name: "Player",
  division_name: "Division",
  tagIn: "Tag In",
  paid: "Paid",
};

export function DataTableToolbar<TData>({
  searchName,
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const paidOptions = [
    { value: true, label: "Paid" },
    { value: false, label: "Unpaid" },
  ];

  // Assuming `tableData` is the data fed into the table
  const uniqueDivisions = useMemo(() => {
    const values = table
      .getCoreRowModel()
      .flatRows.map((row) => row.getValue("division_name")) as string[];
    return Array.from(new Set(values));
  }, [table]);

  // console.log("uniqueDivisions", uniqueDivisions);

  // Convert the Set to an array and map it to the format needed for the options
  const divisionOptions = Array.from(uniqueDivisions).map((division) => ({
    value: division,
    label: division,
  }));

  // console.log("divisionOptions", divisionOptions);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by name..."
          value={
            (table.getColumn(searchName)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(searchName)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("paid") && (
          <DataTableFacetedFilterBoolean
            column={table.getColumn("paid")}
            title="Paid"
            options={paidOptions}
          />
        )}
        {table.getColumn("division_name") && (
          <DataTableFacetedFilter
            column={table.getColumn("division_name")}
            title="Division"
            options={divisionOptions}
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
      <DataTableViewOptions table={table} columnHeaders={columnHeadersArray} tableId={"manage-events"}/>
    </div>
  );
}
