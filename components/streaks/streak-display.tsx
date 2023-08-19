import { getStreak } from "@/lib/actions/streaks";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

interface StreakDisplayProps {
  size?: "default" | "sm" | "lg" | "xl";
}

const streakVariants = cva("font-bold", {
  variants: {
    size: {
      default: "",
      sm: "text-xs",
      lg: "text-2xl",
      xl: "text-5xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export async function StreakDisplay({ size }: StreakDisplayProps) {
  const streakData = await getStreak();
  const wins = streakData?.wins || 0;
  const losses = streakData?.losses || 0;
  const pushes = streakData?.pushes || 0;
  const streak = streakData?.streak || 0;

  const streakPrefix = streak >= 0 ? "W" : "L";
  const streakColor = streak >= 0 ? "text-green-500" : "text-red-500";
  const streakText = `${streakPrefix}${Math.abs(streak)}`;

  return (
    <>
      <h4 className={cn(streakVariants({ size }), streakColor)}>
        {streakText}
      </h4>
      <p className="font-mono">
        {wins}-{losses}-{pushes}
      </p>
    </>
  );
}
