import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="mt-8 flex flex-col items-center gap-4 py-8 md:py-10">
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
        <Badge variant={"outline"} className="ml-2 bg-orange-400/80">
          Alpha
        </Badge>
      </span>
    </section>
  );
}
