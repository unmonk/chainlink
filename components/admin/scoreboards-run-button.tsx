"use client";
import { Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { ScrollArea } from "../ui/scroll-area";
import { useQuery, useAction } from "convex/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ScoreboardsRunButton() {
  const runScoreboards = useAction(api.scoreboards.scoreboards);
  const [scoreboardResponse, setScoreboardResponse] = useState<
    Record<
      string,
      {
        fetchedEvents: number;
        fetchedMatchups: number;
        matchupsStarted: number;
        matchupsFinished: number;
        matchupsUpdated: number;
        message: string;
        games: { game: string; result: string }[];
      }
    >
  >({});
  const [loading, setLoading] = useState(false);

  const handleRunSchedules = async () => {
    try {
      setLoading(true);
      const response = await runScoreboards();
      setScoreboardResponse(response);
      toast.success("Scoreboards run successfully");
    } catch (error) {
      toast.error("Error running scoreboards");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleRunSchedules}
          disabled={loading}
          variant="destructive"
        >
          {loading ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin mr-2" /> Running...
            </>
          ) : (
            "RUN SCORE UPDATES"
          )}
        </Button>

        <ScrollArea className="max-h-[500px]">
          {Object.keys(scoreboardResponse).map((league) => (
            <div key={league}>
              <h3 className="text-lg font-semibold">
                {league}{" "}
                <span className="text-sm text-muted-foreground">
                  {scoreboardResponse[league].message}
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2 mb-4">
                <div
                  className={cn(
                    "p-3 bg-muted rounded-lg",
                    scoreboardResponse[league].fetchedEvents === 0
                      ? "opacity-30"
                      : ""
                  )}
                >
                  <div className="text-sm text-muted-foreground">From ESPN</div>
                  <div className="text-lg font-medium">
                    {scoreboardResponse[league].fetchedEvents}
                  </div>
                </div>
                <div
                  className={cn(
                    "p-3 bg-muted rounded-lg",
                    scoreboardResponse[league].fetchedMatchups === 0
                      ? "opacity-30"
                      : ""
                  )}
                >
                  <div className="text-sm text-muted-foreground">Matchups</div>
                  <div className="text-lg font-medium">
                    {scoreboardResponse[league].fetchedMatchups}
                  </div>
                </div>
                <div
                  className={cn(
                    "p-3 bg-muted rounded-lg",
                    scoreboardResponse[league].matchupsStarted === 0
                      ? "opacity-30"
                      : ""
                  )}
                >
                  <div className="text-sm text-muted-foreground">Started</div>
                  <div className="text-lg font-medium">
                    {scoreboardResponse[league].matchupsStarted}
                  </div>
                </div>
                <div
                  className={cn(
                    "p-3 bg-muted rounded-lg",
                    scoreboardResponse[league].matchupsUpdated === 0
                      ? "opacity-30"
                      : ""
                  )}
                >
                  <div className="text-sm text-muted-foreground">Updated</div>
                  <div className="text-lg font-medium">
                    {scoreboardResponse[league].matchupsUpdated}
                  </div>
                </div>
                <div
                  className={cn(
                    "p-3 bg-muted rounded-lg",
                    scoreboardResponse[league].matchupsFinished === 0
                      ? "opacity-30"
                      : ""
                  )}
                >
                  <div className="text-sm text-muted-foreground">Finished</div>
                  <div className="text-lg font-medium">
                    {scoreboardResponse[league].matchupsFinished}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
