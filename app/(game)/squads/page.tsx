"use client";

import { ContentLayout } from "@/components/nav/content-layout";
import { NewSquadForm } from "@/components/squads/new-squad-form";
import SquadSearch from "@/components/squads/squad-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { PlusCircle, Search } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function Page() {
  //get convex user
  const user = useUser();
  const squad = useQuery(api.squads.getUserSquad);

  if (!user) return <Loading />;

  if (squad) {
    redirect(`/squads/${squad.slug}`);
  }

  return (
    <ContentLayout title="Squads">
      <Suspense fallback={<Loading />}>
        <div className="flex items-center gap-2 my-2 justify-center">
          {!squad && <NewSquadForm />}
        </div>
        <div className="w-full">{!squad && <SquadSearch />}</div>
      </Suspense>
    </ContentLayout>
  );
}
