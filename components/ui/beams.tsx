"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { ACTIVE_LEAGUES, leagueLogos, leagueNames } from "@/convex/utils";
import Image from "next/image";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-gray-200 p-1 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function LeagueBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);
  const div8Ref = useRef<HTMLDivElement>(null);
  const div9Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex h-[450px] w-full items-center justify-center rounded-lg bg-transparent p-4"
      ref={containerRef}
    >
      <div className="flex size-full flex-col max-w-lg max-h-[200px] items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref}>
            <Image
              src={leagueLogos[ACTIVE_LEAGUES[0]]}
              width={100}
              height={100}
              alt={ACTIVE_LEAGUES[0]}
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
          </Circle>
          <Circle ref={div5Ref}>
            <Image
              src={leagueLogos[ACTIVE_LEAGUES[1]]}
              width={100}
              height={100}
              alt={ACTIVE_LEAGUES[1]}
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref}>
            <Image
              src={leagueLogos[ACTIVE_LEAGUES[2]]}
              width={100}
              height={100}
              alt={ACTIVE_LEAGUES[2]}
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
          </Circle>
          <Circle ref={div4Ref}>
            <Icons.chainlink />
          </Circle>
          <Circle ref={div6Ref}>
            <Image
              src={leagueLogos[ACTIVE_LEAGUES[3]]}
              width={100}
              height={100}
              alt={ACTIVE_LEAGUES[3]}
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref}>
            <Image
              src={leagueLogos[ACTIVE_LEAGUES[8]]}
              width={100}
              height={100}
              alt={ACTIVE_LEAGUES[8]}
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
          </Circle>
          <Circle ref={div7Ref}>
            <Image
              src={leagueLogos[ACTIVE_LEAGUES[4]]}
              width={100}
              height={100}
              alt={ACTIVE_LEAGUES[4]}
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div8Ref}>
            <Image
              src={leagueLogos[ACTIVE_LEAGUES[6]]}
              width={100}
              height={100}
              alt={ACTIVE_LEAGUES[6]}
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
          </Circle>
          <Circle ref={div9Ref}>
            <Image
              src={leagueLogos[ACTIVE_LEAGUES[7]]}
              width={100}
              height={100}
              alt={ACTIVE_LEAGUES[7]}
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div8Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div9Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={10}
        reverse
      />
    </div>
  );
}

const Icons = {
  chainlink: () => (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="929.000000pt"
      height="929.000000pt"
      viewBox="0 0 929.000000 929.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,929.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <path
          d="M4730 6585 c-291 -81 -481 -326 -482 -620 -1 -105 19 -187 70 -295
34 -71 58 -97 426 -469 478 -481 523 -515 725 -540 148 -19 285 11 417 90 63
38 189 166 218 221 l20 36 -50 54 c-69 77 -116 116 -146 123 -22 6 -26 3 -32
-21 -4 -15 -20 -46 -36 -68 -74 -106 -163 -157 -287 -164 -95 -5 -161 12 -230
60 -24 16 -205 190 -403 386 -423 421 -424 423 -425 582 0 87 3 100 32 161
102 208 357 280 546 155 29 -19 155 -139 281 -266 l230 -232 40 6 c23 4 64 11
91 16 28 5 86 9 130 9 l80 1 -320 321 c-176 176 -341 336 -368 355 -26 20 -86
52 -135 72 -81 33 -96 36 -212 39 -90 2 -140 -1 -180 -12z"
        />
        <path
          d="M5745 5634 c-137 -33 -201 -61 -290 -128 -52 -39 -126 -125 -156
-181 l-24 -45 69 -69 c37 -37 85 -78 106 -90 l39 -22 19 43 c62 137 198 228
342 228 73 0 171 -35 232 -82 29 -23 208 -197 397 -387 294 -296 348 -355 372
-406 97 -204 1 -435 -213 -516 -46 -17 -73 -20 -140 -18 -140 6 -162 22 -453
310 l-250 247 -50 -10 c-27 -5 -104 -13 -169 -17 l-120 -6 330 -331 c352 -353
383 -378 529 -430 72 -26 93 -29 200 -28 103 1 131 5 198 27 164 57 304 179
375 329 52 108 64 162 64 283 0 147 -31 246 -111 364 -22 31 -216 232 -433
446 -413 410 -431 426 -562 467 -59 19 -255 33 -301 22z"
        />
        <path
          d="M3255 5460 c-326 -37 -582 -139 -764 -303 -146 -133 -233 -262 -302
-450 -167 -452 -116 -1081 114 -1416 244 -355 635 -498 1197 -436 248 28 269
31 460 76 143 34 213 60 236 87 19 23 22 43 28 201 4 97 15 286 25 421 10 135
18 246 17 247 -1 2 -556 -36 -575 -39 -11 -2 -19 -29 -28 -91 -27 -188 -72
-282 -160 -334 -43 -25 -57 -28 -138 -28 -105 1 -149 18 -214 86 -107 112
-157 317 -168 689 -12 436 42 649 187 723 102 52 284 47 359 -10 19 -15 45
-50 59 -82 25 -54 26 -63 25 -218 l-1 -163 72 0 c39 0 166 7 281 15 116 8 217
15 226 15 13 0 17 17 22 98 9 142 54 497 81 629 22 105 22 118 9 152 -16 42
-5 38 -218 76 -274 50 -653 75 -830 55z"
        />
        <path
          d="M4713 4323 c-240 -3 -313 -6 -313 -16 0 -6 -5 -45 -10 -85 -13 -99
-6 -112 65 -112 61 0 81 -14 90 -63 3 -18 5 -248 3 -512 -3 -453 -4 -482 -22
-512 -20 -32 -60 -58 -107 -67 -25 -5 -26 -9 -37 -112 -7 -59 -10 -109 -8
-111 2 -2 82 1 177 8 117 8 319 10 616 6 384 -5 443 -4 454 9 7 8 16 59 20
112 14 171 39 455 45 507 5 41 2 53 -13 66 -16 15 -31 15 -153 3 -74 -8 -142
-15 -150 -16 -11 -3 -17 -31 -26 -120 -20 -201 -66 -267 -194 -276 -64 -4 -70
-3 -96 23 l-27 27 7 352 c9 451 17 580 41 606 19 21 85 45 151 55 l41 6 11 88
c7 49 12 100 12 115 l0 26 -132 -2 c-73 -2 -274 -4 -445 -5z"
        />
      </g>
    </svg>
  ),
};
