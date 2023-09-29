import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">ChainLink is OpenSource</h1>
      <p className="mt-4">
        ChainLink is an open source project. You can find the source code on
        Github.
      </p>
      <Link href="https://github.com/unmonk/chainlink">
        <Button variant="secondary" className="mt-4">
          Github
        </Button>
      </Link>
      <h3 className="mt-4 text-lg">Contributors:</h3>
      <ul className="p-4 list-disc">
        <li>
          <Link href={"https://github.com/unmonk"}>Scott Weaver - unmonk</Link>
        </li>
      </ul>

      <p className="my-4 text-lg">
        ChainLink is built on top of the following projects:
      </p>
      <Card>
        <CardContent>
          <ul className="p-4 list-disc">
            <li>@clerk/nextjs</li>
            <li>@upstash/redis</li>
            <li>@tanstack/react-table</li>
            <li>@radix-ui</li>
            <li>@planetscale/database</li>
            <li>next</li>
            <li>class-variance-authority</li>
            <li>clsx</li>
            <li>date-fns</li>
            <li>drizzle-orm</li>
            <li>lucide-react</li>
            <li>react</li>
            <li>react-day-picker</li>
            <li>react-dropzone</li>
            <li>react-hook-form</li>
            <li>sonner</li>
            <li>tailwind-merge</li>
            <li>tailwindcss</li>
            <li>timeago.js</li>
            <li>typescript</li>
            <li>uploadthing</li>
            <li>zod</li>
            <li>zustand</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
