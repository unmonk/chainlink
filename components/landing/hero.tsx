import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { HeroCards } from "./hero-cards";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center pt-16 md:pt-24">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-black  to-green-400 dark:from-white dark:to-green-700 text-transparent bg-clip-text">
              ChainLink
            </span>
          </h1>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Pick the winner on matchups drawn from different sports and events
          from around the world, including NFL, MLB, NBA, Soccer, UFL, Lacrosse,
          College Football, and College Basketball
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Link href="/dashboard" passHref>
            <Button className="w-full md:w-1/3">Play Now</Button>
          </Link>

          <a
            href={process.env.NEXT_PUBLIC_DISCORD_URL}
            target="_blank"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Discord
            <DiscordLogoIcon className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10 mr-20">
        {" "}
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
