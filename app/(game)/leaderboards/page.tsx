import { LeaderboardList } from "@/components/leaderboards/leaderboard-list";
import { ContentLayout } from "@/components/nav/content-layout";
import { InfoIcon } from "lucide-react";
import { Metadata } from "next";

//metadata
export const metadata: Metadata = {
  title: "Leaderboards - ChainLink",
  description: "View the leaderboards to see who has the biggest chain.",
  openGraph: {
    title: "Leaderboards - ChainLink",
    description: "View the leaderboards to see who has the biggest chain.",
    type: "website",
    siteName: "ChainLink",
    locale: "en_US",
    url: "https://chainlink.com/leaderboards",
  },
  twitter: {
    title: "Leaderboards - ChainLink",
    description: "View the leaderboards to see who has the biggest chain.",
    site: "https://chainlink.com",
  },
};

export default function Page({}) {
  return (
    <ContentLayout title="Leaderboards">
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-2xl font-bold">Leaderboards</h1>
      </div>
      <LeaderboardList />
      <span className="text-xs text-muted-foreground text-center mt-1 flex items-center justify-center">
        <InfoIcon className="h-4 w-4 mr-1" />
        Only players who have participated in the current month are included.
      </span>
    </ContentLayout>
  );
}
