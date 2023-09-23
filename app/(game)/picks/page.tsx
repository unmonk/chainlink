import PickDetails from "@/components/picks/pick-details";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { format } from "timeago.js";

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
            <TableHead>Status</TableHead>
            <TableHead>My Pick</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>League</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {picks &&
            picks.map((pick) => {
              return (
                <TableRow key={pick.id}>
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
                    {pick.pick_status === "STATUS_IN_PROGRESS" ? (
                      <Loader />
                    ) : (
                      pick.pick_status
                    )}
                  </TableCell>
                  <TableCell className="">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"secondary"}
                          size={"lg"}
                          className="flex flex-row items-center p-2 w-full"
                        >
                          <Image
                            src={
                              (pick.pick_type === "HOME"
                                ? pick.matchup?.home_image
                                : pick.matchup?.away_image) || ""
                            }
                            width={40}
                            height={40}
                            alt={
                              pick.pick_type === "HOME"
                                ? pick.matchup?.home_team
                                : pick.matchup?.away_team
                            }
                          />
                          <p>
                            {pick.pick_type === "HOME"
                              ? pick.matchup?.home_team
                              : pick.matchup?.away_team}
                          </p>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PickDetails pick={pick} />
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    {format(pick.matchup?.start_time!, "en_US")}
                  </TableCell>
                  <TableCell>
                    {pick.matchup?.league === "COLLEGE-FOOTBALL"
                      ? "CFB"
                      : pick.matchup?.league}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
