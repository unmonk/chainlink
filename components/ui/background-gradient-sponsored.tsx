"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const gradientColors = {
  purple:
    "bg-gradient-to-br  from-purple-900 via-purple-600 to-purple-300 text-purple-500",
  blue: "bg-gradient-to-br  from-blue-900 via-blue-600 to-blue-300 text-blue-500",
  green:
    "bg-gradient-to-br from-green-900 via-green-600 to-green-300 text-green-500",
  red: "bg-gradient-to-br  from-red-900 via-red-600 to-red-300 text-red-500",
  yellow:
    "bg-gradient-to-br  from-yellow-900 via-yellow-600 to-yellow-300 text-yellow-500",
  cyan: "bg-gradient-to-br  from-cyan-900 via-cyan-600 to-cyan-300 text-cyan-500",
  orange:
    "bg-gradient-to-br  from-orange-900 via-orange-600 to-orange-300 text-orange-500",
  pink: "bg-gradient-to-br  from-pink-900 via-pink-600 to-pink-300 text-pink-500",
  teal: "bg-gradient-to-br  from-teal-900 via-teal-600 to-teal-300 text-teal-500",
  indigo:
    "bg-gradient-to-br  from-indigo-900 via-indigo-600 to-indigo-300 text-indigo-500",
  violet:
    "bg-gradient-to-br  from-violet-900 via-violet-600 to-violet-300 text-violet-500",
  fuchsia:
    "bg-gradient-to-br  from-fuchsia-900 via-fuchsia-600 to-fuchsia-300 text-fuchsia-500",
  rose: "bg-gradient-to-br  from-rose-900 via-rose-600 to-rose-300 text-rose-500",
  emerald:
    "bg-gradient-to-br  from-emerald-900 via-emerald-600 to-emerald-300 text-emerald-500",
  sky: "bg-gradient-to-br  from-sky-900 via-sky-600 to-sky-300 text-sky-500",
  amber:
    "bg-gradient-to-br  from-amber-900 via-amber-600 to-amber-300 text-amber-500",
  lime: "bg-gradient-to-br  from-lime-900 via-lime-600 to-lime-300 text-lime-500",
  slate:
    "bg-gradient-to-br  from-slate-900 via-slate-600 to-slate-300 text-slate-500",
  zinc: "bg-gradient-to-br  from-zinc-900 via-zinc-600 to-zinc-300 text-zinc-500",
  neutral:
    "bg-gradient-to-br  from-neutral-900 via-neutral-600 to-neutral-300 text-neutral-500",
  stone:
    "bg-gradient-to-br  from-stone-900 via-stone-600 to-stone-300 text-stone-500",
  // add more color combinations as needed
} as const;

export const BackgroundGradientSponsored = ({
  children,
  className,
  containerClassName,
  animate = true,
  color,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
  color: string;
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };

  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-2xl z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform",
          gradientColors[color as keyof typeof gradientColors]
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-2xl z-[1] will-change-transform",
          gradientColors[color as keyof typeof gradientColors]
        )}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
