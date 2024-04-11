import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserButton, UserProfile } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="mt-8 grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="inline-block max-w-lg justify-center text-center">
            <h1 className="text-primary text-4xl font-semibold">ChainLink</h1>
          </div>
          <div className="flex gap-3">
            <Link href={"/play"}>
              <Button>Play Now</Button>
            </Link>
          </div>
          <span className="bg-accent mt-8 flex flex-row items-center rounded-md p-2">
            We are currently in:
            <Badge variant={"outline"} className="ml-2 bg-cyan-400/80">
              Open Beta
            </Badge>
          </span>
          <div className="from-background to-accent mt-8 flex w-3/4 flex-row items-center justify-center rounded-md bg-gradient-to-t p-4 text-center">
            <p>
              Pick the winner on matchups drawn from different sports and events
              from around the world, including{" "}
              <span className="text-primary">NFL</span>,{" "}
              <span className="text-primary">MLB</span>,{" "}
              <span className="text-primary">NBA</span>, and{" "}
              <span className="text-primary">College Football</span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
