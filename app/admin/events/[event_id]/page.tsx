"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CheckInData, Division, TagsEvent } from "@/app/types";
import { TAGS_API_BASE_URL } from "@/app/networking/apiExports";
import { Label } from "@/components/ui/label";
import { format, set } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Check,
  CircleDashed,
  Handshake,
  MoreHorizontal,
  Pencil,
  Undo,
  ShieldAlert,
  X,
} from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// import { columns } from "./columns";
import * as React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
  sortingFns,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/app/components/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditCheckInForm, { EditCheckInFormProps } from "./editCheckInForm";
import { DataTableManageEvent } from "./DataTableManageEvent";

// Helper function to enrich players with division names
function enrichPlayersWithDivisionNames(
  players: CheckInData[],
  divisions: Division[]
) {
  return players.map((player) => {
    const division = divisions.find(
      (d) => d.division_id === player.division_id
    );
    return {
      ...player,
      division_name: division ? division.name : "Unknown Division",
    };
  });
}

export interface PlayersWithDivisions {
  division_name: string;
  checkInId: number;
  udisc_display_name: string;
  tagIn: number;
  tagOut: number | null;
  place: number | null;
  pointsScored: number | null;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
  kinde_id: string;
  event_id: number;
  division_id: number;
}

const EventPage = ({ params }: { params: { event_id: string } }) => {
  const [event, setEvent] = useState<TagsEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const event_id = params.event_id;
  const { isLoading, isAuthenticated, user } = useKindeBrowserClient();

  const [playersWithDivisions, setPlayersWithDivisions] = useState<
    PlayersWithDivisions[]
  >([]);

  useEffect(() => {
    const enrichedPlayers = enrichPlayersWithDivisionNames(
      event?.CheckedInPlayers || [], // Add null check and default value
      event?.Divisions || [] // Add null check and default value
    );

    setPlayersWithDivisions(enrichedPlayers);
  }, [event]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const statuses = [
    {
      value: false,
      label: "Not Paid",
      icon: ShieldAlert,
    },
    {
      value: true,
      label: "Paid",
      icon: Check,
    },
  ];

  const columns: ColumnDef<PlayersWithDivisions>[] = [
    {
      accessorKey: "udisc_display_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Player" />
      ),
      enableSorting: true,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "division_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Division" />
      ),
      enableSorting: true,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "tagIn",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tag In" />
      ),
      enableSorting: true,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "paid",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Paid" />
      ),
      cell: ({ row }) => {
        const status = statuses.find(
          (status) => status.value === row.getValue("paid")
        );

        if (!status) {
          return null;
        }
        return row.original.paid ? (
          <div className="text-xs flex flex-row gap-2">
            <Check className="w-4 h-4" />
            <Label className="text-sm">Paid</Label>
          </div>
        ) : (
          <div className="text-xs flex flex-row gap-2">
            <CircleDashed className="w-4 h-4" />
            <Label className="text-sm">Not Paid</Label>
          </div>
        );
      },

      filterFn: (row, id, value) => {
        console.log("Filtering:", {
          rowValue: row.getValue(id),
          filterValue: value,
        });
        return value.includes(row.getValue(id));
      },
      enableSorting: true,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const player = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => editCheckIn(player)}>
                <div className="flex flex-row gap-2 justify-center items-center">
                  <Pencil className="w-4 h-4" /> Edit Check In
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => markAsPaid(player.checkInId)}>
                {player.paid ? (
                  <div className="flex flex-row gap-2 justify-center items-center">
                    <Undo className="w-4 h-4" /> Revert to Unpaid
                  </div>
                ) : (
                  <div className="flex flex-row gap-2 justify-center items-center">
                    <Handshake className="w-4 h-4" /> Mark as Paid
                  </div>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => removeFromQueue(player.checkInId)}
              >
                <div className="flex flex-row gap-2 justify-center items-center">
                  <X className="w-4 h-4" /> Delete Check In
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const router = useRouter();

  useEffect(() => {
    if (isLoading || loading) return;
    if (!user || !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, user, router, loading]);

  const fetchEvent = async () => {
    setLoading(true);
    console.log("fetching event", event_id);
    const response = await axios.get(
      `${TAGS_API_BASE_URL}/api/events/${event_id}`
    );
    console.log("response", response.data);
    setEvent(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  async function markAsPaid(checkInId: number) {
    try {
      setLoading(true);
      console.log("marking as paid", checkInId);
      const response = await axios.put(
        `${TAGS_API_BASE_URL}/api/player-check-in/pay/${checkInId}`,
        {},
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("response", response.data);
      const result = (await response.data) as PlayersWithDivisions;

      if (response.status !== 200) {
        toast({
          title: "Error",
          description: "Failed to mark as paid",
          variant: "destructive",
          duration: 3000,
        });
        console.log("Failed to mark as paid", response.data);
        setLoading(false);
        return;
      }

      if (result.paid === false) {
        toast({
          title: "Success",
          description: "Payment reverted to unpaid",
          variant: "default",
          duration: 3000,
        });
      } else {
        toast({
          title: "Success",
          description: "Player marked as paid",
          variant: "default",
          duration: 3000,
        });
      }

      // Update the "paid" variable in the CheckedInPlayers array
      const updatedPlayers = event!.CheckedInPlayers!.map((player) =>
        player.checkInId === checkInId
          ? { ...player, paid: result.paid }
          : player
      );

      // Update the event state
      setEvent({
        ...event!,
        CheckedInPlayers: updatedPlayers,
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function removeFromQueue(checkInId: number) {
    try {
      console.log("removing from queue", checkInId);
      setLoading(true);
      const response = await axios.delete(
        `${TAGS_API_BASE_URL}/api/player-check-in/${checkInId}`,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("response", response.data);

      if (response.status !== 200) {
        toast({
          title: "Error",
          description: "Failed to remove player from event",
          variant: "destructive",
          duration: 3000,
        });
        console.log("Failed to remove player from event", response.data);
        setLoading(false);
        return;
      }

      toast({
        title: "Success",
        description: "Player removed from event",
        variant: "default",
        duration: 3000,
      });

      // Remove the player from the CheckedInPlayers array
      const updatedPlayers = event!.CheckedInPlayers!.filter(
        (player) => player.checkInId !== checkInId
      );

      // Update the event state
      setEvent({ ...event!, CheckedInPlayers: updatedPlayers });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const [editCheckInStarted, setEditCheckInStarted] = useState(false);
  const [idToEdit, setIdToEdit] = useState<number | null>(null);
  const [editedPlayerDetails, setEditedPlayerDetails] =
    useState<PlayersWithDivisions>();

  async function editCheckIn(player: PlayersWithDivisions) {
    console.log("would edit record for player: ", player);
    setEditCheckInStarted(true);
    setEditedPlayerDetails(player);
    setIdToEdit(player.checkInId);
  }

  if (!event) {
    return <div>Loading...</div>;
  }

  const submitEditedCheckIn = async (formData: PlayersWithDivisions) => {
    console.log("Editing check-in player...");
    console.log("before: ", editedPlayerDetails);
    console.log("after: ", formData);

    try {
      const response = await fetch(
        `${TAGS_API_BASE_URL}/api/player-check-in/${formData.checkInId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Edit of Check-in successful:", data);
      toast({
        variant: "default",
        title: "Edit successful",
        description: "You have been successfully edited the check-in.",
        duration: 3000,
      });
      fetchEvent();

      return data; // Handle success
    } catch (error: any) {
      console.error("Failed to edit the check in:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to edit the check in. Please try again later.",
        duration: 3000,
      });
    }
  };

  return (
    <>
      {isAuthenticated && user ? (
        <div className="grid gap-4 p-8">
          <Label className="text-2xl">League: {event.leagueName}</Label>
          <Label className="text-2xl">Name: {event.eventName}</Label>
          <Label className="text-2xl">
            Date: {format(new Date(event.dateTime), "Pp")}
          </Label>{" "}
          <DataTableManageEvent columns={columns} data={playersWithDivisions} />
        </div>
      ) : (
        <>Unauthenticated. Redirecting to home page...</>
      )}

      {editCheckInStarted && (
        <EditCheckInForm
          player={editedPlayerDetails!}
          editCheckInStarted={editCheckInStarted}
          onSubmit={submitEditedCheckIn}
          onClose={() => setEditCheckInStarted(false)}
        />
      )}
    </>
  );
};

export default EventPage;
