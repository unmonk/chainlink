import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="mt-8 grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="inline-block max-w-lg justify-center text-center">
          <h1 className="text-primary text-4xl font-semibold">
            {siteConfig.name}
          </h1>
        </div>
        <div className="flex gap-3">
          <Link href={"/play"}>
            <Button>Play Now</Button>
          </Link>
          <Link href={siteConfig.discordInvite}>
            <Button variant={"outline"}>
              <span className="flex flex-row items-center">
                <DiscordLogoIcon className="mr-2" />
                Join Community
              </span>
            </Button>
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
      <div className="relative mx-auto h-[600px] w-[300px] rounded-[2.5rem] border-[14px] border-neutral-800 bg-neutral-800 dark:border-neutral-800">
        <div className="h-[572px] w-[272px] overflow-hidden rounded-[2rem] bg-white dark:bg-neutral-800">
          <Image
            src="/images/screenshot.png"
            height={572}
            width={272}
            alt="ChainLink Screenshot"
            priority
          />
        </div>
      </div>
    </section>
  );
}
