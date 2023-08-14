"use client";

import { cn } from "@/lib/utils";
import { Link2Icon } from "@radix-ui/react-icons";

interface LoaderProps {
  className?: string;
}

export const Loader = ({ className }: { className?: string }) => {
  return <Link2Icon className={cn("animate-spin", className)} />;
};
