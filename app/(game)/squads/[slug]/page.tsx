import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import SquadPageContent from "@/components/squads/squad-page";
import { ContentLayout } from "@/components/nav/content-layout";

interface SquadPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: SquadPageProps) {
  const squad = await fetchQuery(api.squads.getSquadBySlug, {
    slug: params.slug,
  });
  if (!squad) return { title: "Squad Not Found" };

  return {
    title: `${squad.name} | Squad`,
    description: squad.description,
  };
}

export default async function Squad({ params }: SquadPageProps) {
  const squad = await fetchQuery(api.squads.getSquadBySlug, {
    slug: params.slug,
  });

  if (!squad) notFound();

  return (
    <ContentLayout title="Squad">
      <SquadPageContent squad={squad} />
    </ContentLayout>
  );
}
