import { ContentLayout } from "@/components/nav/content-layout";
import { UserPickList } from "@/components/picks/pick-list";
import { SignedIn } from "@clerk/nextjs";

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
