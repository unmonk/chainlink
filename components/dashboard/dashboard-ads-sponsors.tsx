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

export default function DashboardAdsSponsors() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">
          Sponsors & Partners
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 grid-rows-2 gap-1">
          <div className="overflow-hidden rounded-md justify-self-center">
            <Link href="https://www.theroseleague.com/" target="_blank">
              <Image
                src="/images/ad1.png"
                className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
                alt="The Rose League"
                width={250}
                height={250}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </Link>
          </div>
          <div className="overflow-hidden rounded-md justify-self-center">
            {/* <Image
                    src="/images/ad3.png"
                    className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
                    alt="602 Pick'em"
                    width={250}
                    height={250}
                  /> */}
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
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
