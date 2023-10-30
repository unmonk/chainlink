import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChainLink | How To Play",
  description:
    "Learn how to play ChainLink, Frequently Asked Questions, and more.",
};

export default function HowToPlayPage() {
  return (
    <div className="mt-4 flex flex-col items-center">
      <h1 className="text-primary w-full text-center text-4xl font-semibold">
        How To Play
      </h1>
      <div className="mt-4 grid w-full max-w-2xl grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center p-4">
          <p className="my-4">
            Welcome to <span className="text-primary">ChainLink</span> - a game
            that puts your love for sports up against the whole world! The
            objective of the game is to either Link together the longest win
            Chain in a month by selecting consecutive winners OR Win the most
            matchups in a month, regardless of the length of your Chain
          </p>
          <p className="my-4">
            You don&apos;t have to play every day, but the more matchups you
            pick correctly, the longer your chain will be!
          </p>
        </div>

        <ul className="my-4 list-disc p-4 text-sm">
          <li className="my-2 list-item rounded-md p-1 shadow-md">
            Pick the winner on matchups drawn from different sports and events
            from around the world, including NFL, MLB, MLS, WNBA, and College
            Football.
          </li>
          <li className="my-2 list-item rounded-md p-1 shadow-md">
            On your Play page you&apos;ll find all of the matchups offered up
            for a particular day.
          </li>
          <li className="my-2 list-item rounded-md p-1 shadow-md">
            Only one matchup can be selected at a time. Once a selection has
            been scored, you will be unlocked to make another selection and
            continue building your Chain.
          </li>
          <li className="my-2 list-item rounded-md p-1 shadow-md">
            If you win a matchup you will add another link to your chain, but if
            you lose, your chain is gone and you will need to avoid starting a
            <span className="text-primary"> ChainLink</span> of losses!
          </li>
        </ul>
      </div>
      <div className="mt-4 w-full max-w-2xl p-4">
        <h1 className="text-primary w-full text-center text-4xl font-semibold">
          FAQ
        </h1>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              When do the next days picks become available?
            </AccordionTrigger>
            <AccordionContent>Midnight, Pacific.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
