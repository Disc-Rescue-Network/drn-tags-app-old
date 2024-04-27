"use client";

import { NextPage } from "next";
import { DatePickerWithPresets } from "../components/DatePickerWithPresets";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EventForm from "./components/eventForm";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LiveStandings from "../components/LiveStandings";

const AdminTools: NextPage = () => {
  const { isLoading, isAuthenticated, user } = useKindeBrowserClient();

  const router = useRouter();
  const [showLiveScores, setShowLiveScores] = useState(false);

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

  const toggleShowLiveScores = () => {
    setShowLiveScores(!showLiveScores);
  };

  const goToCourseSettings = () => {
    router.push("/admin/course-settings");
  };

  return (
    <div className="grid h-full max-h-80 w-full text-center items-start">
      {isAuthenticated && user ? (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex">
            <h1 className="text-lg font-semibold md:text-2xl">Admin Tools</h1>
          </div>
          <div className="flex flex-col w-full mt-4 mb-4 gap-4 text-left">
            <Button onClick={toggleShowLiveScores} className="w-[200px]">
              {showLiveScores ? "Hide Live Scores" : "Show Live Scores"}
            </Button>
            {showLiveScores && <LiveStandings />}
          </div>

          {!showLiveScores && (
            <div
              className="flex flex-1 w-full m-auto h-full gap-4 items-center justify-center rounded-lg border border-dashed shadow-sm p-8 bg-muted/20 flex-col md:flex-row md:gap-8 md:items-start md:justify-start md:gap-8 md:p-8"
              x-chunk="dashboard-02-chunk-1"
            >
              <Card className="text-left">
                <CardHeader>
                  <CardTitle>Create Event</CardTitle>
                  <CardDescription>
                    Hosting a tags event? Create a new event here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div></div>
                  <Button size="sm" variant="secondary" onClick={createEvent}>
                    Create Event
                  </Button>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardHeader>
                  <CardTitle>Course Settings</CardTitle>
                  <CardDescription>
                    Want to edit the course layouts for your events? Maybe your
                    venmo username? Do it all here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div></div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={goToCourseSettings}
                  >
                    Configure
                  </Button>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardHeader>
                  <CardTitle>Feedback</CardTitle>
                  <CardDescription>
                    Have suggestions for the site? Let us know here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div></div>
                  <Button size="sm" variant="secondary">
                    Submit Suggestion
                  </Button>
                </CardContent>
              </Card>

              {/* <div className="relative hidden flex-col items-start text-left justify-start gap-8 md:flex">
              <EventForm />
            </div> */}
            </div>
          )}
        </div>
      ) : (
        <>Unauthenticated. Redirecting to home page...</>
      )}
    </div>
  );
};

export default AdminTools;
