import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserPicks } from "@/lib/actions/picks";
import { auth } from "@clerk/nextjs";
import Image from "next/image";

export default async function UserPicksPage() {
  const { userId } = auth();
  if (!userId) return <div>no user id</div>;
  const picks = await getUserPicks(userId);

  return (
    <div className="px-2 mt-2 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-primary">My Picks</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Your Pick</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Matchup</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>League</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {picks.map((pick) => (
            <TableRow key={pick.id}>
              <TableCell className="flex flex-row items-center gap-2 text-left">
                <Image
                  src={
                    (pick.pick_type === "HOME"
                      ? pick.matchup.home_image
                      : pick.matchup.away_image) || ""
                  }
                  width={50}
                  height={50}
                  alt={
                    pick.pick_type === "HOME"
                      ? pick.matchup.home_team
                      : pick.matchup.away_team
                  }
                />
                <p>
                  {pick.pick_type === "HOME"
                    ? pick.matchup.home_team
                    : pick.matchup.away_team}
                </p>
              </TableCell>
              <TableCell
                className={
                  pick.pick_status === "WIN"
                    ? "text-green-500"
                    : pick.pick_status === "LOSS"
                    ? "text-red-500"
                    : pick.pick_status === "STATUS_IN_PROGRESS"
                    ? "text-yellow-500"
                    : "text-sm"
                }
              >
                {pick.pick_status === "STATUS_IN_PROGRESS"
                  ? "In Progress..."
                  : pick.pick_status}
              </TableCell>
              <TableCell>{pick.matchup.question}</TableCell>
              <TableCell>
                {pick.matchup.start_time.toLocaleDateString("en-US", {
                  timeZone: "America/Los_Angeles",
                })}
              </TableCell>
              <TableCell>{pick.matchup.league}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
