"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";
import { Star } from "lucide-react";

const LinksFAQ = () => {
  return (
    <>
      <p className="mb-2">
        Links are our in game currency. You earn links with every correct pick
        that you make while playing ChainLink. These Links can be spent on
        features and upgrades to the game (coming soon)
      </p>
      <p className="mb-2">
        Some matchups will require you to wager Links in order to make a pick,
        while others may pay out more in collaboration with our partners or
        sponsors.
      </p>
      <p className="mb-2">
        Links can also be spent in our game room to play blackjack or slots for
        a chance to win even more Links!
      </p>
    </>
  );
};

const MatchupsPickFAQ = () => {
  return (
    <>
      <p className="mb-2">
        Matchups are curated by our team of experts, and you can pick any
        matchup that is available on the platform. The Play screen will show you
        all matchups for the next 24 hours across several football, soccer,
        baseball, and other leagues.
      </p>
    </>
  );
};

const SpreadPickFAQ = () => {
  return (
    <>
      <p className="mb-2">
        Picking a game &quot;against the spread&quot; means you are picking a
        team not just to win, but to win by more than a predetermined number of
        points, or to lose by less than that number if they are the underdog.
        You are either picking the favored team to &quot;cover&quot; the spread
        by winning by a certain margin, or the underdog to &quot;cover&quot; by
        keeping the game within that margin.
      </p>
    </>
  );
};

const MatchupsUpdateFAQ = () => {
  return (
    <>
      <p className="mb-2">
        Matchups are checked every minute as long as the league is pushing
        scores.
      </p>
    </>
  );
};

const SquadsFAQ = () => {
  return (
    <>
      <p className="mb-2">
        Squads is a team game, built right into ChainLink! Start a new Squad or
        join your friends to see who is the most knowledgeable group of sports
        fans in the world!
      </p>
      <p className="mb-2">
        Squad score is determined by a combination of wins, losses, pushes,
        member contributions. Earn some cool achievements to display forever on
        the Squad page and your profile!
      </p>
    </>
  );
};

const NotificationsFAQ = () => {
  return (
    <>
      <p className="mb-2">
        If you missed turning on notifications during your account setup and
        install, you can still activate them to Never Miss A Pick!
      </p>
      <p className="mb-2">
        In your setting page on the side bar, click the notifications section,
        this is hidden behind a menu on most phones.
      </p>
      <p className="mb-2">
        From the Notifications page, activate your push notifications and be
        sure to accept notifications on your phone or web browser when the pop
        up appears. You may have to re-toggle the button after accepting
        notifications.
      </p>
      <p className="mb-2">
        Now toggle the “Pick Completion Notifications” and Never Miss A Pick
        again!
      </p>
    </>
  );
};

const ExtraGamesFAQ = () => {
  return (
    <>
      <h2 className="mb-2 font-bold">Blackjack</h2>
      <p className="mb-2">
        The Blackjack game is played for our in-game currency, Links. You can
        play one hand per day for free, otherwise playing requires you to stake
        your hard earned Links.
      </p>
      <p className="mb-2">
        This is a basic blackjack game, with no splits, doubles, or insurance.
        Blackjack pays at 2.5:1
      </p>
      <h2 className="mb-2 font-bold">Slots</h2>
      <p className="mb-2">
        The slots game is played for our in-game currency, Links. You can play
        one spin per day for free, otherwise playing requires you to stake your
        hard earned Links.
      </p>
      <p className="mb-2">
        Matching symbols only count from the left of the spinner.
      </p>
    </>
  );
};

interface FAQProps {
  question: string;
  answer: React.ReactNode;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What matchups can I pick?",
    answer: <MatchupsPickFAQ />,
    value: "item-1",
  },
  {
    question: "What is picking against the spread?",
    answer: <SpreadPickFAQ />,
    value: "item-2",
  },
  {
    question: "When are matchups updated?",
    answer: <MatchupsUpdateFAQ />,
    value: "item-3",
  },
  {
    question: "What are 🔗Links?",
    answer: <LinksFAQ />,
    value: "item-4",
  },
  {
    question: "What are Squads?",
    answer: <SquadsFAQ />,
    value: "item-5",
  },
  {
    question: "How do I get notifications?",
    answer: <NotificationsFAQ />,
    value: "item-6",
  },
  {
    question: "How do I play the extra game modes?",
    answer: <ExtraGamesFAQ />,
    value: "item-7",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const FAQ = () => {
  return (
    <section id="faq" className="container py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Frequently Asked{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            Questions
          </span>
        </h2>

        <Accordion type="single" collapsible className="w-full AccordionRoot">
          {FAQList.map(({ question, answer, value }: FAQProps) => (
            <motion.div key={value} variants={itemVariants}>
              <AccordionItem value={value}>
                <AccordionTrigger className="text-left">
                  {question}
                </AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          href={process.env.NEXT_PUBLIC_DISCORD_URL}
          className="text-primary transition-all border-primary hover:border-b-2 items-center justify-center inline-flex gap-1"
        >
          Join our Discord <DiscordLogoIcon className="w-5 h-5 inline" />
        </a>
      </h3>
      <Link href="/sponsor" prefetch={false}>
        <Button
          variant="outline"
          size="lg"
          className="mx-auto mt-8 flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Star className="w-4 h-4" />
          Advertise with us
        </Button>
      </Link>
    </section>
  );
};
