"use client";
import { useAction, useQuery } from "convex/react";
import { api, internal } from "@/convex/_generated/api";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import Loading from "../ui/loading";
import { Loader2Icon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";

interface ScheduledMessage {
  _id: string;
  _creationTime: number;
  name: string;
  scheduledTime: number;
  completedTime?: number;
  state: {
    kind: string;
  };
  args: any[];
}

export default function AdminActions() {
  const scheduledMessages = useQuery(api.utils.listScheduledMessages);
  const runSchedules = useAction(api.schedules.schedules);
  const [loading, setLoading] = useState(false);

  const handleRunSchedules = async () => {
    try {
      setLoading(true);
      await runSchedules();
      toast.success("Schedules run successfully");
    } catch (error) {
      toast.error("Error running schedules");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Actions</h2>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleRunSchedules} disabled={loading}>
          {loading ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin mr-2" /> Running...
            </>
          ) : (
            "RUN ESPN SCHEDULES"
          )}
        </Button>
      </div>

      <h2 className="text-xl font-semibold">Service Messages</h2>

      {scheduledMessages && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Function Name</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduledMessages.map((message: ScheduledMessage) => (
              <TableRow key={message._id}>
                <TableCell>
                  <Badge variant={"outline"}>
                    {message.name.split(".js:")[1]}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Textarea
                    value={JSON.stringify(message.args)}
                    className="max-h-24"
                    readOnly
                  />
                </TableCell>
                <TableCell>{message.name.split(".js")[0]}</TableCell>
                <TableCell>
                  <span
                    className={`capitalize ${
                      message.state.kind === "success"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {message.state.kind}
                  </span>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(message._creationTime)} ago
                </TableCell>
                <TableCell>
                  {message.completedTime
                    ? formatDistanceToNow(message.completedTime) + " ago"
                    : "Pending"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
