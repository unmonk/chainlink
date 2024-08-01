import { UserPickList } from "@/components/picks/pick-list";

export default function Page({}) {
  return (
    <main>
      <h1 className="text-2xl font-semibold m-5">My Picks</h1>
      <UserPickList />
    </main>
  );
}
