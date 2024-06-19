"use client";

import type { NextPage } from "next";
import Leaderboard from "./components/Leaderboard";

const Home: NextPage = () => {
  return (
    <div className="grid min-h-screen w-full text-left items-start">
      <main className="flex flex-1 min-h-96 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Leaderboard />
      </main>
    </div>
  );
};

export default Home;
