"use client";

import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { Event } from "../types";
import { TAGS_API_BASE_URL } from "../networking/apiExports";

const CheckIn: NextPage = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    console.log("Fetching events data...");
    // Fetch events data from your API
    fetch(`${TAGS_API_BASE_URL}/api/events`)
      .then((response) => {
        console.log(response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Fetched events data:", data);
        // Filter events that are in the future
        const futureEvents = data.filter(
          (event: Event) => new Date(event.date) > new Date()
        );
        console.log("Future events:", futureEvents);
        setEvents(futureEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  return (
    <div className="grid min-h-screen w-full text-center items-start">
      <main className="flex flex-1 flex-col h-3/5 gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex">
          <h1 className="text-lg font-semibold md:text-2xl">Check In</h1>
        </div>
        <div
          className="flex flex-1 w-full m-auto h-full items-center justify-center rounded-lg border border-dashed shadow-sm p-8 bg-muted/20"
          x-chunk="dashboard-02-chunk-1"
        >
          {events.length === 0 ? (
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                No events running right now
              </h3>
              <p className="text-sm text-muted-foreground">
                Check back later when the admin has started an event.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold">{event.eventName}</h2>
                  <p>Date: {event.date.toLocaleString()}</p>
                  <p>Time: {event.time}</p>
                  <p>Location: {event.location}</p>
                  <p>Format: {event.format}</p>
                  <p>Max Signups: {event.maxSignups}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CheckIn;
