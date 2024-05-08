// import { DataTableColumnHeader } from "@/app/components/data-table-column-header";
// import { TAGS_API_BASE_URL } from "@/app/networking/apiExports";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Label } from "@/components/ui/label";
// import { toast } from "@/components/ui/use-toast";
// import { ColumnDef } from "@tanstack/react-table";
// import axios from "axios";
// import {
//   Check,
//   CircleDashed,
//   Handshake,
//   MoreHorizontal,
//   Pencil,
//   X,
// } from "lucide-react";
// import { FaArrowUp, FaArrowDown, FaCircle } from "react-icons/fa";

// export const columns: ColumnDef<PlayersWithDivisions>[] = [
//   {
//     accessorKey: "udisc_display_name",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Player" />
//     ),
//     enableSorting: true,
//     cell: (info) => info.getValue(),
//   },
//   {
//     accessorKey: "division_name",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Division" />
//     ),
//     enableSorting: true,
//     cell: (info) => info.getValue(),
//   },
//   {
//     accessorKey: "tagIn",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Tag In" />
//     ),
//     enableSorting: true,
//     cell: (info) => info.getValue(),
//   },
//   {
//     accessorKey: "paid",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Paid" />
//     ),
//     enableSorting: true,
//     cell: ({ row }) =>
//       row.original.paid ? (
//         <div className="text-xs flex flex-row gap-2">
//           <Check className="w-4 h-4" />
//           <Label className="text-sm">Paid</Label>
//         </div>
//       ) : (
//         <div className="text-xs flex flex-row gap-2">
//           <CircleDashed className="w-4 h-4" />
//           <Label className="text-sm">Not Paid</Label>
//         </div>
//       ),
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const player = row.original;

//       function editCheckIn(player: PlayersWithDivisions): void {
//         console.log("would edit record for player: ", player);
//       }

//       function deleteCheckIn(player: PlayersWithDivisions): void {
//         console.log("would delete record for player: ", player);
//       }

//       function markAsPaid(player: PlayersWithDivisions): void {
//         console.log("would mark as paid for player: ", player);
//       }

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem onClick={() => editCheckIn(player)}>
//               <div className="flex flex-row gap-2 justify-center items-center">
//                 <Pencil className="w-4 h-4" /> Edit Check In
//               </div>
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => markAsPaid(player)}>
//               <div className="flex flex-row gap-2 justify-center items-center">
//                 <Handshake className="w-4 h-4" /> Mark as Paid
//               </div>
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={() => deleteCheckIn(player)}>
//               <div className="flex flex-row gap-2 justify-center items-center">
//                 <X className="w-4 h-4" /> Delete Check In
//               </div>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
// ];

export const columnHeadersArray: { [key: string]: string } = {
  udisc_display_name: "Player",
  division_name: "Division",
  tagIn: "Tag In",
  paid: "Paid",
};
