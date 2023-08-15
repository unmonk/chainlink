import { ActivePickCard } from "@/components/picks/active-pick-card";
import MatchupListCards from "@/components/picks/matchup-list-cards";
import StreakDisplay from "@/components/streaks/streak-display";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HistoryIcon } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <section className="flex flex-col items-center gap-4 py-4 md:py-6 ">
      <h1 className="text-xl font-bold underline decoration-primary underline-offset-8">
        Dashboard
      </h1>
      <div className="grid w-full grid-cols-1 gap-4 px-2 md:grid-cols-8 lg:px-4 xl:px-6">
        <div className="col-span-1 flex flex-col gap-2 md:col-span-2">
          <div className="rounded-xl border">
            <div className="flex flex-col items-center justify-center">
              <StreakDisplay size="xl" />
            </div>
          </div>
          <div className="rounded-xl border p-2">
            <h3 className="text-lg font-semibold">{`Your Active Pick`}</h3>
            <Separator className="my-2" />
            <ActivePickCard />
          </div>
        </div>

        <div className="col-span-1 flex  flex-col gap-2 md:col-span-6">
          <div className="flex flex-row items-center px-2">
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
          <MatchupListCards />
        </div>
      </div>
    </section>
  );
}
