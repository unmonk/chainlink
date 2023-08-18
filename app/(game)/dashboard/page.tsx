import { ActivePickCard } from "@/components/picks/active-pick-card";
import MatchupListCards from "@/components/picks/matchup-list-cards";
import StreakDisplay from "@/components/streaks/streak-display";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/drizzle/db";
import { Matchup, matchups, picks } from "@/drizzle/schema";
import { getPick } from "@/lib/actions/picks";
import { redis } from "@/lib/redis";
import { absoluteUrl, getPacifictime } from "@/lib/utils";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { HistoryIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { userId } = auth();
  if (!userId) {
    return redirectToSignIn();
  }
  const pick = await db.query.picks.findFirst({
    where: and(eq(picks.user_id, userId), eq(picks.active, true)),
    with: {
      matchup: true,
    },
  });
  const date = getPacifictime();
  const key = `MATCHUPS:${date.redis}`;
  const matchups = await redis.hgetall(key);
  const matchupsArray: Matchup[] = Object.values(
    matchups ? matchups : [],
  ) as Matchup[];

  if (pick && matchups) {
    const matchup = matchupsArray.find(
      (matchup) => matchup.id === pick.matchup_id,
    );
    //REMOVE pick.matchup.id from matchupsArray
    matchupsArray.splice(
      matchupsArray.findIndex((matchup) => matchup.id === pick.matchup_id),
      1,
    );

    if (matchup) {
      pick.matchup = matchup;
    }
  }

  return (
    <section className="flex flex-col items-center py-4 md:py-6 ">
      <div className="grid w-full grid-cols-1 gap-4 lg:gap-8 px-2 2xl:grid-cols-8 lg:px-4 xl:px-6">
        <div className="col-span-1 flex flex-col gap-2 2xl:col-span-2 xl:border-r-2 lg:px-4 xl:px-6">
          <div className=" flex-row px-2 h-8 hidden lg:flex">
            <h3 className="text-lg font-semibold">My Streak</h3>
          </div>
          <Separator className="my-2 hidden xl:flex" />
          <div className="hidden lg:flex flex-col justify-center text-center text-xl">
            <StreakDisplay />
          </div>

          <div className="flex flex-row px-2 h-8 mt-2">
            <h3 className="text-lg font-semibold">My Pick</h3>
          </div>
          <Separator className="my-2 hidden xl:flex" />
          <ActivePickCard pick={pick} />

          <div className=" flex-row px-2 h-8 mt-2 hidden xl:flex">
            <h3 className="text-lg font-semibold ">Our Other Games</h3>
          </div>
          <Separator className="my-2 hidden xl:flex" />
          <div className="text-xl hidden xl:flex gap-2 items-center justify-between">
            <Image
              src="/images/test.jpg"
              width={200}
              height={200}
              alt="test"
              className="rounded-lg shadow-md border-slate-500"
            />
            <Image
              src="/images/test2.png"
              width={200}
              height={200}
              alt="test"
              className="rounded-lg shadow-md border-slate-500"
            />
            <Image
              src="/images/test.jpg"
              width={200}
              height={200}
              alt="test"
              className="rounded-lg shadow-md border-slate-500"
            />
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-2 2xl:col-span-6">
          <div className="flex flex-row items-center px-2 h-8">
            <h3 className="text-lg font-semibold ">{`Today's Picks`}</h3>
            <Button
              className="ml-auto flex flex-col text-xs"
              size={"icon"}
              variant={"link"}
              asChild
            >
              <Link href="/picks">
                <HistoryIcon />
                History
              </Link>
            </Button>
          </div>
          <Separator className="my-2" />
          <MatchupListCards matchups={matchupsArray} />
        </div>
      </div>
    </section>
  );
}
