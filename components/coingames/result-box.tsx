import React, { useRef } from "react";
import { ConfettiEmoji } from "../ui/confetti";

export default function ResultBox({
  isSpinning,
  win,
  children,
}: {
  isSpinning: boolean;
  win: { matches: number; payout: number } | null;
  children?: React.ReactNode;
}) {
  const targetRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="text-center p-4 rounded-lg bg-gray-100 dark:bg-background/50 min-h-[80px] flex items-center justify-center"
      ref={targetRef}
    >
      {isSpinning ? (
        <div className="text-lg font-semibold animate-pulse">Spinning...</div>
      ) : win ? (
        <div className="space-y-2">
          <div className="text-2xl font-bold text-yellow-500">
            🎉 Winner! 🎉
            <ConfettiEmoji
              targetRef={targetRef}
              autoTrigger={!!win}
              confettiAmount={win.payout}
            />
          </div>
          <div className="text-lg text-balance">
            {win.matches} matching symbols - You won 🔗{win.payout} links!
          </div>
        </div>
      ) : (
        <div className="text-lg text-muted-foreground text-balance">
          Match 2 or more symbols in a row to win!
        </div>
      )}
    </div>
  );
}

export function BlackJackResultBox({ status }: { status: string }) {
  const targetRef = useRef<HTMLDivElement>(null);
  if (status === "PLAYING") return null;
  const shouldShowConfetti = status === "PLAYER_WON";

  return (
    <div
      className="text-center p-4 rounded-lg bg-gray-100 dark:bg-background/50 min-h-[80px] flex items-center justify-center"
      ref={targetRef}
    >
      <ConfettiEmoji
        targetRef={targetRef}
        autoTrigger={shouldShowConfetti}
        confettiAmount={50}
      />
      <h2 className="text-2xl font-bold mb-4">
        {status === "PLAYER_BUSTED" && "Bust! You lost!"}
        {status === "DEALER_BUSTED" && "Dealer busted! You won!"}
        {status === "PLAYER_WON" && "You Won!"}
        {status === "DEALER_WON" && "Dealer won!"}
        {status === "PUSH" && "Push!"}
      </h2>
    </div>
  );
}
