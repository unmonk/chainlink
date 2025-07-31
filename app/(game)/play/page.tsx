import Footer from "@/components/landing/footer";
import MatchupList from "@/components/matchups/matchup-list";
import { ContentLayout } from "@/components/nav/content-layout";
import { Metadata } from "next";

//metadata
export const metadata: Metadata = {
  title: "Play - ChainLink",
  description: "Play the ChainLink game by making picks.",
  openGraph: {
    title: "Play - ChainLink",
    description: "Play the ChainLink game by making picks.",
    type: "website",
    siteName: "ChainLink",
    locale: "en_US",
    url: "https://chainlink.com/play",
    images: ["/images/og-image.png"],
  },
  twitter: {
    title: "Play - ChainLink",
    description: "Play the ChainLink game by making picks.",
    site: "https://chainlink.com",
    images: ["/images/og-image.png"],
  },
};

export default function Page() {
  return (
    <ContentLayout title="Play">
      <MatchupList />
    </ContentLayout>
  );
}
