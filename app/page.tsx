import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserButton, UserProfile } from "@clerk/nextjs";
import Image from "next/image";
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
