"use client";

import type { NextPage } from "next";

const Home: NextPage = () => {
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
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              No events running right now
            </h3>
            <p className="text-sm text-muted-foreground">
              Check back later when the admin has started an event.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
