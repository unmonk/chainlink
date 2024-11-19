"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import {
  cn,
  COSMETIC_STYLE,
  COSMETIC_STYLES,
  getColorValue,
} from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

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
  const cosmeticStyle = cosmetic
    ? COSMETIC_STYLES[cosmetic as COSMETIC_STYLE]
    : undefined;

  const glowAnimation = cosmeticStyle?.animation;

  return (
    <div className="relative group">
      <div className="relative flex flex-col items-center">
        <div className="relative flex justify-center items-center">
          {hasGlow && cosmeticStyle && (
            <div className={cn("absolute", height, width)}>
              <div
                className={cn(
                  "absolute w-full h-full rounded-full",
                  glowAnimation === "wobble"
                    ? "animate-wobble"
                    : glowAnimation === "breathe"
                      ? "animate-breathe"
                      : glowAnimation === "spiral"
                        ? "animate-spiral"
                        : glowAnimation === "ripple"
                          ? "animate-ripple"
                          : glowAnimation === "bounce-subtle"
                            ? "animate-bounce-subtle"
                            : glowAnimation === "rotate-pulse"
                              ? "animate-rotate-pulse"
                              : glowAnimation === "wave-pulse"
                                ? "animate-wave-pulse"
                                : "animate-pulse"
                )}
                style={{
                  background: `radial-gradient(circle at bottom left, 
                          ${getColorValue(cosmeticStyle?.first)} 0%, 
                          transparent 90%)`,
                  opacity: 0.8,
                  transform:
                    cosmeticStyle?.animation === "pulse"
                      ? "scale(1.1)"
                      : undefined,
                }}
              />
              {glowAnimation !== "gradient" && (
                <>
                  <div
                    className={cn(
                      "absolute w-full h-full rounded-full",
                      glowAnimation === "wobble"
                        ? "animate-wobble"
                        : glowAnimation === "breathe"
                          ? "animate-breathe"
                          : glowAnimation === "spiral"
                            ? "animate-spiral"
                            : glowAnimation === "ripple"
                              ? "animate-ripple"
                              : glowAnimation === "bounce-subtle"
                                ? "animate-bounce-subtle"
                                : glowAnimation === "rotate-pulse"
                                  ? "animate-rotate-pulse"
                                  : glowAnimation === "wave-pulse"
                                    ? "animate-wave-pulse"
                                    : "animate-pulse"
                    )}
                    style={{
                      background: `radial-gradient(circle at top left, 
                      ${getColorValue(cosmeticStyle?.second)} 0%, 
                      transparent 90%
                    )`,
                      opacity: 0.8,
                      transform:
                        glowAnimation === "pulse"
                          ? "scale(1.1) rotate(120deg)"
                          : undefined,
                    }}
                  />
                  <div
                    className={cn(
                      "absolute w-full h-full rounded-full",
                      glowAnimation === "wobble"
                        ? "animate-wobble"
                        : glowAnimation === "breathe"
                          ? "animate-breathe"
                          : glowAnimation === "spiral"
                            ? "animate-spiral"
                            : glowAnimation === "ripple"
                              ? "animate-ripple"
                              : glowAnimation === "bounce-subtle"
                                ? "animate-bounce-subtle"
                                : glowAnimation === "rotate-pulse"
                                  ? "animate-rotate-pulse"
                                  : glowAnimation === "wave-pulse"
                                    ? "animate-wave-pulse"
                                    : "animate-pulse"
                    )}
                    style={{
                      background: `radial-gradient(circle at center, 
                      ${getColorValue(cosmeticStyle?.third)} 0%, 
                      transparent 90%
                    )`,
                      opacity: 0.8,
                      transform:
                        glowAnimation === "pulse"
                          ? "scale(1.1) rotate(240deg)"
                          : undefined,
                    }}
                  />
                </>
              )}
            </div>
          )}
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
                    "relative z-30 text-center text-xs font-medium text-zinc-100 truncate",
                    "bg-gradient-to-b from-transparent to-transparent rounded-md w-1/2 mx-auto",
                    title === "Premium" ? "from-purple-500/40" : "",
                    title === "Admin" ? "from-primary/40" : "",
                    title === "Mod" ? "from-red-500/40" : ""
                  )}
                >
                  {title}
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
