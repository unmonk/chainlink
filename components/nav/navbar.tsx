import { SheetMenu } from "@/components/nav/sheet-menu";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Coins from "../coins/coins";
import { UserChain } from "../chains/user-chain";

import { BackButton } from "../ui/back-button";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-1 lg:space-x-4 lg:gap-4 mr-2">
          <SheetMenu />
          <BackButton />
          <h1 className="overflow-hidden text-wrap whitespace-nowrap">
            {title}
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <div className="relative ml-auto flex-initial md:grow-0">
            <div className="flex flex-row gap-2 mr-2 items-center">
              <SignedIn>
                <Coins />
                |
                <UserChain />
              </SignedIn>
            </div>
          </div>
          <SignedIn>
            <UserButton
              userProfileMode="navigation"
              userProfileUrl="/settings"
              appearance={{
                variables: {
                  colorPrimary: "#12a150",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
