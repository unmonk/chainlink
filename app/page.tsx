import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center gap-4 mt-8 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className="text-primary text-4xl font-semibold">ChainLink</h1>
      </div>
      <div className="flex gap-3">
        <Link href={"/dashboard"}>
          <Button>Play Now</Button>
        </Link>
        <Link href="https://google.com">
          <Button variant={"outline"}>
            <span className="flex flex-row items-center">
              <DiscordLogoIcon className="mr-2" />
              Join Community
            </span>
          </Button>
        </Link>
      </div>
      <span className="mt-8 bg-accent p-2 rounded-md flex flex-row items-center">
        We are currently in:
        <Badge variant={"outline"} className="ml-2 bg-orange-400/80">
          Alpha
        </Badge>
      </span>
    </section>
  );
}
