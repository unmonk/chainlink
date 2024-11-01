import { ContentLayout } from "@/components/nav/content-layout";
import { AchievementsList } from "@/components/achievements/achievements-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircleIcon, AwardIcon } from "lucide-react";

export default function Page() {
  return (
    <ContentLayout title="Admin Achievements">
      <div className="flex gap-2 items-center justify-center mb-4">
        <Link href="/admin/achievements/create">
          <Button variant="outline">
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Create Achievement
          </Button>
        </Link>
        <Link href="/admin/achievements/award">
          <Button variant="outline">
            <AwardIcon className="mr-2 h-4 w-4" />
            Award Achievement
          </Button>
        </Link>
      </div>
      <AchievementsList />
    </ContentLayout>
  );
}
