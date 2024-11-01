// src/AnimatedText.js
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SpinningText } from "./spinning-text";
import { cn } from "@/lib/utils";

const LoadingText = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const containerVariants = {
    hidden: { width: "50%" },
    visible: {
      width: 0,
      transition: {
        duration: 0.7,
        ease: [0.6, 0.05, -0.01, 1], // Custom cubic-bezier for smoother easing
      },
    },
  };

  return (
    <div ref={ref} className="relative inline-block overflow-hidden">
      <div className="relative text-transparent">{children}</div>{" "}
      {/* Ensure text is initially hidden */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 bg-green-600 z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        style={{ width: "50%" }}
      />
      <motion.div
        className="absolute right-0 top-0 bottom-0 bg-green-600 z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        style={{ width: "50%" }}
      />
      <div className="absolute inset-0">{children}</div>{" "}
      {/* Ensure text is visible after animation */}
    </div>
  );
};

function Loading({ className }: { className?: string }) {
  return (
    <div className={cn("h-screen text-center py-20", className)}>
      {/* <LoadingText>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-8xl text-center">
          🔗ChainLink
        </h1>
      </LoadingText> */}
      <SpinningLoader />
    </div>
  );
}

function SpinningLoader() {
  return (
    <SpinningText
      radius={5.5}
      fontSize={1}
      variants={{
        container: {
          hidden: {
            opacity: 1,
          },
          visible: {
            opacity: 1,
            rotate: 360,
            transition: {
              type: "spring",
              bounce: 0,
              duration: 6,
              repeat: Infinity,
              staggerChildren: 0.03,
            },
          },
        },
        item: {
          hidden: {
            opacity: 0,
            filter: "blur(4px)",
          },
          visible: {
            opacity: 1,
            filter: "blur(0px)",
          },
        },
      }}
      className="font-[450]"
    >
      {`ChainLink ∞	ChainLink ∞	ChainLink ∞ `}
    </SpinningText>
  );
}

export default Loading;
