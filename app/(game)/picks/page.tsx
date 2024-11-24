import { ContentLayout } from "@/components/nav/content-layout";
import { UserPickList } from "@/components/picks/pick-list";
import { SignedIn } from "@clerk/nextjs";
import { Metadata } from "next";

//metadata
export const metadata: Metadata = {
  title: "My Picks - ChainLink",
  description: "View your past and current picks.",
  openGraph: {
    title: "My Picks - ChainLink",
    description: "View your past and current picks.",
    type: "website",
    siteName: "ChainLink",
    locale: "en_US",
    url: "https://chainlink.com/picks",
  },
  twitter: {
    title: "My Picks - ChainLink",
    description: "View your past and current picks.",
    site: "https://chainlink.com",
  },
};

export default function Page({}) {
  return (
    <ContentLayout title="My Picks">
      <SignedIn>
        <h1 className="text-2xl font-semibold m-5">My Picks</h1>
        <UserPickList />
      </SignedIn>
    </ContentLayout>
  );
}
