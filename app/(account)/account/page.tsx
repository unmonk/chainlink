import { UserProfile } from "@clerk/nextjs";

export default async function AccountPage() {
  return (
    <section className="flex flex-col items-center py-4 md:py-6 ">
      <UserProfile
        appearance={{
          variables: {
            colorPrimary: "#12a150",
          },
        }}
      />
    </section>
  );
}
