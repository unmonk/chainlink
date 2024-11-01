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
        <div className="flex mt-2 mb-2 justify-center w-full">
          {!squad && <NewSquadForm />}
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
      </Suspense>
    </ContentLayout>
  );
}
