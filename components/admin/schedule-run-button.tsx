"use client";
import { Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery, useAction } from "convex/react";
import { toast } from "sonner";

export default function ScheduleRunButton() {
  const runSchedules = useAction(api.schedules.schedules);
  const [scheduleResponse, setScheduleResponse] = useState<
    Record<
      string,
      {
        error: string;
        scoreMatchupsCreated: number;
        statMatchupsCreated: number;
        matchupsFromDatabase: number;
        matchupsFromEspn: number;
        existingMatchups: number;
        matchupsUpdated: number;
        gamesOnSchedule: number;
        games: {
          game: string;
          result: string;
          details?: string;
        }[];
      }
    >
  >({});
  const [loading, setLoading] = useState(false);

  const handleRunSchedules = async () => {
    try {
      setLoading(true);
      const response = await runSchedules();
      setScheduleResponse(response);
      toast.success("Schedules run successfully");
    } catch (error) {
      toast.error("Error running schedules");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
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
          "RUN ESPN SCHEDULES"
        )}
      </Button>

      {Object.keys(scheduleResponse).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Schedule Response</h2>
          <ScrollArea className="h-[500px]">
            {Object.keys(scheduleResponse).map((league) => (
              <div key={league}>
                <h3 className="text-lg font-semibold">{league}</h3>
                {scheduleResponse[league].error && (
                  <p className="text-red-500">
                    {scheduleResponse[league].error}
                  </p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2 mb-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      ESPN Games
                    </div>
                    <div className="text-lg font-medium">
                      {scheduleResponse[league].gamesOnSchedule}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground"></div>
                    <div className="text-lg font-medium">
                      Existing Matchups
                      <span className="font-bold">
                        {scheduleResponse[league].existingMatchups}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Updated Info
                    </div>
                    <div className="text-lg font-medium">
                      {scheduleResponse[league].matchupsUpdated}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      New Matchups
                    </div>
                    <div className="text-lg font-medium">
                      {scheduleResponse[league].scoreMatchupsCreated}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
