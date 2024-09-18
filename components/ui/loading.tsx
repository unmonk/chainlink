// src/AnimatedText.js
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

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

function Loading() {
  return (
    <div className="h-screen text-center py-20">
      <LoadingText>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-8xl text-center">
          🔗ChainLink
        </h1>
      </LoadingText>
    </div>
  );
}

export default Loading;
