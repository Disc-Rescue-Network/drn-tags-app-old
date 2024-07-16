"use client";

import LeaderboardAdmin from "@/app/components/LeaderboardAdmin";
import type { NextPage } from "next";

const TagsAdmin: NextPage = () => {
  return (
    <div className="grid min-h-screen w-full text-left items-start gap-4 p-4 lg:gap-6 lg:p-6">
      <LeaderboardAdmin />
    </div>
  );
};

export default TagsAdmin;
