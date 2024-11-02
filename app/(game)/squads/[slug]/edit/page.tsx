import { ContentLayout } from "@/components/nav/content-layout";
import { SquadEditForm } from "@/components/squads/squad-edit";

export default function SquadEditPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <main>
      <ContentLayout title="Edit Squad">
        <SquadEditForm squadSlug={params.slug} />
      </ContentLayout>
    </main>
  );
}
