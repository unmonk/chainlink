"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftCircleIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "./button";

export function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  const pathSegments = pathname.split("/").filter(Boolean);

  if (pathSegments.length <= 1) {
    return null;
  }

  if (pathSegments[0] === "u" && pathSegments.length === 2) {
    return null;
  }
  if (pathSegments[0] === "squads" && pathSegments.length === 2) {
    return null;
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      className="h-8"
      variant="outline"
      size="icon"
      onClick={handleBack}
      aria-label="Go back"
      title="Go back"
    >
      <ArrowLeftCircleIcon className="h-4 w-4" />
    </Button>
  );
}
