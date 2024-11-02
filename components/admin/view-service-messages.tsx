"use client";
import { api } from "@/convex/_generated/api";

import { useAction, useQuery } from "convex/react";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { getScheduledMessages, ScheduledMessage } from "@/convex/utils";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

export default function ViewServiceMessages() {
  const getScheduledMessages = useAction(api.utils.getScheduledMessages);
  const [loading, setLoading] = useState(false);
  const [scheduledMessages, setScheduledMessages] = useState<
    ScheduledMessage[] | null
  >(null);

  const handleFetchMessages = async () => {
    try {
      setLoading(true);
      const messages = await getScheduledMessages();
      setScheduledMessages(messages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleFetchMessages}
        disabled={loading}
        variant="destructive"
      >
        {loading ? (
          <>
            <Loader2Icon className="w-4 h-4 animate-spin mr-2" /> Running...
          </>
        ) : (
          "FETCH SERVICE MESSAGES"
        )}
      </Button>

      {scheduledMessages && (
        <>
          <h2 className="text-xl font-semibold">Service Messages</h2>

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
        </>
      )}
    </div>
  );
}
