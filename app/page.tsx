"use client";

import type { NextPage } from "next";
import Leaderboard from "./components/Leaderboard";

const Home: NextPage = () => {
  return (
    <div className="grid min-h-screen w-full text-left items-start gap-4 p-4 lg:gap-6 lg:p-6">
      <Leaderboard />
    </div>
  );
};

export default Home;
