"use client";
import React from "react";
import { Card, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/react";

export default function ComingSoonCard() {
  return (
    <Card isFooterBlurred radius="lg" className="border-none">
      <Image
        alt="Woman listing to music"
        className="object-cover"
        height={200}
        src="/ad.png"
        width={200}
      />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-tiny text-white/80">Coming soon.</p>
      </CardFooter>
    </Card>
  );
}
