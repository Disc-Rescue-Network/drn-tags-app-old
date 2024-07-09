"use client";

import * as React from "react";
import { NextPage } from "next";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EventForm from "@/app/admin/components/eventForm";
import { TagsEvent } from "@/app/types";
import EditEventForm from "./editEventForm";
import { TAGS_API_BASE_URL } from "@/app/networking/apiExports";
import axios from "axios";

const EditEvent = ({ params }: { params: { event_id: string } }) => {
  const { isLoading, isAuthenticated, user } = useKindeBrowserClient();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<TagsEvent | null>(null);
  const event_id = params.event_id;

  const fetchEvent = async () => {
    setLoading(true);
    // console.log("fetching event", event_id);
    const response = await axios.get(
      `${TAGS_API_BASE_URL}/api/events/${event_id}`
    );
    // console.log("response", response.data);
    setEvent(response.data);
    setLoading(false);
    //TODO: add check for whether the event is live
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  // console.log(event);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user || !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading && !user) return <div>Loading...</div>;

  return (
    <div className="grid h-full max-h-80 w-full text-center items-start">
      {isAuthenticated && user ? (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex">
            <h1 className="text-lg font-semibold md:text-2xl">Admin Tools</h1>
          </div>
          <div
            className="flex flex-1 w-full m-auto h-full gap-4 items-center justify-center rounded-lg border border-dashed shadow-sm p-4 bg-muted/20 flex-col md:flex-row md:gap-8 md:items-start md:justify-start md:gap-8 md:p-8"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="relative flex-col items-start text-left justify-start gap-8 md:flex">
              {event && <EditEventForm params={{ event }} />}
            </div>
          </div>
        </div>
      ) : (
        <>Unauthenticated. Redirecting to home page...</>
      )}
    </div>
  );
};

export default EditEvent;
