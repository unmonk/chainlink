"use client";

import { cn } from "@/lib/utils";
import { LinkIcon } from "lucide-react";

interface LoaderProps {
  className?: string;
}

export const Loader = ({ className }: { className?: string }) => {
  return <LinkIcon className={cn("animate-spin", className)} />;
};
