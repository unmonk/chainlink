import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DiscordLogoIcon } from "@radix-ui/react-icons";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What matchups can I pick?",
    answer:
      "Matchups are curated by our team of experts, and you can pick any matchup that is available on the platform. The Play screen will show you all matchups for the next 48 hours across several football, soccer, baseball, and other leagues. ",
    value: "item-1",
  },
  {
    question: "When are matchups updated?",
    answer:
      "Matchups are checked every minute as long as the league is pushing scores.",
    value: "item-2",
  },
  {
    question: "What are 🔗Links?",
    answer:
      "🔗Links are our currency in the ChainLink game. You earn 🔗Links through winning matchups. Additonal ways to earn and use 🔗Links will be announced soon.",
    value: "item-3",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion type="single" collapsible className="w-full AccordionRoot">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          href={process.env.NEXT_PUBLIC_DISCORD_URL}
          className="text-primary transition-all border-primary hover:border-b-2 items-center justify-center inline-flex gap-1"
        >
          Join our Discord <DiscordLogoIcon className="w-5 h-5 inline" />
        </a>
      </h3>
    </section>
  );
};
