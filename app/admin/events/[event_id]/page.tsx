"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { TagsEvent } from "@/app/types";
import { TAGS_API_BASE_URL } from "@/app/networking/apiExports";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
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
import { Check } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const EventPage = ({ params }: { params: { event_id: string } }) => {
  const [event, setEvent] = useState<TagsEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const event_id = params.event_id;
  const { isLoading, isAuthenticated, user } = useKindeBrowserClient();

  const router = useRouter();

  useEffect(() => {
    if (isLoading || loading) return;
    if (!user || !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, user, router, loading]);

  useEffect(() => {
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

    fetchEvent();
  }, []);

  async function markAsPaid(event_id: number, kinde_id: string) {
    try {
      setLoading(true);
      console.log("marking as paid", event_id, kinde_id);
      const response = await axios.put(
        `${TAGS_API_BASE_URL}/api/player-check-in/pay`,
        { kinde_id: kinde_id, event_id: event_id },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("response", response.data);

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

      toast({
        title: "Success",
        description: "Player marked as paid",
        variant: "default",
        duration: 3000,
      });

      // Update the "paid" variable in the CheckedInPlayers array
      const updatedPlayers = event!.CheckedInPlayers!.map((player) =>
        player.kinde_id === kinde_id ? { ...player, paid: true } : player
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
      console.log("marking as paid", checkInId);
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

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isAuthenticated && user ? (
        <div className="grid gap-4 p-8">
          <Label className="text-2xl">League: {event.leagueName}</Label>
          <Label className="text-2xl">Name: {event.eventName}</Label>
          <Label className="text-2xl">
            Date: {format(new Date(event.dateTime), "Pp")}
          </Label>{" "}
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Division</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {event.CheckedInPlayers && event.CheckedInPlayers.length > 0 ? (
                event.CheckedInPlayers.map((player) => {
                  const division = event.Divisions.find(
                    (div) => div.division_id === player.division_id
                  );

                  return (
                    <TableRow key={player.kinde_id}>
                      <TableCell>{division!.name}</TableCell>
                      <TableCell>{player.udisc_display_name}</TableCell>
                      <TableCell>
                        {player.paid ? (
                          <div className="text-xs flex flex-row gap-2">
                            <Check className="w-4 h-4" />
                            <Label className="text-sm">Paid</Label>
                          </div>
                        ) : (
                          <Button
                            onClick={() =>
                              markAsPaid(event.event_id, player.kinde_id)
                            }
                          >
                            Mark as Paid
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() => removeFromQueue(player.checkInId)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Label>No check ins yet.</Label>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <>Unauthenticated. Redirecting to home page...</>
      )}
    </>
  );
};

export default EventPage;
