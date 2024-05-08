"use client";

import { NextPage } from "next";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LiveStandings from "../components/LiveStandings";
import { useForm } from "react-hook-form";
import { SuggestionFormData } from "../types";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const AdminTools: NextPage = () => {
  const { isLoading, isAuthenticated, user } = useKindeBrowserClient();

  const router = useRouter();
  const [showLiveScores, setShowLiveScores] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SuggestionFormData>();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

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

  const onSubmit = (data: SuggestionFormData) => {
    console.log(data);
    const subject = encodeURIComponent("Suggestion for Tags App");
    const body = encodeURIComponent(
      data.suggestion + "\n\nSubmitted by: " + user?.email + "\n\n"
    );

    if (isMobile) {
      window.location.href = `mailto:support@discrescuenetwork.com?subject=${subject}&body=${body}`;
    } else {
      const mailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=support@discrescuenetwork.com&su=${subject}&body=${body}`;
      window.open(mailUrl, "_blank");
    }
    console.log("Submitted suggestion");
  };

  return (
    <div className="grid min-h-screen w-full text-center items-start">
      {isAuthenticated && user ? (
        <div className="flex flex-1 flex-col h-3/5 gap-4 p-4 lg:gap-6 lg:p-6">
          {/* <div className="flex flex-col w-full mt-4 mb-4 gap-4 text-left">
            <Button onClick={toggleShowLiveScores} className="w-[200px]">
              {showLiveScores ? "Hide Live Scores" : "Show Live Scores"}
            </Button>
            {showLiveScores && <LiveStandings />}
          </div> */}
          <div className="flex">
            <h1 className="text-lg font-semibold md:text-2xl">
              Admin Dashboard
            </h1>
          </div>
          <div
            className="flex flex-1 w-full m-auto h-full items-center justify-center rounded-lg border border-dashed shadow-sm p-8 bg-muted/20"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                No data to show yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Check back later when more data is available.
              </p>
            </div>
          </div>

          {/* {!showLiveScores && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full m-auto h-full gap-4 items-center justify-center rounded-lg border border-dashed shadow-sm p-8 bg-muted/20 flex-col md:flex-row md:gap-8 md:items-start md:justify-start md:p-8">
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
                    Want to edit the course layouts or divisions? Click here.
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
                  <Drawer>
                    <DrawerTrigger>
                      {" "}
                      <Button size="sm" variant="secondary">
                        Submit Suggestion
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Submit Suggestion</DrawerTitle>
                        <DrawerDescription>
                          Type your comments or suggestions here.
                        </DrawerDescription>
                      </DrawerHeader>
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        <div className="flex flex-col w-full p-4 items-center text-left justify-center gap-8 md:flex">
                          <Label className="block w-full">
                            <Textarea
                              {...register("suggestion", { required: true })}
                              className="form-textarea mt-1 mb-2 block w-full"
                              rows={3}
                              placeholder="Enter your suggestion"
                            />
                            {errors.suggestion && (
                              <span className="text-red-500">
                                This field is required
                              </span>
                            )}
                          </Label>
                        </div>
                        <DrawerFooter>
                          <Button type="submit">Submit</Button>
                          <DrawerClose>
                            <Button variant="outline">Cancel</Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </form>
                    </DrawerContent>
                  </Drawer>
                </CardContent>
              </Card>
            </div>
          )} */}
        </div>
      ) : (
        <>Unauthenticated. Redirecting to home page...</>
      )}
    </div>
  );
};

export default AdminTools;
