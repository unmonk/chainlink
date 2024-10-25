"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Separator } from "../ui/separator";
import { formatDistanceToNow } from "date-fns";

const SYMBOLS = {
  CHERRY: "🍒",
  BAR: "🍫",
  SEVEN: "🪙",
  STAR: "⭐",
  DIAMOND: "💎",
  COIN: "🔗",
};

interface SlotMachineProps {
  userId: Id<"users">;
}

export function SlotMachine({ userId }: SlotMachineProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSymbols, setCurrentSymbols] = useState<string[]>(
    Array(5).fill(SYMBOLS.CHERRY)
  );
  const [lastWin, setLastWin] = useState<{
    payout: number;
    matches: number;
  } | null>(null);

  const spinStatus = useQuery(api.coingames.canSpin, { userId });
  const spin = useMutation(api.coingames.spin);
  const spins = useQuery(api.coingames.getSpins, { userId });

  const handleSpin = async (useFreeSpin: boolean) => {
    if (isSpinning) return;

    try {
      setIsSpinning(true);
      setLastWin(null);

      // Animate spinning
      const spinInterval = setInterval(() => {
        setCurrentSymbols(
          Array(5)
            .fill(0)
            .map(() => {
              const symbols = Object.values(SYMBOLS);
              return symbols[Math.floor(Math.random() * symbols.length)];
            })
        );
      }, 100);

      // Perform actual spin
      const result = await spin({ userId, useFreeSpin });

      // Stop animation and show result
      setTimeout(() => {
        clearInterval(spinInterval);
        const symbols = result.result.map((symbol) => SYMBOLS[symbol]);
        setCurrentSymbols(symbols);
        setIsSpinning(false);

        // Calculate matches for highlighting
        let matches = 1;
        for (let i = 1; i < symbols.length; i++) {
          if (symbols[i] === symbols[0]) {
            matches++;
          } else {
            break;
          }
        }

        if (result.payout > 0) {
          setLastWin({ payout: result.payout, matches });
        }
      }, 1000);
    } catch (error) {
      setIsSpinning(false);
      setLastWin(null);
    }
  };

  if (!spinStatus) return <div>Loading...</div>;

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Slot Display */}
        <div className="flex justify-center gap-2 p-4 bg-black rounded-lg">
          {currentSymbols.map((symbol, index) => (
            <div
              key={index}
              className={cn(
                "w-20 h-20 flex items-center justify-center text-4xl",
                "bg-white rounded-md shadow-inner",
                "transition-all duration-100",
                isSpinning && "animate-bounce",
                // Highlight winning symbols
                lastWin &&
                  index < lastWin.matches &&
                  "ring-4 ring-green-400 bg-green-50"
              )}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {symbol}
            </div>
          ))}
        </div>

        {/* Result Box */}
        <div className="text-center p-4 rounded-lg bg-slate-100 dark:bg-slate-800 min-h-[80px] flex items-center justify-center">
          {isSpinning ? (
            <div className="text-lg font-semibold animate-pulse">
              Spinning...
            </div>
          ) : lastWin ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-500">
                🎉 Winner! 🎉
              </div>
              <div className="text-lg text-balance">
                {lastWin.matches} matching symbols - You won 🔗{lastWin.payout}{" "}
                links!
              </div>
            </div>
          ) : (
            <div className="text-lg text-muted-foreground text-balance">
              Match 2 or more symbols in a row to win!
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <div className="flex flex-col gap-2">
            <Button
              size="lg"
              variant={spinStatus.canFreeSpin ? "default" : "outline"}
              disabled={isSpinning || !spinStatus.canFreeSpin}
              onClick={() => handleSpin(true)}
            >
              {isSpinning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Free Spin"
              )}
            </Button>
            {!spinStatus.canFreeSpin && (
              <p className="text-xs text-muted-foreground text-center text-pretty">
                Come back in {formatDistanceToNow(spinStatus.nextFreeSpinTime!)}
              </p>
            )}
          </div>

          <Button
            size="lg"
            variant="secondary"
            disabled={isSpinning || !spinStatus.canPaidSpin}
            onClick={() => handleSpin(false)}
          >
            {isSpinning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              `Spin (🔗${spinStatus.spinCost})`
            )}
          </Button>
        </div>

        {/* Paytable */}
        <div className="text-sm text-center">
          <Collapsible>
            <CollapsibleTrigger>
              <div className="font-semibold mb-2 flex items-center gap-2">
                Pay Table <ChevronDown className="w-4 h-4" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Matches</TableHead>
                    <TableHead className="text-center">Payout</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-center">5 Symbols</TableCell>
                    <TableCell className="text-center font-medium">
                      1000 coins
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-center">4 Symbols</TableCell>
                    <TableCell className="text-center font-medium">
                      100 coins
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-center">3 Symbols</TableCell>
                    <TableCell className="text-center font-medium">
                      50 coins
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-center">2 Symbols</TableCell>
                    <TableCell className="text-center font-medium">
                      10 coins
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Spins History */}
      <div className="text-sm text-center">
        <div className="font-semibold mb-2">Spins History</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">When</TableHead>
              <TableHead className="text-center">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spins?.map((spin) => (
              <TableRow key={spin._id}>
                <TableCell className="text-center">
                  {formatDistanceToNow(spin.spunAt)} ago
                </TableCell>
                <TableCell className="text-center">
                  {spin.payout > 0 ? (
                    <span className="text-green-500 font-medium">
                      🔗 {spin.payout}
                    </span>
                  ) : (
                    <span className="text-red-500">LOSE</span>
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
