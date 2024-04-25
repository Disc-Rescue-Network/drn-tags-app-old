"use client";
import * as React from "react";
import { NextPage } from "next";
import EventForm from "../components/eventForm";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CreateEvent: NextPage = () => {
  const { isLoading, isAuthenticated, user } = useKindeBrowserClient();

  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user || !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading && !user) return <div>Loading...</div>;

  const createEvent = () => {
    router.push("/admin/create-event");
  };

  return (
    <div className="grid h-full max-h-80 w-full text-center items-start">
      {isAuthenticated && user ? (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex">
            <h1 className="text-lg font-semibold md:text-2xl">Admin Tools</h1>
          </div>
          <div
            className="flex flex-1 w-full m-auto h-full gap-4 items-center justify-center rounded-lg border border-dashed shadow-sm p-8 bg-muted/20 flex-col md:flex-row md:gap-8 md:items-start md:justify-start md:gap-8 md:p-8"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="relative hidden flex-col items-start text-left justify-start gap-8 md:flex">
              <EventForm />
            </div>
          </div>
        </div>
      ) : (
        <>Unauthenticated. Redirecting to home page...</>
      )}
    </div>
  );
};

export default CreateEvent;
