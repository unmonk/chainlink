import { Hero } from "@/components/landing/hero";
import { LandingLeagues } from "@/components/landing/landing-leagues";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FAQ } from "@/components/landing/faq";

export default function Home() {
  return (
    <main className="">
      <Hero />
      <LandingLeagues />
      <HowItWorks />
      <FAQ />
    </main>
  );
}
