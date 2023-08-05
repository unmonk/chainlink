import Bottombar from "@/components/bottombar";
import LeftSidebar from "@/components/leftsidebar";
import RightSidebar from "@/components/rightsidebar";
import Topbar from "@/components/topbar";

export const metadata = {
  title: "Play | Dashboard",
  description: "A Game of picks and streaks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex flex-row">
        <LeftSidebar />
        <section className="flex flex-1 flex-col items-center px-4 sm:px-10">
          <div className="w-full">{children}</div>
        </section>
        <RightSidebar />
      </main>
      <Bottombar />
    </>
  );
}
