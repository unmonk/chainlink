"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn, COSMETIC_STYLE } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Tranquiluxe,
  Lumiflex,
  Novatrix,
  Opulento,
  Velustro,
  Venturo,
  Xenon,
  Zenitho,
} from "uvcanvas";
import { Inferno } from "./avatar-backgrounds/inferno";
import { Hip } from "./avatar-backgrounds/hip";
import { Mandala } from "./avatar-backgrounds/mandala";
import { Hexagons } from "./avatar-backgrounds/hexagons";
import { Ocean } from "./avatar-backgrounds/ocean";
import { PhantomStar } from "./avatar-backgrounds/phantomstar";

interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  className?: string;
  hasGlow?: boolean;
  height: string;
  width: string;
  title?: string;
  cosmetic?: COSMETIC_STYLE;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, hasGlow, height, width, title, cosmetic, ...props }, ref) => {
  return (
    <div className="relative group">
      <div className="relative flex flex-col items-center">
        <div className="relative flex justify-center items-center">
          <div
            className={cn(
              height,
              width,
              "scale-115 rounded-full absolute overflow-hidden"
            )}
          >
            {cosmetic === "zenitho" && <Zenitho />}
            {cosmetic === "velustro" && <Velustro />}
            {cosmetic === "venturo" && <Venturo />}
            {cosmetic === "xenon" && <Xenon />}
            {cosmetic === "tranquiluxe" && <Tranquiluxe />}
            {cosmetic === "lumiflex" && <Lumiflex />}
            {cosmetic === "novatrix" && <Novatrix />}
            {cosmetic === "opulento" && <Opulento />}
            {cosmetic === "inferno" && <Inferno />}
            {cosmetic === "hip" && <Hip />}
            {cosmetic === "mandala" && <Mandala />}
            {cosmetic === "phantomstar" && <PhantomStar />}
            {cosmetic === "hexagons" && <Hexagons />}
            {cosmetic === "ocean" && <Ocean />}
          </div>
          <div className="relative">
            <AvatarPrimitive.Root
              ref={ref}
              className={cn(
                "relative z-10 flex shrink-0 overflow-hidden rounded-full",
                height,
                width,
                className
              )}
              {...props}
            />
            {title && parseInt(height.split("-")[1]) > 14 && (
              <div className="absolute bottom-0 left-0 right-0 z-20 px-1 pb-1">
                <p
                  className={cn(
                    "relative z-30 text-center text-xs text-black",
                    "bg-gradient-to-b from-transparent to-transparent rounded-md w-1/2 mx-auto",
                    title === "PREMIUM" ? "from-purple-500/80" : "",
                    title === "ADMIN" ? "from-primary/80" : "",
                    title === "MOD" ? "from-red-500/80" : ""
                  )}
                >
                  {title === "ADMIN" && "Admin"}
                  {title === "MOD" && "Mod"}
                  {title === "PREMIUM" && "Premium"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const AvatarFromUser = ({
  userId,
  height,
  width,
}: {
  userId: string;
  height: string;
  width: string;
}) => {
  const user = useQuery(api.users.queryByClerkId, {
    clerkUserId: userId,
  });
  if (!user) return null;

  return (
    <Avatar
      cosmetic={user?.metadata?.avatarBackground as COSMETIC_STYLE}
      hasGlow={!!user?.metadata?.avatarBackground}
      height={height}
      width={width}
    >
      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
      <AvatarImage src={user.image} alt={user.name ?? "User Avatar"} />
    </Avatar>
  );
};

const AvatarFromConvex = ({
  userId,
  height,
  width,
}: {
  userId: Id<"users">;
  height: string;
  width: string;
}) => {
  const user = useQuery(api.users.getUser, { userId });
  if (!user) return null;
  return (
    <Avatar
      cosmetic={user?.metadata?.avatarBackground as COSMETIC_STYLE}
      hasGlow={!!user?.metadata?.avatarBackground}
      height={height}
      width={width}
    >
      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
      <AvatarImage src={user.image} alt={user.name ?? "User Avatar"} />
    </Avatar>
  );
};

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarFromUser,
  AvatarFromConvex,
};
