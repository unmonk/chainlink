import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SmartBanner() {
  return (
    <div className="bg-primary px-4 py-3 text-primary-foreground sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-2 sm:flex-row text-center sm:text-left text-sm font-medium">
        <span>The beta period will be ending soon and the full app launches in July.</span>
        <Link
          href="https://ChainLink.club602.com"
          className="flex items-center gap-1 underline underline-offset-4 hover:text-primary-foreground/80 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to Chainlink 2.0 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}