"use client";

import LeaderboardAdmin from "@/app/components/LeaderboardAdmin";
import type { NextPage } from "next";

const TagsAdmin: NextPage = () => {
  return (
    <div className="grid h-full max-h-80 w-full text-left items-start">
      <LeaderboardAdmin />
    </div>
  );
};

export default TagsAdmin;
