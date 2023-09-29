import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="grid grid-cols-1 mt-8 lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center gap-4 py-8">
        <div className="inline-block justify-center text-center max-w-lg">
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
        <span className="flex flex-row items-center p-2 mt-8 bg-accent rounded-md">
          We are currently in:
          <Badge variant={"outline"} className="ml-2 bg-cyan-400/80">
            Open Beta
          </Badge>
        </span>
        <div className="w-3/4 flex flex-row justify-center items-center p-4 mt-8 text-center bg-gradient-to-t from-background to-accent rounded-md">
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
      <div className="relative w-[300px] h-[600px] mx-auto bg-neutral-800 border-[14px] rounded-[2.5rem] border-neutral-800 dark:border-neutral-800">
        <div className="absolute top-[72px] -left-[17px] w-[3px] h-[32px] bg-neutral-800 rounded-l-lg dark:bg-neutral-800"></div>
        <div className="absolute top-[124px] -left-[17px] w-[3px] h-[46px] bg-neutral-800 rounded-l-lg dark:bg-neutral-800"></div>
        <div className="absolute top-[178px] -left-[17px] w-[3px] h-[46px] bg-neutral-800 rounded-l-lg dark:bg-neutral-800"></div>
        <div className="absolute top-[142px] -right-[17px] w-[3px] h-[64px] bg-neutral-800 rounded-r-lg dark:bg-neutral-800"></div>
        <div className="w-[272px] h-[572px] overflow-hidden bg-white rounded-[2rem] dark:bg-neutral-800">
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
