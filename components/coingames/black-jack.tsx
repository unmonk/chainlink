"use client";

import { Key, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { ContentLayout } from "@/components/nav/content-layout";
import { formatDistanceToNow } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";
import { RainbowButton } from "../ui/rainbow-button";
import {
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableHeader,
  TableHead,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { toast } from "sonner";

export default function Blackjack({ userId }: { userId: Id<"users"> }) {
  const [betAmount, setBetAmount] = useState(10);

  const canPlay = useQuery(api.blackjack.canPlay, {
    userId,
    betAmount,
  });
  const game = useQuery(api.blackjack.getCurrentGame, { userId });
  const gameHistory = useQuery(api.blackjack.getGameHistory, { userId });
  const startGame = useMutation(api.blackjack.startGame);
  const hit = useMutation(api.blackjack.hit);
  const stand = useMutation(api.blackjack.stand);

  console.log(canPlay);

  const handleStartGame = (useFreePlay = false) => {
    try {
      startGame({ betAmount, useFreePlay });
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleHit = () => {
    if (game?._id) {
      try {
        hit({ gameId: game._id });
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  };

  const handleStand = () => {
    if (game?._id) {
      try {
        stand({ gameId: game._id });
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  };

  const renderCard = (card: {
    suit: string;
    value: string;
    hidden?: boolean;
  }) => {
    if (card.hidden) {
      return (
        <Card className="w-24 h-36 flex items-center justify-center bg-primary">
          <span className="text-white text-2xl">
            <Logo />
          </span>
        </Card>
      );
    }

    const isRed = card.suit === "♥" || card.suit === "♦";
    return (
      <Card className="w-24 h-36 flex flex-col items-center justify-between p-2">
        <span className={cn("text-xl", isRed && "text-red-500")}>
          {card.value}
        </span>
        <div className="flex flex-col items-center gap-1 z-10 relative">
          <div className="relative">
            <span className={cn("text-4xl", isRed && "text-red-500")}>
              {card.suit}
            </span>
            <Logo className="w-5 h-5 opacity-80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white dark:text-black" />
          </div>
        </div>
        <span className={cn("text-xl rotate-180", isRed && "text-red-500")}>
          {card.value}
        </span>
      </Card>
    );
  };
  const calculateHandValue = (
    hand: {
      suit: string;
      value: string;
      hidden?: boolean;
    }[]
  ): number => {
    let total = 0;
    let aces = 0;

    // First sum non-aces
    for (const card of hand) {
      if (card.value === "A") {
        aces++;
      } else if (["K", "Q", "J"].includes(card.value)) {
        total += 10;
      } else {
        total += parseInt(card.value);
      }
    }

    // Add aces optimally
    for (let i = 0; i < aces; i++) {
      if (total + 11 <= 21) {
        total += 11;
      } else {
        total += 1;
      }
    }

    return total;
  };

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Slot Display */}
        <div className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-background/50 rounded-lg">
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-semibold">Bet Amount</h3>
            <Slider
              value={[betAmount]}
              onValueChange={([value]) => setBetAmount(value)}
              min={1}
              max={100}
              step={1}
              className="w-48"
            />

            <RainbowButton
              onClick={() => handleStartGame(false)}
              disabled={game?.status === "PLAYING"}
              className="w-full"
            >
              Play 🔗{betAmount}
            </RainbowButton>

            <div className="flex flex-col gap-2">
              <Button
                size="lg"
                variant={canPlay && canPlay.canPlayFree ? "default" : "outline"}
                disabled={
                  !canPlay || !canPlay.canPlayFree || game?.status === "PLAYING"
                }
                onClick={() => handleStartGame(true)}
                className="relative overflow-hidden"
              >
                {canPlay?.canPlayFree && (
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-75 animate-pulse blur-sm" />
                )}
                <span className="relative z-10">Free Play</span>
              </Button>
              <p className="text-xs text-muted-foreground">
                {canPlay && canPlay.nextFreeBlackjack
                  ? ` Come back in ${formatDistanceToNow(canPlay.nextFreeBlackjack)}`
                  : ""}
              </p>
            </div>
          </div>

          <Separator className="my-4 w-full opacity-50" />

          {game && (
            <>
              <div className="flex flex-col items-center gap-4">
                <h3 className="text-lg font-semibold">Dealer&apos;s Hand</h3>
                <div className="grid grid-cols-3 md:flex md:flex-wrap gap-2 justify-center items-center">
                  {game.dealerHand.map(
                    (
                      card: { suit: string; value: string; hidden?: boolean },
                      i: Key | null | undefined
                    ) => (
                      <div key={i}>{renderCard(card)}</div>
                    )
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {game.status !== "PLAYING" &&
                    `Dealers value: ${calculateHandValue(game.dealerHand)}`}
                </div>
              </div>
              <Separator className="my-4 w-full opacity-50" />

              <div className="flex flex-col items-center gap-4">
                <h3 className="text-lg font-semibold">Your Hand</h3>
                <div className="grid grid-cols-3 md:flex md:flex-wrap gap-2 justify-center items-center">
                  {game.playerHand.map(
                    (
                      card: { suit: string; value: string; hidden?: boolean },
                      i: Key | null | undefined
                    ) => (
                      <div key={i}>{renderCard(card)}</div>
                    )
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {`Your value: ${calculateHandValue(game.playerHand)}`}
                </div>
                {game.status === "PLAYING" && (
                  <div className="flex gap-2">
                    <Button onClick={handleStand} variant="secondary">
                      Stand
                    </Button>
                    <Button onClick={handleHit}>Hit</Button>
                  </div>
                )}
              </div>

              {game.status !== "PLAYING" && (
                <div className="text-center p-4 rounded-lg bg-gray-100 dark:bg-background/50 min-h-[80px] flex items-center justify-center">
                  <h2 className="text-2xl font-bold mb-4">
                    {game.status === "PLAYER_BUSTED" && "Bust! You lost!"}
                    {game.status === "DEALER_BUSTED" &&
                      "Dealer busted! You won!"}
                    {game.status === "PLAYER_WON" && "You Won!"}
                    {game.status === "DEALER_WON" && "Dealer won!"}
                    {game.status === "PUSH" && "Push!"}
                  </h2>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Separator className="my-4 w-full opacity-50" />

      <div className="text-sm text-center">
        <div className="font-semibold mb-2 text-lg">Blackjack History</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">When</TableHead>
              <TableHead className="text-center">Hand</TableHead>
              <TableHead className="text-center">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gameHistory?.map((game) => (
              <TableRow key={game._id}>
                <TableCell className="text-center text-xs">
                  {formatDistanceToNow(game._creationTime)} ago
                </TableCell>
                <TableCell className="text-center">
                  <MiniHandDisplay hand={game.playerHand} />
                </TableCell>
                <TableCell className="text-center">
                  {game.status === "PLAYER_BUSTED" && (
                    <div className="flex flex-col gap-1 items-center">
                      <span className="text-red-500">🔗-{game.betAmount}</span>
                      <Badge variant="outline">Bust</Badge>
                    </div>
                  )}
                  {game.status === "DEALER_BUSTED" && (
                    <div className="flex flex-col gap-1 items-center">
                      <span className="text-green-500">🔗+{game.payout}</span>
                      <Badge variant="outline">Dealer Bust</Badge>
                    </div>
                  )}
                  {game.status === "PLAYER_WON" && (
                    <div className="flex flex-col gap-1 items-center">
                      <span className="text-green-500">🔗+{game.payout}</span>
                      <Badge variant="outline">Win</Badge>
                    </div>
                  )}
                  {game.status === "DEALER_WON" && (
                    <div className="flex flex-col gap-1 items-center">
                      <span className="text-red-500">🔗-{game.betAmount}</span>
                      <Badge variant="outline">Dealer Win</Badge>
                    </div>
                  )}
                  {game.status === "PUSH" && (
                    <div className="flex flex-col gap-1 items-center">
                      <span className="text-gray-500">🔗0</span>
                      <Badge variant="outline">Push</Badge>
                    </div>
                  )}
                  {game.status === "PLAYER_BLACKJACK" && (
                    <div className="flex flex-col gap-1 items-center">
                      <span className="text-green-500">🔗+{game.payout}</span>
                      <Badge variant="outline" className="bg-green-500">
                        Blackjack
                      </Badge>
                    </div>
                  )}
                  {game.status === "PLAYING" && (
                    <div className="flex flex-col gap-1 items-center">
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

function MiniHandDisplay({
  hand,
}: {
  hand: { suit: string; value: string }[];
}) {
  const renderCard = (card: {
    suit: string;
    value: string;
    hidden?: boolean;
  }) => {
    if (card.hidden) {
      return (
        <Card className="w-6 h-8 flex items-center justify-center bg-primary">
          <span className="text-white text-2xl">
            <Logo />
          </span>
        </Card>
      );
    }

    const isRed = card.suit === "♥" || card.suit === "♦";
    return (
      <Card className="w-6 h-8 flex flex-row items-center justify-between p-1">
        <span className={cn("text-xs", isRed && "text-red-500")}>
          {card.value}
        </span>
        <span className={cn("text-xs", isRed && "text-red-500")}>
          {card.suit}
        </span>
      </Card>
    );
  };

  return (
    <div className="flex flex-row gap-2 justify-center items-center">
      {hand.map((card, i) => renderCard({ ...card, hidden: false }))}
    </div>
  );
}
