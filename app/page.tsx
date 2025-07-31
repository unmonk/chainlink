import { Hero } from "@/components/landing/hero";
import { LandingLeagues } from "@/components/landing/landing-leagues";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FAQ } from "@/components/landing/faq";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="">
      <Hero />
      <HowItWorks />
      <FAQ />
      <Footer />
    </main>
  );
}
