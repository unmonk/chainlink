"use client";
import { api } from "@/convex/_generated/api";

import { useQuery } from "convex/react";
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

export default function ViewServiceMessages() {
  const scheduledMessages = useQuery(api.utils.listScheduledMessages);

  return (
    <div>
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
