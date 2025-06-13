"use client";

import { ContentLayout } from "@/components/nav/content-layout";
import { NewSquadForm } from "@/components/squads/new-squad-form";
import SquadSearch from "@/components/squads/squad-search";
import { SquadsList } from "@/components/squads/squads-list";
import Loading from "@/components/ui/loading";
import { RainbowButton } from "@/components/ui/rainbow-button";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Link from "next/link";
import { Suspense } from "react";

export default function Page() {
  //get convex user
  const user = useUser();
  const squad = useQuery(api.squads.getUserSquad);

  if (!user) return <Loading />;

  return (
    <ContentLayout title="Squads">
      <Suspense fallback={<Loading />}>
        <div className="w-full">
          <SquadSearch />
        </div>
        <p className="text-muted-foreground text-sm mb-2 rounded-md p-2 bg-background/20 text-center">
          Squads is a team game, built right into ChainLink! Start a new Squad
          or join your friends to see who is the most knowledgeable group of
          sports fans in the world!
        </p>

        <div className="flex mt-2 mb-2 justify-center w-full">
          {!squad && user.isSignedIn && <NewSquadForm />}
          {squad && (
            <Link
              href={`/squads/${squad.slug}`}
              prefetch={false}
              className="w-full lg:w-fit"
            >
              <RainbowButton className="w-full lg:w-fit">
                My Squad
              </RainbowButton>
            </Link>
          )}
        </div>
        <div className="w-full">
          <SquadsList />
        </div>
        <p className="text-muted-foreground text-sm mb-2 rounded-md p-2 bg-background/20 text-center">
          Squad score is determined by a combination of wins, losses, pushes,
          member contributions. Earn some cool achievements to display forever
          on the Squad page and your profile!
        </p>
      </Suspense>
    </ContentLayout>
  );
}
