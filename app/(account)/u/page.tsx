import { auth } from "@clerk/nextjs";

export default async function UserProfilePage() {
  const { userId } = auth();
  return (
    <section className="flex flex-col items-center py-4 md:py-6 ">
      {userId}
    </section>
  );
}
