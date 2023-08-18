import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import ClientTime from "../ui/client-time";
import { Loader } from "../ui/loader";
import { Logo } from "../ui/logo";
import { Separator } from "../ui/separator";
import MatchupCardHeader from "./matchup-card-header";
import CancelPickButton from "@/components/picks/cancel-pick-button";
import { PickWithMatchup } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { CalendarClock, CheckIcon, Disc3Icon, LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ActivePickCardProps {
  pick: PickWithMatchup | undefined;
}

export function ActivePickCard({ pick }: ActivePickCardProps) {
  if (!pick) return null;
  return (
    <section>
      <div className="flex flex-col gap-2 w-full justify-center items-center">
        <div className="h-full w-full rounded-b-md border shadow-md">
          <MatchupCardHeader matchup={pick.matchup} status={pick.pick_status} />

          <h4 className="pr-1 text-sm font-bold md:text-base p-2 md:text-center">
            {pick.matchup.question}
          </h4>

          <div className="flex flex-col gap-2 items-center p-2">
            <div className="grid grid-cols-3 gap-4">
              <div
                className={cn(
                  "flex flex-col items-center justify-center rounded-sm p-2 relative",
                  pick.pick_type === "AWAY"
                    ? "bg-accent"
                    : "bg-accent/40 opacity-30",
                )}
              >
                <Image
                  src={pick.matchup.away_image!}
                  alt={pick.matchup.away_team}
                  width={50}
                  height={50}
                />
                <span className="text-xs font-bold text-center">
                  {pick.matchup.away_team}
                </span>
                {pick.pick_type === "AWAY" && (
                  <Badge
                    className="absolute top-1 right-1"
                    variant={"secondary"}
                  >
                    <CheckIcon size={12} />
                  </Badge>
                )}
              </div>
              {/* clock section start_time */}
              {pick.pick_status === "PENDING" && (
                <div className="flex flex-col items-center justify-center bg-accent/40 rounded-sm p-2">
                  <span className="text-xs font-bold text-center text-primary">
                    Locks at:
                  </span>
                  <Logo size={50} />
                  <span className="text-xs font-bold text-center text-primary">
                    <ClientTime time={pick.matchup.start_time} />
                  </span>
                </div>
              )}
              {/* clock section start_time */}
              {pick.pick_status === "STATUS_IN_PROGRESS" && (
                <div className="flex flex-col items-center justify-center bg-accent/40 rounded-sm p-2">
                  <Loader />
                </div>
              )}
              <div
                className={cn(
                  "flex flex-col items-center justify-center rounded-sm p-2 relative",
                  pick.pick_type === "HOME"
                    ? "bg-accent"
                    : "bg-accent/40 opacity-30",
                )}
              >
                <Image
                  src={pick.matchup.home_image!}
                  alt={pick.matchup.home_team}
                  width={50}
                  height={50}
                />
                <span className="text-xs font-bold text-center">
                  {pick.matchup.home_team}
                </span>
                {pick.pick_type === "HOME" && (
                  <Badge
                    className="absolute top-1 right-1"
                    variant={"secondary"}
                  >
                    <CheckIcon size={12} />
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-row  justify-evenly gap-4 w-1/2">
              {pick.pick_status !== "PENDING" && (
                <div className="flex justify-center items-center">
                  <p className="text-lg">{pick.matchup.away_value}</p>
                </div>
              )}
              {pick.pick_status !== "PENDING" && (
                <div className="flex justify-center items-center">
                  <Button variant="link" size="sm" asChild>
                    <Link
                      href={`/gamedetails/${pick.matchup.league}/${pick.matchup.game_id}`}
                      className=""
                      prefetch={false}
                    >
                      Live
                    </Link>
                  </Button>
                </div>
              )}
              {pick.pick_status !== "PENDING" && (
                <div className="flex justify-center items-center">
                  <p className="text-lg">{pick.matchup.home_value}</p>
                </div>
              )}
            </div>
            {pick.pick_status === "PENDING" && <CancelPickButton />}
          </div>
        </div>
      </div>
    </section>
  );
}
