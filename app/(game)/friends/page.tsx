import { ContentLayout } from "@/components/nav/content-layout";
import { FriendsList } from "@/components/profile/friends-list";

export default function Page() {
  return (
    <ContentLayout title="Friends">
      <FriendsList />
    </ContentLayout>
  );
}
