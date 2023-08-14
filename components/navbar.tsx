import { Logo } from "@/components/ui/logo";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex h-16 items-center px-4">
      <Logo />
      <Link href="/" className="text-primary">
        ChainLink
      </Link>
      <div className="ml-auto flex items-center space-x-4">
        <UserNav />
      </div>
    </nav>
  );
}
