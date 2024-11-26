"use client";
import { Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { ScrollArea } from "../ui/scroll-area";
import { useAction } from "convex/react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

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
  const [isOpen, setIsOpen] = useState(false);

  const handleRunSchedules = async () => {
    try {
      setLoading(true);
      const response = await runSchedules();
      setScheduleResponse(response);
      setIsOpen(true);
      toast.success("Schedules run successfully");
    } catch (error) {
      toast.error("Error running schedules");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Schedule Results</DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[500px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>League</TableHead>
                  <TableHead className="text-right">ESPN Games</TableHead>
                  <TableHead className="text-right">
                    Existing Matchups
                  </TableHead>
                  <TableHead className="text-right">Updated</TableHead>
                  <TableHead className="text-right">New Matchups</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(scheduleResponse).map(([league, data]) => (
                  <TableRow key={league}>
                    <TableCell className="font-medium">{league}</TableCell>
                    <TableCell className="text-right">
                      {data.gamesOnSchedule}
                    </TableCell>
                    <TableCell className="text-right">
                      {data.existingMatchups}
                    </TableCell>
                    <TableCell className="text-right">
                      {data.matchupsUpdated}
                    </TableCell>
                    <TableCell className="text-right">
                      {data.scoreMatchupsCreated}
                    </TableCell>
                    <TableCell>
                      {data.error ? (
                        <span className="text-red-500 text-sm">
                          {data.error}
                        </span>
                      ) : (
                        <span className="text-green-500 text-sm">Success</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
