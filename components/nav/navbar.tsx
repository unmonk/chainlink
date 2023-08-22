import { Button } from "../ui/button";
import { UserNav } from "@/components/nav/user-nav";
import { Logo } from "@/components/ui/logo";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex h-16 items-center px-4">
      <Logo />
      <Link href="/" className="text-primary">
        ChainLink
      </Link>
      <div className="ml-auto flex items-center space-x-4">
        <SignedIn>
          <Button asChild>
            <Link href={"/play"}>Play ⚾</Link>
          </Button>
          <UserNav />
        </SignedIn>
      </div>
    </nav>
  );
}
