import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { DiscordIcon, GithubIcon } from "@/components/icons";
import TweetCard from "@/components/cards/tweetcard";
import { Divider } from "@nextui-org/divider";
import ComingSoonCard from "@/components/cards/comingsooncard";
import { Card, CardFooter, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";

export default function Landing() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Chain</h1>
        <h1 className={title({ color: "secondary" })}>Link&nbsp;</h1>
        <br />
        <h1 className={title()}>make picks, build chains, earn rewards.</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          A game that puts your love for sports up against the whole world!
        </h2>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          as={NextLink}
          href={siteConfig.links.docs}
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
        >
          Play Now
        </Link>
        <Link
          isExternal
          as={NextLink}
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.discord}
        >
          <DiscordIcon className="animate-drip-expand" size={20} />
          Join Community
        </Link>
      </div>

      <div className="mt-8">
        <Snippet hideSymbol hideCopyButton variant="flat">
          <span>
            We are currently in: <Code color="warning">Alpha</Code>
          </span>
        </Snippet>
      </div>

      <Divider orientation="horizontal" className="w-1/2" />

      <section className="mt-8">
        <h3 className="text-2xl font-semibold text-center mb-2">
          Our Fans Love ChainLink
        </h3>
        <div className="grid grid-rows-1 grid-cols-3 mb-6">
          <Card isFooterBlurred className="w-[300px] h-[300px]">
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
              <p className="text-tiny text-primary/60 uppercase font-bold">
                New
              </p>
              <h4 className="text-white font-medium text-2xl">Pickem</h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card example background"
              className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
              src="/ad.png"
            />
            <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
              <div>
                <p className="text-black text-tiny">Available soon.</p>
                <p className="text-black text-tiny">Get notified.</p>
              </div>
              <Button
                className="text-tiny"
                color="primary"
                radius="full"
                size="sm"
              >
                Notify Me
              </Button>
            </CardFooter>
          </Card>
          <Card className="h-[300px] w-[300px]">
            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">
                What to watch
              </p>
              <h4 className="text-white font-medium text-large">
                Stream the 602 event
              </h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover"
              src="/test2.png"
            />
          </Card>
          <Card className="h-[300px] w-[300px]">
            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">
                What to watch
              </p>
              <h4 className="text-white font-medium text-large">
                Stream the 602 event
              </h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover"
              src="/test.jpg"
            />
          </Card>
        </div>
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 min-h-fit p-2">
          <TweetCard />
          <TweetCard />
          <TweetCard />
        </div>
      </section>
    </section>
  );
}
