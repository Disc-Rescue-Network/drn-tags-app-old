"use client";

import React, { useEffect, useState } from "react";
import { Division, PlayerData, Event } from "../types"; // Adjust the import path as needed
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "./Leaderboard.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "./DataTable";
import { columns } from "./columns";
import { Progress } from "@/components/ui/progress";
import { MdFiberManualRecord } from "react-icons/md"; // This icon looks like a typical "live" indicator
import "./LiveStandings.css";
import EndedLabel from "./EndedLabel";
import LiveLabel from "./LiveLabel";
import { TAGS_API_BASE_URL } from "../networking/apiExports";
import { toast } from "@/components/ui/use-toast";

const LiveStandings: React.FC = ({}) => {
  const [data, setData] = useState<Division[]>([]);
  const [leagueName, setLeagueName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [live, setLive] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState("");

  const [fullURL, setFullUrl] = useState<string>("");

  useEffect(() => {
    setInterval(fetchResults, 60000); // Continue fetching every minute (change back to 6)
  }, []);

  const handleSubmit = async (url: string) => {
    setLoading(true);
    console.log("URL: ", url);
    const urlForReq = JSON.stringify({ url });
    console.log(urlForReq);
    try {
      const response = await fetch(`${TAGS_API_BASE_URL}/fetch_data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: urlForReq,
      });
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "There was an error fetching the data. Please try again later.",
          duration: 3000,
        });
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log(result.message); // "Fetching initiated"
      console.log("Result:", result.data); // You can display this in your UI (optional
      const event_info: Event = await result.data;
      console.log("Event Info:", event_info); // You can display this in your UI (optional
      console.log("League Name:", event_info.leagueName); // You can display this in your UI
      console.log("Divisions:", event_info.data); // You can display this in your UI
      if (event_info.data!.length === 0) {
        console.log("No data yet. Check back later.");
        return;
      }
      setData(event_info.data!);
      setLeagueName(event_info.leagueName!);
      setLoading(false);
      fetchResults(); // Function to periodically fetch results
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await fetch(`${TAGS_API_BASE_URL}/data`);
      const event_info: Event = await response.json();
      console.log("Event Info:", event_info); // You can display this in your UI (optional
      console.log("League Name:", event_info.leagueName); // You can display this in your UI
      console.log("Divisions:", event_info.data); // You can display this in your UI
      if (event_info.data!.length === 0) {
        console.log("No data yet. Check back later.");
        return;
      }
      setData(event_info.data!);
      setLeagueName(event_info.leagueName!);
      setLoading(false);
      setLive(true);

      // Check if all players are finished - this check is broken
      if (
        data.every((division: Division) =>
          division.division_data.every(
            (player: PlayerData) => player.THRU === "F"
          )
        )
      ) {
        console.log("All players finished. Stop fetching.");
        setLive(false);
      } else {
        setLive(true);
        // setTimeout(fetchResults, 60000); // Continue fetching every minute
      }
    } catch (error) {
      setLive(false);
      setLoading(false);
      console.error("Failed to fetch results:", error);
    }
  };

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       if (url === "") {
  //         return;
  //       }

  //       try {
  //         setLoading(true);
  //         const response = await fetch("http://127.0.0.1:5000/data");
  //         if (!response.ok) throw new Error("Network response was not ok");
  //         const data: Division[] = await response.json();
  //         setData(data);
  //         setLoading(false);
  //       } catch (err: any) {
  //         setError(err.message);
  //         setLoading(false);
  //       }
  //     };

  //     fetchData();

  //     // Optional: Set up a timer to re-fetch the data every minute
  //     const interval = setInterval(fetchData, 60000);
  //     return () => clearInterval(interval);
  //   }, [url]);

  //   const [progress, setProgress] = useState(0);

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       setProgress((oldProgress) => {
  //         if (oldProgress === 100) {
  //           clearInterval(interval);
  //           return 100;
  //         }
  //         return Math.min(oldProgress + 100 / (60 * 10), 100); // Increase the frequency of updates
  //       });
  //     }, 100); // Reduce the interval time

  //     return () => {
  //       clearInterval(interval);
  //     };
  //   }, []);

  //   if (loading)
  //     return (
  //       <>
  //         <p>Loading...</p>
  //         {/* <Progress value={progress} /> */}
  //       </>
  //     );
  if (error) return <p>Error: {error}</p>;

  return (
    <Card>
      <CardHeader style={{ position: "relative" }}>
        {leagueName && (
          <>
            <CardTitle>{leagueName}</CardTitle>
            {live ? <LiveLabel /> : <EndedLabel />}
          </>
        )}
      </CardHeader>
      <CardContent className="grid gap-8">
        {fullURL === "" ? (
          <div className="flex gap-2 w-3/4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter URL"
            />
            <Button
              type="submit"
              disabled={loading}
              onClick={(e) => {
                setFullUrl(inputValue);
                handleSubmit(inputValue);
                e.preventDefault();
              }}
            >
              Start Live Scoring
            </Button>
          </div>
        ) : (
          <>
            {data === undefined ? (
              <p>No scores yet - check back later</p>
            ) : (
              <>
                {data.map((division) => (
                  <div key={division.division}>
                    <h3>{division.division}</h3>
                    <DataTable
                      columns={columns}
                      data={division.division_data}
                    />
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveStandings;
