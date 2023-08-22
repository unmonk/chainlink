import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 mt-8">
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="inline-block max-w-lg justify-center text-center">
          <h1 className="text-4xl font-semibold text-primary">
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
        <span className="mt-8 flex flex-row items-center rounded-md bg-accent p-2">
          We are currently in:
          <Badge variant={"outline"} className="ml-2 bg-cyan-400/80">
            Open Beta
          </Badge>
        </span>
        <div className="mt-8 flex flex-row items-center justify-center text-center w-3/4 bg-gradient-to-t from-background to-accent rounded-md p-4">
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
      <div className="relative mx-auto border-neutral-800 dark:border-neutral-800 bg-neutral-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
        <div className="h-[32px] w-[3px] bg-neutral-800 dark:bg-neutral-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
        <div className="h-[46px] w-[3px] bg-neutral-800 dark:bg-neutral-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
        <div className="h-[46px] w-[3px] bg-neutral-800 dark:bg-neutral-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
        <div className="h-[64px] w-[3px] bg-neutral-800 dark:bg-neutral-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
        <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-neutral-800">
          <Image src="/images/screenshot.png" height={572} width={272} alt="" />
        </div>
      </div>
    </section>
  );
}
