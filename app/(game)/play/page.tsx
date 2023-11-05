import { ActivePickCard } from "@/components/picks/active-pick-card"
import MatchupListCards from "@/components/picks/matchup-list-cards"
import { StreakDisplay } from "@/components/streaks/streak-display"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getMatchups } from "@/lib/actions/matchups"
import { getPick } from "@/lib/actions/picks"
import { auth, redirectToSignIn } from "@clerk/nextjs"
import { CalendarClockIcon, HistoryIcon, LockIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

type DashboardPageParams = {
  searchParams: {
    f: string
  }
}

export default async function Page({ searchParams }: DashboardPageParams) {
  const { f } = searchParams
  const { userId } = auth()
  if (!userId) {
    return redirectToSignIn()
  }
  const pick = await getPick()
  const matchups = await getMatchups()

  if (pick && matchups) {
    const matchup = matchups.find((matchup) => matchup.id === pick.matchup_id)
    //REMOVE pick.matchup.id from matchupsArray
    matchups.splice(
      matchups.findIndex((matchup) => matchup.id === pick.matchup_id),
      1
    )

    if (matchup) {
      pick.matchup = matchup
    }
  }

  return (
    <section className="flex flex-col items-center py-4 md:py-6 ">
      <div className="grid w-full grid-cols-1 gap-4 px-2 lg:gap-8 lg:px-4 xl:px-6 2xl:grid-cols-8">
        <div className="col-span-1 flex flex-col gap-2 lg:px-4 xl:border-r-2 xl:px-6 2xl:col-span-2">
          <div className="hidden h-8 flex-row px-2 lg:flex">
            <h3 className="text-lg font-semibold">My Streak</h3>
          </div>
          <Separator className="my-2 hidden xl:flex" />
          <div className="hidden flex-col justify-center text-center text-xl lg:flex">
            <StreakDisplay size="xl" />
          </div>

          {pick && (
            <>
              <div className="mt-2 flex h-8 flex-row px-2">
                <h3 className="text-lg font-semibold">My Pick</h3>
              </div>
              <Separator className="my-2 hidden xl:flex" />
              <ActivePickCard pick={pick} />
            </>
          )}

          <div className="mt-2 hidden h-8 flex-row px-2 xl:flex">
            <h3 className="text-lg font-semibold ">Our Other Games</h3>
          </div>
          <Separator className="my-2 hidden xl:flex" />
          <div className="hidden items-center justify-between gap-2 text-xl xl:grid xl:grid-cols-3">
            <Link href="https://www.theroseleague.com" target="_blank">
              <Image
                src="/images/ad1.png"
                width={200}
                height={200}
                alt="test"
                className="rounded-lg border-slate-500 shadow-md"
              />
            </Link>
            <Link href="https://www.club602.com/flipcup" target="_blank">
              <Image
                src="/images/test2.png"
                width={200}
                height={200}
                alt="test"
                className="rounded-lg border-slate-500 shadow-md"
              />
            </Link>
            <Image
              src="/images/ad3.png"
              width={200}
              height={200}
              alt="test"
              className="rounded-lg border-slate-500 shadow-md"
            />
          </div>
        </div>
        <TooltipProvider>
          <div className="col-span-1 flex flex-col gap-2 2xl:col-span-6">
            <div className="flex h-8 flex-row items-center px-2">
              <h3 className="text-lg font-semibold ">{`Today's Picks`}</h3>
              {pick && pick.pick_status !== "PENDING" && (
                <Tooltip>
                  <TooltipTrigger>
                    <LockIcon className="ml-2 h-6 w-6 text-destructive" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Locked until pick completion</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <div className="ml-auto flex flex-row gap-4">
                <Button
                  className="flex flex-col whitespace-nowrap text-xs"
                  variant={"link"}
                  size={"icon"}
                  asChild
                >
                  <Link
                    href={f ? "/play" : "/play?f=inprogress"}
                    prefetch={false}
                    replace={true}
                  >
                    <CalendarClockIcon />
                    {f ? "Show All" : "Hide"}
                  </Link>
                </Button>
                <Button
                  className="flex flex-col whitespace-nowrap text-xs"
                  size={"icon"}
                  variant={"link"}
                  asChild
                >
                  <Link href="picks">
                    <HistoryIcon />
                    History
                  </Link>
                </Button>
              </div>
            </div>
            <Separator className="my-2" />
            <MatchupListCards
              matchups={matchups}
              activePick={pick}
              filter={f}
            />
          </div>
        </TooltipProvider>
      </div>
    </section>
  )
}
