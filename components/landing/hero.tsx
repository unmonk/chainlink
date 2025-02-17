"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { LandingLeagues } from "./landing-leagues";
import Link from "next/link";
import { motion } from "framer-motion";
import GetStartedButton from "@/components/ui/get-started-button";

export const Hero = () => {
  const [currentVideo, setCurrentVideo] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 4000); // Change video every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const scrollToNextSection = () => {
    const nextSection = document.getElementById("howItWorks");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      <video
        key={currentVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        <source src={`/videos/clip${currentVideo}.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/60" />{" "}
      {/* Overlay to ensure text readability */}
      <div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-500 animate-pulse">
            CHAINBUILDER
          </Badge>
        </motion.div>

        <motion.h1
          className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Predict. Win.{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
            Build Your Chain.
          </span>
        </motion.h1>

        <motion.p
          className="mb-8 max-w-2xl text-xl text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Join sports fans building their chains across NFL, NBA, MLB, NHL, MLS,
          College Basketball, College Football, and more. Build your chain
          today.
        </motion.p>

        <motion.div
          className="flex flex-row gap-4 w-full mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="/dashboard" passHref className="w-full">
            <GetStartedButton text="Play Now" />
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-gray-400 text-lg text-white hover:bg-white/10 w-full"
            onClick={scrollToNextSection}
          >
            Learn More
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="w-full"
        >
          <LandingLeagues />
        </motion.div>
      </div>
    </section>
  );
};
