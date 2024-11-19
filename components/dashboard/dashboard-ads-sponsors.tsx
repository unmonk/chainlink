import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GalleryHorizontalEnd } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DashboardAdsSponsors() {
  const sponsors = useQuery(api.sponsors.listActiveFeatured);

  // Helper function to determine grid columns based on sponsor count
  function getGridClass(sponsorCount: number) {
    switch (sponsorCount) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-2 md:grid-cols-4";
      default:
        return "grid-cols-2 md:grid-cols-3"; // 5-6 sponsors
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <GalleryHorizontalEnd className="h-5 w-5" /> Sponsors & Partners
        </CardTitle>
      </CardHeader>
      {sponsors && (
        <CardContent className="p-6">
          <div className={`grid gap-4 ${getGridClass(sponsors.length)}`}>
            {sponsors.map((sponsor) => (
              <TooltipProvider key={sponsor._id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/api/clickthru/${sponsor._id}`}
                      target="_blank"
                      className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-zinc-900/50 transition-colors hover:border-accent"
                    >
                      <Image
                        src={sponsor.bannerImage || sponsor.image}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        alt={sponsor.name}
                        width={250}
                        height={250}
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px]">
                    <p className="text-lg mb-2 font-medium">{sponsor.name}</p>
                    {sponsor.description && (
                      <p className="text-sm text-muted-foreground">
                        {sponsor.description}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </CardContent>
      )}
      <CardFooter className="flex justify-end">
        <CardDescription className="text-xs text-muted-foreground">
          Interested in promoting your product or app with ChainLink? Contact us{" "}
          <a
            href="mailto:admin@chainlink.st?subject=Advertising Inquiry"
            className="text-accent-foreground hover:underline"
          >
            here{" "}
          </a>
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
