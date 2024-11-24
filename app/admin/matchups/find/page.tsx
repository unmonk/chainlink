"use client";

import { ContentLayout } from "@/components/nav/content-layout";
import {
  ACTIVE_LEAGUES,
  leagueLogos,
  MATCHUP_FINAL_STATUSES,
  MATCHUP_IN_PROGRESS_STATUSES,
  MATCHUP_SCHEDULED_STATUSES,
} from "@/convex/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function FindMatchupPage() {
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const matchups = useQuery(
    api.matchups.getActiveMatchupsByLeague,
    selectedLeague ? { league: selectedLeague } : "skip"
  );

  return (
    <ContentLayout title="Find Matchup">
      <div className="flex flex-col gap-4 p-4 rounded-lg">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Search for a matchup by selecting a league.
          </p>

          <Select onValueChange={setSelectedLeague} value={selectedLeague}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a league" />
            </SelectTrigger>
            <SelectContent>
              {ACTIVE_LEAGUES.map((league) => (
                <SelectItem key={league} value={league}>
                  <div className="flex items-center gap-2">
                    <Image
                      src={leagueLogos[league]}
                      alt={league}
                      height={20}
                      width={20}
                      className="object-contain"
                    />
                    <span>{league}</span>
                  </div>
                </SelectItem>
              ))}
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* Display matchups */}
          {!matchups ||
            (matchups.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No matchups found.
              </p>
            ))}
          {matchups && (
            <div className="grid gap-4 mt-4">
              {matchups.map((matchup) => (
                <Link
                  href={`/admin/matchups/${matchup._id}`}
                  key={matchup._id}
                  passHref
                  prefetch={false}
                >
                  <div
                    key={matchup._id}
                    className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer hover:bg-muted"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{matchup.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {new Date(matchup.startTime).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-1 text-xs font-medium rounded-full",
                            {
                              "bg-muted text-muted-foreground":
                                MATCHUP_SCHEDULED_STATUSES.includes(
                                  matchup.status
                                ),
                              "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-300 dark:from-sky-800":
                                MATCHUP_IN_PROGRESS_STATUSES.includes(
                                  matchup.status
                                ),
                              "to-bg-tertiary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-200 dark:from-gray-400":
                                MATCHUP_FINAL_STATUSES.includes(matchup.status),
                            }
                          )}
                        >
                          {matchup.status.replace("STATUS_", "")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Image
                          src={matchup.homeTeam.image}
                          alt={matchup.homeTeam.name}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {matchup.homeTeam.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {matchup.homePicks} picks
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center px-4">
                        <span className="text-sm font-medium text-muted-foreground">
                          VS
                        </span>
                        <span
                          className={cn(
                            "text-xs mt-1",
                            matchup.homePicks + matchup.awayPicks > 0
                              ? "font-bold text-red-500"
                              : "text-muted-foreground"
                          )}
                        >
                          {matchup.homePicks + matchup.awayPicks} total picks
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <div className="flex flex-col items-end">
                          <span className="font-medium">
                            {matchup.awayTeam.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {matchup.awayPicks} picks
                          </span>
                        </div>
                        <Image
                          src={matchup.awayTeam.image}
                          alt={matchup.awayTeam.name}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
