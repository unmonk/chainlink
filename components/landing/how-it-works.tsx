"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Medal } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <Medal />,
    title: "Make Picks",
    description:
      "Pick winners from all your favorite sports leagues throughout the month",
  },
  {
    icon: <Medal />,
    title: "Watch the Game",
    description:
      "Check in during the game for live scoring, no need to download additional score tracking apps",
  },
  {
    icon: <Medal />,
    title: "Build Your Chain",
    description:
      "Chain together winning picks to beat your friends and the rest of the world",
  },
  {
    icon: <Gift />,
    title: "Dominate",
    description:
      "Show off your wins and accomplishments every month and earn the title of ChainMaster",
  },
];

export const HowItWorks = () => {
  return (
    <section id="howItWorks" className="container text-center py-8 sm:py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-3xl md:text-4xl font-bold"
      >
        How to{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Play{" "}
        </span>
        Step-by-Step Guide
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: 0.2 }}
        className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground"
      >
        Correctly pick matchups to build your chain.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="hover:scale-105 transition-transform duration-300 h-full"
          >
            <Card className="bg-muted/50 h-full">
              <CardHeader>
                <CardTitle className="grid gap-4 place-items-center">
                  {icon}
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>{description}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
