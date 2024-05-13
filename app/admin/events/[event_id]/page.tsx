"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CheckInData, Division, HoleModel, TagsEvent } from "@/app/types";
import { TAGS_API_BASE_URL } from "@/app/networking/apiExports";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import MultiSelectFormField from "@/components/ui/multi-select";
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
  Map,
  MapPin,
  User,
  Info,
  ListChecks,
  ListFilter,
  ChevronDown,
} from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// import { columns } from "./columns";
import * as React from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@radix-ui/react-progress";
import EndedLabel from "@/app/components/EndedLabel";
import LiveLabel from "@/app/components/LiveLabel";
import { Badge } from "@/components/ui/badge";
import { CardModel } from "../../../types/index";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FaRegCircle } from "react-icons/fa";

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
  label: string;
}

const EventPage = ({ params }: { params: { event_id: string } }) => {
  const [event, setEvent] = useState<TagsEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const event_id = params.event_id;
  const { isLoading, isAuthenticated, user, organization } =
    useKindeBrowserClient();

  const [playersWithDivisions, setPlayersWithDivisions] = useState<
    PlayersWithDivisions[]
  >([]);
  const [cards, setCards] = useState<CardModel[]>([]);
  const [holesToAvoid, setHolesToAvoid] = useState<number[]>([]);

  interface FormData {
    holesToAvoidForm: string[];
  }

  const holesToAvoidTmp = [
    {
      value: "1",
      label: "Hole 1",
      icon: null,
    },
    {
      value: "2",
      label: "Hole 2",
      icon: null,
    },
    {
      value: "3",
      label: "Hole 3",
      icon: null,
    },
    {
      value: "4",
      label: "Hole 4",
      icon: null,
    },
    {
      value: "5",
      label: "Hole 5",
      icon: null,
    },
    {
      value: "6",
      label: "Hole 6",
      icon: null,
    },
    {
      value: "7",
      label: "Hole 7",
      icon: null,
    },
    {
      value: "8",
      label: "Hole 8",
      icon: null,
    },
    {
      value: "9",
      label: "Hole 9",
      icon: null,
    },
    {
      value: "10",
      label: "Hole 10",
      icon: null,
    },
    {
      value: "11",
      label: "Hole 11",
      icon: null,
    },
    {
      value: "12",
      label: "Hole 12",
      icon: null,
    },
    {
      value: "13",
      label: "Hole 13",
      icon: null,
    },
    {
      value: "14",
      label: "Hole 14",
      icon: null,
    },
    {
      value: "15",
      label: "Hole 15",
      icon: null,
    },
    {
      value: "16",
      label: "Hole 16",
      icon: null,
    },
    {
      value: "17",
      label: "Hole 17",
      icon: null,
    },
    {
      value: "18",
      label: "Hole 18",
      icon: null,
    },
  ];

  const FormSchema = z.object({
    holesToAvoidForm: z.array(z.string().min(1)),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      holesToAvoidForm: holesToAvoid.map((hole) => hole.toString()),
    },
  });

  const onSubmit = (data: FormData) => {
    setHolesToAvoid(data.holesToAvoidForm.map((hole) => parseInt(hole)));
    toast({
      title: "Success",
      description: "Holes to avoid have been updated.",
      variant: "default",
      duration: 3000,
    });
  };

  async function fetchSettingsData() {
    if (!organization) {
      console.error("Organization not found");
      return null;
    }

    console.log("Fetching settings data...");
    try {
      const response = await fetch(
        `${TAGS_API_BASE_URL}/api/fetch-course-settings/${organization}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch settings data");
      }
      console.log("Settings data fetched successfully");
      const data = await response.json();
      console.log("Settings data:", data);
      return data; // Return the fetched settings data
    } catch (error) {
      console.error("Error fetching settings data:", error);
      return null;
    }
  }

  // Use useEffect to fetch settings data when the component mounts
  useEffect(() => {
    // Fetch settings data
    fetchSettingsData()
      .then((settingsData) => {
        // Extract relevant fields from settingsData to prepopulate the form
        console.log("Settings data:", settingsData);
        const holesToAvoidTmp = settingsData.holes.filter(
          (hole: HoleModel) => !hole.active
        );
        console.log("Holes to avoid:", holesToAvoidTmp);
        setHolesToAvoid(
          holesToAvoidTmp.map((hole: HoleModel) => hole.hole_number)
        );
        const holesToAvoidNumbers = holesToAvoidTmp
          .map((hole: HoleModel) => hole.hole_number)
          .sort((a, b) => a - b);
        form.reset({
          holesToAvoidForm: holesToAvoidNumbers.map((hole: number) =>
            hole.toString()
          ),
        });
      })
      .catch((error) => {
        console.error("Error setting default values:", error);
      });
  }, [organization]);

  useEffect(() => {
    const enrichedPlayers = enrichPlayersWithDivisionNames(
      event?.CheckedInPlayers || [], // Add null check and default value
      event?.Divisions || [] // Add null check and default value
    ).map((player) => ({
      ...player,
      label: player.paid ? "paid" : "unpaid",
    }));

    setPlayersWithDivisions(enrichedPlayers);
  }, [event]);

  const fetchCurrentCards = async () => {
    try {
      const response = await axios.get(
        `${TAGS_API_BASE_URL}/api/events/${event?.event_id}/cards`
      );
      console.log("Response status:", response.status);
      if (response.status >= 200 && response.status < 300) {
        console.log("Cards retrieved successfully:", response.data);
        const cards = response.data as CardModel[];
        const numberOfPlayersInCards = cards.reduce(
          (count, card) => count + card.player_check_ins.length,
          0
        );
        if (numberOfPlayersInCards === playersWithDivisions.length) {
          console.log("Cards already exist for all players");
          setCards(cards);
          return true;
        }
        console.log("Cards exist but not for all players");
        return false;
      } else {
        console.log("Failed to retrieve cards:", response.data);
        return false;
      }
    } catch (error) {
      console.error("Error retrieving cards:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkForCurrentCards = async () => {
      if (playersWithDivisions.length > 0) {
        console.log("Players with divisions:", playersWithDivisions);
        console.log("checking for card creation...");
        const hasCards = await fetchCurrentCards();
        console.log("Has cards:", hasCards);
        if (!hasCards) {
          console.log("No cards found. Creating new cards...");
          startCardCreation();
        } else {
          console.log("Cards already exist. Skipping card creation...");
        }
      }
    };
    checkForCurrentCards();
  }, [playersWithDivisions]);

  useEffect(() => {
    startCardCreation(); //create new cards when holestoAvoid changes
  }, [holesToAvoid]);

  const startCardCreation = () => {
    const newCards = createCards(playersWithDivisions);
    console.log("New cards finalized:", newCards);
    const spacedCards = evenlySpaceCards(newCards, 18);
    console.log("Spaced cards finalized:", spacedCards);
    setCards(spacedCards);
    console.log("Cards set:", spacedCards);
  };

  const createCards = (players: PlayersWithDivisions[]): CardModel[] => {
    // Group players by division
    const playersByDivision: { [key: string]: PlayersWithDivisions[] } =
      players.reduce((acc, player) => {
        if (!acc[player.division_name]) {
          acc[player.division_name] = [];
        }
        acc[player.division_name].push(player);
        return acc;
      }, {} as { [key: string]: PlayersWithDivisions[] });

    // Log the total number of players
    const totalPlayersBeginning = players.length;
    console.log("BEGIN: Total number of players:", totalPlayersBeginning);

    const allCards: CardModel[] = [];
    let remainingPlayers: PlayersWithDivisions[] = [];

    Object.values(playersByDivision).forEach((divisionPlayers) => {
      // Shuffle players within the division
      const shuffledPlayers = shuffleArray(divisionPlayers);

      // Create cards for the division
      const { cards, remaining } = createDivisionCards(
        shuffledPlayers,
        divisionPlayers[0].event_id
      );

      console.log("Division cards:", cards);
      console.log("Remaining players:", remaining);

      allCards.push(...cards);
      remainingPlayers.push(...remaining);
    });

    // Try to create mixed division cards with remaining players
    while (remainingPlayers.length > 0) {
      const shuffledRemainingPlayers = shuffleArray(remainingPlayers);
      const { cards: mixedCards, remaining } = createDivisionCards(
        shuffledRemainingPlayers,
        remainingPlayers[0].event_id
      );
      allCards.push(...mixedCards);
      remainingPlayers = remaining;

      // If remaining players are less than 3 and we can't form a full card, break out to avoid an infinite loop
      if (remainingPlayers.length < 3) break;
    }

    const totalPlayers = allCards.reduce(
      (count, card) => count + card.player_check_ins.length,
      0
    );
    console.log("Total number of players:", totalPlayers);

    // Ensure no more than 18 cards
    if (allCards.length > 18) {
      const extraCards = allCards.splice(18);
      extraCards.forEach((card) => {
        card.player_check_ins.forEach((player) => {
          // Find a card with less than 4 players
          const targetCard = allCards.find(
            (c) => c.player_check_ins.length < 4
          );
          if (targetCard) {
            targetCard.player_check_ins.push(player);
          } else {
            // If no card has less than 4 players, add to the card with the fewest players
            const cardWithFewestPlayers = allCards.reduce((prev, curr) =>
              prev.player_check_ins.length < curr.player_check_ins.length
                ? prev
                : curr
            );
            cardWithFewestPlayers.player_check_ins.push(player);
          }
        });
      });
    }

    // Find missing player
    const initialCheckInIds = new Set(
      players.map((player) => player.checkInId)
    );
    const assignedCheckInIds = new Set(
      allCards.flatMap((card) =>
        card.player_check_ins.map((player) => player.checkInId)
      )
    );
    const missingCheckInIds = Array.from(initialCheckInIds).filter(
      (id) => !assignedCheckInIds.has(id)
    );

    console.log("Missing player checkInIds:", missingCheckInIds);

    if (missingCheckInIds.length > 0) {
      const missingPlayers = players.filter((player) =>
        missingCheckInIds.includes(player.checkInId)
      );
      console.log("Missing player details:", missingPlayers);

      // Add missing players to existing cards
      missingPlayers.forEach((player) => {
        // Find a card with less than 4 players
        const card = allCards.find((card) => card.player_check_ins.length < 4);
        if (card) {
          card.player_check_ins.push(player);
        } else {
          // If no card has less than 4 players, add to the card with the fewest players
          const cardWithFewestPlayers = allCards.reduce((prev, curr) =>
            prev.player_check_ins.length < curr.player_check_ins.length
              ? prev
              : curr
          );
          cardWithFewestPlayers.player_check_ins.push(player);
        }
      });
    }

    return allCards;
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const createDivisionCards = (
    players: PlayersWithDivisions[],
    eventId: number
  ): { cards: CardModel[]; remaining: PlayersWithDivisions[] } => {
    console.log("Creating division cards...");
    const divisionCards: CardModel[] = [];
    let card: CardModel = {
      card_id: null,
      starting_hole: 1,
      event_id: eventId,
      player_check_ins: [],
    };
    const remainingPlayers: PlayersWithDivisions[] = [];

    players.forEach((player, index) => {
      card.player_check_ins.push(player);

      if (
        card.player_check_ins.length === 4 ||
        (card.player_check_ins.length >= 3 && index === players.length - 1)
      ) {
        divisionCards.push(card);
        card = {
          card_id: null,
          starting_hole: 1,
          event_id: eventId,
          player_check_ins: [],
        };
      } else if (
        card.player_check_ins.length === 3 &&
        players.length - index - 1 < 3
      ) {
        divisionCards.push(card);
        card = {
          card_id: null,
          starting_hole: 1,
          event_id: eventId,
          player_check_ins: [],
        };
      }
    });

    // If there are remaining players that couldn't form a complete card, return them
    if (card.player_check_ins.length > 0) {
      remainingPlayers.push(
        ...card.player_check_ins.map(
          (mappedPlayer) =>
            players.find(
              (player) => player.checkInId === mappedPlayer.checkInId
            )!
        )
      );
    }

    console.log("Division cards:", divisionCards);
    return { cards: divisionCards, remaining: remainingPlayers };
  };

  const evenlySpaceCards = (
    cards: CardModel[],
    totalHoles: number
  ): CardModel[] => {
    console.log("Evenly spacing cards...");
    const spacedCards: CardModel[] = [];
    const usedHoles = new Set<number>();
    const numCards = cards.length;

    // Create an array of all holes
    const allHoles = Array.from({ length: totalHoles }, (_, i) => i + 1);

    // Calculate initial spacing and leftover holes
    const spacing = Math.floor(totalHoles / numCards);
    const leftoverHoles = totalHoles - spacing * numCards;

    let holeIndex = 0;
    let holesToUse = allHoles.filter((hole) => !holesToAvoid.includes(hole));

    for (let i = 0; i < numCards; i++) {
      console.log("Card index:", i);
      console.log("Holes to use:", holesToUse);
      console.log("Used holes:", usedHoles);

      // If we run out of preferred holes, reset to all holes
      if (holesToUse.length === 0) {
        holesToUse = allHoles;
      }

      // Find the next available hole
      let startingHole = holesToUse[holeIndex];

      // Ensure we skip any holes that are already used
      while (usedHoles.has(startingHole)) {
        console.log("Skipping hole:", startingHole);
        holeIndex = (holeIndex + 1) % holesToUse.length;
        startingHole = holesToUse[holeIndex];
      }

      // Check if startingHole is undefined and adjust accordingly
      if (startingHole == null) {
        console.log(
          "Starting hole is undefined, resetting to first available hole."
        );
        startingHole =
          holesToUse.find((hole) => !usedHoles.has(hole)) || holesToUse[0];
      }

      // Assign the next available hole to the card
      cards[i].starting_hole = startingHole;
      usedHoles.add(startingHole);
      spacedCards.push(cards[i]);

      // Adjust hole index for next card, adding extra spacing if possible
      holeIndex =
        (holeIndex + spacing + (i < leftoverHoles ? 1 : 0)) % holesToUse.length;

      // Remove the used hole from the list of holes to use
      holesToUse = holesToUse.filter((hole) => hole !== startingHole);
    }

    console.log("Spaced cards:", spacedCards);
    return spacedCards.sort((a, b) => a.starting_hole - b.starting_hole); // Ensure the cards are sorted by starting hole
  };

  const handleCreateCards = async () => {
    try {
      const response = await axios.post(`${TAGS_API_BASE_URL}/api/cards`, {
        cards,
      });
      console.log("Response status:", response.status);
      if (response.status >= 200 && response.status < 300) {
        console.log("Cards created successfully:", response.data);
        const cardsCreated = response.data as CardModel[];
        setCards(cardsCreated);
        toast({
          title: "Success",
          description: "Cards have been successfully created.",
          variant: "default",
          duration: 3000,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create cards.",
          variant: "destructive",
          duration: 3000,
        });
        console.log("Failed to create cards:", response.data);
      }
    } catch (error) {
      console.error("Error creating cards:", error);
      toast({
        title: "Error",
        description: "Failed to create cards.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

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

  // const labels = [
  //   {
  //     value: "paid",
  //     label: "Paid",
  //   },
  //   {
  //     value: "unpaid",
  //     label: "Not Paid",
  //   },
  // ];

  const columns: ColumnDef<PlayersWithDivisions>[] = [
    {
      accessorKey: "udisc_display_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Player" />
      ),
      cell: (info) => info.getValue(),
      enableSorting: true,
      // cell: ({ row }) => {
      //   const label = labels.find(
      //     (label) => label.value === row.original.label
      //   );

      //   if (!label) {
      //     return (
      //       <div className="flex space-x-2">
      //         <CircleDashed className="w-4 h-4" />
      //         <span className="max-w-[500px] truncate font-medium">
      //           {row.getValue("udisc_display_name")}
      //         </span>
      //       </div>
      //     );
      //   }

      //   return (
      //     <div className="flex space-x-2">
      //       {label.label === "Paid" ? (
      //         <span className="max-w-[500px] truncate font-medium flex flex-row gap-2">
      //           <Check className="w-4 h-4" />{" "}
      //           {row.getValue("udisc_display_name")}
      //         </span>
      //       ) : (
      //         <Badge variant="destructive">{label.label}</Badge>
      //       )}
      //     </div>
      //   );
      // },
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
  const [live, setLive] = useState<boolean>(false);

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
    //TODO: add check for whether the event is live
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  async function markAsPaid(checkInId: number) {
    try {
      setLoading(true);
      console.log("marking as paid", checkInId);
      fetch(`${TAGS_API_BASE_URL}/api/player-check-in/pay/${checkInId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            setLoading(false);
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Handle successful response from API
          console.log("response", data);
          const result = data as PlayersWithDivisions;
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
        })
        .catch((error) => {
          // Handle errors
          toast({
            title: "Error",
            description: `Failed to mark as paid - ${error}`,
            variant: "destructive",
            duration: 3000,
          });
          console.log("Failed to mark as paid", error);
          setLoading(false);
          return;
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function removeFromQueue(checkInId: number) {
    try {
      console.log("removing from queue", checkInId);
      setLoading(true);
      fetch(`${TAGS_API_BASE_URL}/api/player-check-in/${checkInId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            setLoading(false);
            toast({
              title: "Error",
              description: "Network response was not ok",
              variant: "destructive",
              duration: 3000,
            });
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Handle successful response from API
          console.log("response", data);
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
        });
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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      console.log("Window width:", window.innerWidth);
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        console.log("isMobile is true");
      } else {
        setIsMobile(false);
        console.log("isMobile is false");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [showCards, setShowCards] = useState(false);
  const totalHoles = 18; // Total number of holes on the course
  const usedHoles = new Set(cards.map((card) => card.starting_hole));

  const availableHoles: number[] = [];
  for (let i = 1; i <= totalHoles; i++) {
    if (!usedHoles.has(i)) {
      availableHoles.push(i);
    }
  }

  const handleHoleChange = (card: CardModel, newHole: number) => {
    const newHoleNumber = newHole;
    setCards(
      cards
        .map((c) => {
          if (c.starting_hole === card.starting_hole) {
            return { ...c, starting_hole: newHoleNumber };
          }
          if (newHoleNumber !== null && c.starting_hole === newHoleNumber) {
            return { ...c, starting_hole: card.starting_hole };
          }
          return c;
        })
        .sort((a, b) => a.starting_hole - b.starting_hole)
    );
    // Optionally, update the backend or state to persist changes
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <ScrollArea className="h-full w-full rounded-md border p-4">
      {isAuthenticated && user ? (
        <div className="grid gap-4 p-4">
          <Card className="text-left w-full" key={event.event_id}>
            <CardHeader className="p-4">
              <CardDescription
                className="text-balance leading-relaxed items-center flex flex-row justify-between w-full"
                style={{ gridTemplateColumns: "60% 40%" }}
              >
                {format(
                  new Date(event.dateTime),
                  isMobile ? "EEE, MMM d" : "EEEE, MMMM do"
                )}{" "}
                @ {format(new Date(event.dateTime), "h:mm a")}
                <Label className="flex flex-row gap-2 justify-center items-center">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </Label>
              </CardDescription>

              <CardTitle>{event.eventName}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 w-full justify-between items-start p-4">
              <div className="flex flex-row gap-1 items-center justify-start">
                <Map className="h-4 w-4" />
                <Label className="text-xs">{event.layout}</Label>
              </div>
              <div className="flex flex-row gap-1 items-center justify-start">
                <User className="h-4 w-4" />
                <Label className="text-xs">{event.format}</Label>
              </div>
              <div className="flex flex-row gap-1 w-full items-center justify-between">
                <div className="flex flex-row gap-1 items-center justify-start">
                  <ListChecks className="h-4 w-4" />
                  <Label className="text-xs">
                    {event.CheckedInPlayers!.length} / {event.maxSignups}{" "}
                    checked in
                  </Label>
                </div>
                {live ? <LiveLabel /> : <EndedLabel />}
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-4 mt-2 mb-2 items-left justify-start">
            <div className="flex flex-row justify-end items-center"></div>
            <Sheet>
              <SheetTrigger>
                <Button className="flex flex-row gap-4 m-auto">
                  Avoiding holes {holesToAvoid.sort((a, b) => a - b).join(", ")}
                  <ChevronDown />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={"right"}
                className="w-[400px] sm:w-[540px] flex flex-col"
              >
                <Card className="w-full max-w-2xl p-5">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <FormField
                        control={form.control}
                        name="holesToAvoidForm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Holes to Avoid</FormLabel>
                            <FormControl>
                              <MultiSelectFormField
                                options={holesToAvoidTmp}
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                placeholder="Select options"
                                variant="inverted"
                                animation={2}
                              />
                            </FormControl>
                            <FormDescription>
                              Choose the holes you want to try to avoid. It is
                              not always possible to avoid all of them.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button variant="outline" type="submit">
                        Submit
                      </Button>
                    </form>
                  </Form>
                </Card>
                {/* <Label>Holes to avoid:</Label>
                <select
                  multiple={true}
                  className="text-left min-h-80 rounded-sm text-sm bg-transparent"
                  onChange={(e) => toggleHole(Number(e.target.value))}
                >
                  {allHoles.map((hole) => (
                    <option
                      key={hole}
                      value={hole}
                      className="flex flex-row gap-2 items-center min-w-fit justify-start text-sm text-left"
                    >
                      {holesToAvoid.includes(hole) ? "✓" : ""} Hole {hole}
                    </option>
                  ))}
                </select> */}

                {/* <Label>
                  Holes to avoid:
                  <Select
                    // multiple={true}
                    onValueChange={(e) => toggleHole(Number(e))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select holes to avoid" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Holes To Avoid</SelectLabel>
                        <Separator />
                        {allHoles.map((hole) => (
                          <SelectItem key={hole} value={hole.toString()}>
                            {holesToAvoid.includes(hole) ? "✓" : ""} Hole {hole}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Label> */}
              </SheetContent>
            </Sheet>
            <Tabs defaultValue="CheckIns" className="w-full">
              <TabsList className="grid grid-cols-2 w-[400px] m-auto justify-center">
                <TabsTrigger value="CheckIns">Check ins</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
              </TabsList>
              <TabsContent value="cards">
                <Card className="w-full relative">
                  <CardHeader>
                    <CardTitle>Cards</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 pt-8 md:pt-0 pb-6 md:pb-24">
                    {cards.map((card) => (
                      <Card
                        className="flex flex-col items-center gap-4"
                        key={card.starting_hole}
                      >
                        <CardHeader className="w-full gap-4 flex flex-row justify-between items-center">
                          <CardTitle>Card {card.starting_hole}</CardTitle>
                          <CardDescription>
                            <Select
                              value={card.starting_hole.toString()}
                              onValueChange={(e) =>
                                handleHoleChange(card, parseInt(e))
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a hole" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Holes</SelectLabel>
                                  {Array.from(
                                    { length: totalHoles },
                                    (_, index) => index + 1
                                  )
                                    .sort((a, b) => a - b)
                                    .map((hole) => (
                                      <SelectItem
                                        key={hole}
                                        value={hole.toString()}
                                      >
                                        Hole {hole}
                                      </SelectItem>
                                    ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4 w-full text-left">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Player</TableHead>
                                <TableHead>Division</TableHead>
                                <TableHead>Tag In</TableHead>
                                {/* <TableHeaderCell>Paid</TableHeaderCell> */}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {card.player_check_ins.map((player) => (
                                <TableRow key={player.checkInId}>
                                  <TableCell>
                                    {player.udisc_display_name}
                                  </TableCell>
                                  <TableCell>{player.division_name}</TableCell>
                                  <TableCell>{player.tagIn}</TableCell>
                                  {/* <td>{player.paid ? "Paid" : "Not Paid"}</td> */}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          {/* <div className="grid gap-2">
                          {card.player_check_ins.map((player) => (
                            <p
                              key={player.checkInId}
                              className="text-sm text-muted-foreground"
                            >
                              {player.udisc_display_name} -{" "}
                              {player.division_name} (#{player.tagIn})
                            </p>
                          ))}
                        </div> */}
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      className={
                        isMobile
                          ? "absolute top-4 right-4 w-48"
                          : "absolute bottom-4 right-4 w-48"
                      }
                      onClick={startCardCreation}
                      variant="destructive"
                    >
                      Re-shuffle Cards
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="CheckIns">
                <DataTableManageEvent
                  columns={columns}
                  data={playersWithDivisions}
                />
              </TabsContent>
            </Tabs>
          </div>
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
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default EventPage;
