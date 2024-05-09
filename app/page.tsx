"use client";

import type { NextPage } from "next";
import Leaderboard from "./components/leaderboard";

const Home: NextPage = () => {
  return (
    <div className="container mx-auto p-4 gap-4">
      <Leaderboard />
    </div>
  );
};

export default Home;
