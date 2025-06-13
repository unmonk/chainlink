"use client";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, usePaginatedQuery, useQuery } from "convex/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { formatDistance } from "date-fns";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import Loading from "../ui/loading";
import { LoaderCircleIcon } from "lucide-react";
import BlurFade from "../ui/blur-fade";

const ITEMS_PER_PAGE = 30; // Adjust this value as needed

export const UserPickList = () => {
  const [cursor, setCursor] = useState<string | null>(null);
  const { isAuthenticated } = useConvexAuth();

  const result = usePaginatedQuery(
    api.picks.getUserPicks,
    { paginationOpts: { numItems: ITEMS_PER_PAGE, cursor } },
    { initialNumItems: ITEMS_PER_PAGE }
  );

  if (!isAuthenticated) return null;

  const { results, status, loadMore } = result;

  if (status === "LoadingFirstPage") return <Loading />;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {results.map((pick, idx) => (
          <BlurFade key={pick._id} delay={0.25 * idx * 0.05} inView>
            <Link
              href={`/matchups/${pick.status === "STATUS_UNKNOWN" ? "" : pick.matchupId}`}
              passHref
              prefetch={false}
            >
              <Card
                key={pick._id}
                className={`h-full flex items-center flex-col text-center ${
                  pick.status === "PENDING" ||
                  pick.status === "STATUS_IN_PROGRESS"
                    ? "bg-blue-500/10"
                    : pick.status === "WIN"
                      ? "bg-green-500/10"
                      : pick.status === "LOSS"
                        ? "bg-red-500/10"
                        : pick.status === "STATUS_UNKNOWN"
                          ? "bg-yellow-500/10"
                          : ""
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-balance font-normal text-md min-h-12">
                    {pick.pick.name}
                  </CardTitle>
                  <CardDescription>
                    {pick.status === "STATUS_IN_PROGRESS"
                      ? "In Progress"
                      : pick.status === "STATUS_UNKNOWN"
                        ? "Legacy Pick"
                        : pick.status}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    src={pick.pick.image}
                    alt={pick.pick.name}
                    width={100}
                    height={100}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </CardContent>
                <CardFooter className="flex flex-col gap-1 flex-nowrap">
                  <CardDescription className="text-nowrap">
                    {formatDistance(new Date(), new Date(pick._creationTime), {
                      includeSeconds: true,
                    })}
                  </CardDescription>
                  {pick.coins !== undefined &&
                    pick.status !== "STATUS_IN_PROGRESS" &&
                    pick.status !== "PENDING" && (
                      <Badge
                        variant={
                          pick.coins < 0
                            ? "destructive"
                            : pick.coins > 0
                              ? "default"
                              : "secondary"
                        }
                      >
                        🔗{pick.coins}
                      </Badge>
                    )}
                </CardFooter>
              </Card>
            </Link>
          </BlurFade>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => loadMore(ITEMS_PER_PAGE)}
          className="mt-4"
          variant={"outline"}
          disabled={status === "LoadingMore" || status === "Exhausted"}
        >
          {status === "LoadingMore" ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : status === "Exhausted" ? (
            "No More Picks"
          ) : (
            "Load More"
          )}
        </Button>
      </div>
    </>
  );
};
