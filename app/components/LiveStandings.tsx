"use client";

import React, { useEffect, useState } from "react";
import { Division, PlayerData } from "../types"; // Adjust the import path as needed
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "./Leaderboard.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LiveStandings: React.FC = ({}) => {
  const [data, setData] = useState<Division[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [inputValue, setInputValue] = useState("");

  const [fullURL, setFullUrl] = useState<string>("");

  const handleSubmit = async (url: string) => {
    setLoading(true);
    console.log("URL: ", url);
    const urlForReq = JSON.stringify({ url });
    console.log(urlForReq);
    try {
      const response = await fetch("http://127.0.0.1:5000/fetch_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: urlForReq,
      });
      if (!response.ok) throw new Error("Failed to start fetching");
      const result = await response.json();
      console.log(result.message); // "Fetching initiated"
      fetchResults(); // Function to periodically fetch results
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/data");
      const newData = await response.json();
      setData(newData);
      setLoading(false);
      // Check if all players are finished
      if (
        !newData.some((division: Division) =>
          division.Data.some((player: PlayerData) => player.THRU !== "F")
        )
      ) {
        console.log("All players finished. Stop fetching.");
      } else {
        setTimeout(fetchResults, 60000); // Continue fetching every minute
      }
    } catch (error) {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Tranquilty Tags Standings</CardTitle>
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
            {data.map((division) => (
              <div key={division.Division}>
                <h3>{division.Division}</h3>
                <ul>
                  {division.Data.map((player: PlayerData, index: number) => (
                    <li key={index}>
                      {player.POS} - {player.NAME} - {player.SCORE} -{" "}
                      {player.THRU}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveStandings;
