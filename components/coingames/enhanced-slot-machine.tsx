"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Loader2, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { RainbowButton } from "../ui/rainbow-button";
import Loading from "../ui/loading";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SlotSymbolType } from "@/convex/schema";

// Enhanced SVG symbols
const SYMBOL_ICONS = {
  CHERRY: (
    <span role="img" aria-label="cherry" style={{ fontSize: 28 }}>
      🏀
    </span>
  ),
  BAR: (
    <span role="img" aria-label="cherry" style={{ fontSize: 28 }}>
      ⚽
    </span>
  ),
  SEVEN: (
    <span role="img" aria-label="seven" style={{ fontSize: 28 }}>
      🏈
    </span>
  ),
  STAR: (
    <span role="img" aria-label="star" style={{ fontSize: 28 }}>
      🏒
    </span>
  ),
  DIAMOND: (
    <span role="img" aria-label="diamond" style={{ fontSize: 28 }}>
      💎
    </span>
  ),
  COIN: (
    <span role="img" aria-label="coin" style={{ fontSize: 28 }}>
      ⚾
    </span>
  ),
  WILD: (
    <span role="img" aria-label="wild" style={{ fontSize: 28 }}>
      🃏
    </span>
  ),
  SCATTER: (
    <span role="img" aria-label="scatter" style={{ fontSize: 28 }}>
      🎰
    </span>
  ),
};

const PAYLINE_PATTERNS = {
  HORIZONTAL_1: "M 0 16.67 L 100 16.67",
  HORIZONTAL_2: "M 0 50 L 100 50",
  HORIZONTAL_3: "M 0 83.33 L 100 83.33",
  V_SHAPE: "M 0 0 L 50 100 L 100 0",
  V_SHAPE_UPSIDE_DOWN: "M 0 100 L 50 0 L 100 100",
};

export function EnhancedSlotMachine() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [currentReels, setCurrentReels] = useState<SlotSymbolType[][]>(
    Array(3)
      .fill(null)
      .map(() => Array(5).fill("DIAMOND"))
  );
  const [winningPaylines, setWinningPaylines] = useState<any[]>([]);
  const [lastWin, setLastWin] = useState<{
    payout: number;
    paylines: any[];
  } | null>(null);
  const [showPaylines, setShowPaylines] = useState(false);

  const spinGame = useQuery(api.coingames.getEnhancedSpinGame);
  const spin = useMutation(api.coingames.enhancedSpin);

  const handleSpin = async (useFreeSpin: boolean) => {
    if (isSpinning || !spinGame) return;

    try {
      setIsSpinning(true);
      setLastWin(null);
      setWinningPaylines([]);
      setShowPaylines(false);

      // Animate spinning
      const spinInterval = setInterval(() => {
        setCurrentReels(
          Array(3)
            .fill(null)
            .map(() =>
              Array(5)
                .fill(null)
                .map(() => {
                  const symbols = Object.keys(SYMBOL_ICONS);
                  return symbols[
                    Math.floor(Math.random() * symbols.length)
                  ] as SlotSymbolType;
                })
            )
        );
      }, 100);

      // Perform actual spin
      const result = await spin({
        userId: spinGame.userId,
        useFreeSpin,
        betAmount: useFreeSpin ? 10 : betAmount,
      });

      // Stop animation and show result
      setTimeout(() => {
        clearInterval(spinInterval);
        setCurrentReels(result.result);
        setIsSpinning(false);

        if (result.totalPayout > 0) {
          setLastWin({
            payout: result.totalPayout,
            paylines: result.paylineResults,
          });
          setWinningPaylines(
            result.paylineResults.filter((p: any) => p.payout > 0)
          );
          setShowPaylines(true);
        } else {
          setShowPaylines(false);
        }
      }, 1500);
    } catch (error) {
      setIsSpinning(false);
      toast.error("Something went wrong");
    }
  };

  const adjustBet = (amount: number) => {
    const newBet = Math.max(
      spinGame?.config.minBet || 1,
      Math.min(spinGame?.config.maxBet || 100, betAmount + amount)
    );
    setBetAmount(newBet);
  };

  if (!spinGame) return <Loading />;

  return (
    <Card className="p-6 w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      <div className="space-y-6">
        {/* Betting Controls */}
        <div className="flex items-center justify-center gap-4 p-4 bg-background/50 rounded-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustBet(-1)}
            disabled={betAmount <= (spinGame.config.minBet || 1)}
          >
            <Minus className="w-4 h-4" />
          </Button>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">Bet Amount</div>
            <div className="text-2xl font-bold text-yellow-400">
              🔗{betAmount}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustBet(1)}
            disabled={betAmount >= (spinGame.config.maxBet || 100)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            size="lg"
            variant={spinGame.canFreeSpin ? "default" : "outline"}
            disabled={isSpinning || !spinGame.canFreeSpin}
            onClick={() => handleSpin(true)}
            className="relative overflow-hidden h-16 flex flex-col items-center justify-center"
          >
            {isSpinning ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : (
              <>
                {spinGame.canFreeSpin && (
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-75 animate-pulse blur-sm" />
                )}
                <span className="relative z-10 text-lg">Free Spin</span>
                {!spinGame.canFreeSpin && (
                  <p className="text-center text-xs text-muted-foreground">
                    available in{" "}
                    {formatDistanceToNow(spinGame.nextFreeSpinTime!)}
                  </p>
                )}
              </>
            )}
          </Button>

          <RainbowButton
            disabled={isSpinning || spinGame.userCoins < betAmount}
            onClick={() => handleSpin(false)}
            className="h-16 text-lg"
          >
            {isSpinning ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : (
              `Spin 🔗${betAmount}`
            )}
          </RainbowButton>
        </div>

        {/* Slot Display */}
        <div className="relative flex justify-center items-center">
          <div
            className="relative"
            style={{
              width: 400, // or whatever fits your design
              aspectRatio: "5 / 3",
              display: "flex",
              alignItems: "stretch",
              justifyContent: "stretch",
            }}
          >
            {/* The grid */}
            <div
              className="absolute inset-0 grid grid-cols-5 grid-rows-3"
              style={{ gap: 8 }} // 8px gap between cells
            >
              {currentReels.map((reel, rowIndex) =>
                reel.map((symbol, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    className={cn(
                      "flex items-center justify-center",
                      "bg-white rounded-lg shadow-lg border-2",
                      "transition-all duration-300",
                      isSpinning && "animate-bounce",
                      winningPaylines.some((payline) =>
                        payline.positions?.some(
                          ([r, c]: number[]) => r === rowIndex && c === colIndex
                        )
                      ) && "ring-4 ring-yellow-400 bg-yellow-50 scale-110"
                    )}
                    style={{
                      width: "100%",
                      height: "100%",
                      aspectRatio: "1 / 1",
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-10 h-10">{SYMBOL_ICONS[symbol]}</div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Payline Overlay */}
            <AnimatePresence>
              {showPaylines && winningPaylines.length > 0 && (
                <motion.svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ zIndex: 10 }}
                >
                  {winningPaylines.map((payline, index) => (
                    <motion.path
                      key={payline.type}
                      d={
                        PAYLINE_PATTERNS[
                          payline.type as keyof typeof PAYLINE_PATTERNS
                        ]
                      }
                      stroke="yellow"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                    />
                  ))}
                </motion.svg>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Win Display */}
        <AnimatePresence>
          {lastWin && (
            <motion.div
              className="text-center p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <div className="text-3xl font-bold text-white mb-2">
                🎉 WINNER! 🎉
              </div>
              <div className="text-xl text-white">
                You won 🔗{lastWin.payout} links!
              </div>
              {lastWin.paylines.filter((p: any) => p.payout > 0).length > 1 && (
                <div className="text-sm text-white/80 mt-2">
                  {lastWin.paylines.filter((p: any) => p.payout > 0).length}{" "}
                  winning paylines!
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Winning Paylines Breakdown */}
        <AnimatePresence>
          {lastWin &&
            lastWin.paylines.filter((p: any) => p.payout > 0).length > 0 && (
              <motion.div
                className="bg-background/50 rounded-lg p-4 border border-yellow-500/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h3 className="text-lg font-semibold mb-4 text-center text-yellow-400">
                  🎯 Winning Paylines Breakdown
                </h3>

                <div className="space-y-4">
                  {lastWin.paylines
                    .filter((payline: any) => payline.payout > 0)
                    .map((payline: any, index: number) => {
                      const paylineConfig = spinGame.config.paylines.find(
                        (p: any) => p.type === payline.type
                      );
                      const payoutConfig = spinGame.config.payouts.find(
                        (p: any) => p.line === payline.matches
                      );
                      const scatterPayoutConfig =
                        spinGame.config.scatterPayouts?.find(
                          (p: any) => p.count === payline.matches
                        );

                      // Check if this is a scatter win
                      const isScatterWin = payline.type === "SCATTER";

                      return (
                        <motion.div
                          key={payline.type}
                          className="bg-background/30 rounded-lg p-3 border border-yellow-500/20"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={cn(
                                  isScatterWin
                                    ? "bg-purple-500/20 text-purple-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                )}
                              >
                                {isScatterWin
                                  ? "Scatter Win"
                                  : paylineConfig?.name || payline.type}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {isScatterWin
                                  ? `${payline.matches} scatter symbols anywhere on reels`
                                  : `${payline.matches} matching symbols`}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-400">
                                🔗{payline.payout}
                              </div>
                            </div>
                          </div>

                          {/* Symbol Display */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm text-muted-foreground">
                              {isScatterWin ? "Scatter Symbols:" : "Symbols:"}
                            </span>
                            <div className="flex gap-1">
                              {payline.symbols.map(
                                (symbol: string, symbolIndex: number) => {
                                  const originalSymbol =
                                    payline.originalSymbols?.[symbolIndex] ||
                                    symbol;
                                  const isWildSubstitution =
                                    originalSymbol === "WILD" &&
                                    symbol !== "WILD";

                                  return (
                                    <div
                                      key={symbolIndex}
                                      className={cn(
                                        "w-10 h-10 flex items-center justify-center rounded border-2 relative",
                                        isScatterWin
                                          ? "border-purple-500 bg-purple-500/10"
                                          : symbolIndex < payline.matches
                                            ? "border-green-500 bg-green-500/10"
                                            : "border-gray-400 bg-gray-500/10",
                                        isWildSubstitution &&
                                          "border-orange-500 bg-orange-500/10"
                                      )}
                                    >
                                      <div className="w-5 h-5 flex items-center justify-center">
                                        {
                                          SYMBOL_ICONS[
                                            symbol as keyof typeof SYMBOL_ICONS
                                          ]
                                        }
                                      </div>
                                      {isWildSubstitution && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                                          W
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          {/* Wild Substitution Info */}
                          {payline.wildSubstitutions &&
                            payline.wildSubstitutions.length > 0 && (
                              <div className="mb-3 p-2 bg-orange-500/10 rounded border border-orange-500/20">
                                <div className="text-xs text-orange-400 font-medium mb-1">
                                  Wild Substitutions:
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {payline.wildSubstitutions.map(
                                    (sub: any, idx: number) => (
                                      <div key={idx}>
                                        Position {sub.position + 1}: WILD →{" "}
                                        {sub.substituted}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Payout Calculation */}
                          <div className="text-xs text-muted-foreground bg-background/20 rounded p-2">
                            <div className="font-medium mb-1">
                              Payout Calculation:
                            </div>
                            <div className="space-y-1">
                              {isScatterWin ? (
                                <>
                                  <div>
                                    Base scatter payout for {payline.matches}{" "}
                                    scatters: 🔗
                                    {scatterPayoutConfig?.payout || 0}
                                  </div>
                                  <div>
                                    Bet multiplier: {betAmount} ÷{" "}
                                    {spinGame.config.defaultBet} ={" "}
                                    {(
                                      betAmount / spinGame.config.defaultBet
                                    ).toFixed(2)}
                                    x
                                  </div>
                                  <div className="font-medium text-green-400">
                                    Final payout: 🔗
                                    {scatterPayoutConfig?.payout || 0} ×{" "}
                                    {(
                                      betAmount / spinGame.config.defaultBet
                                    ).toFixed(2)}{" "}
                                    = 🔗{payline.payout}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div>
                                    Base payout for {payline.matches} symbols:
                                    🔗
                                    {payoutConfig?.payout || 0}
                                  </div>
                                  <div>
                                    Bet multiplier: {betAmount} ÷{" "}
                                    {spinGame.config.defaultBet} ={" "}
                                    {(
                                      betAmount / spinGame.config.defaultBet
                                    ).toFixed(2)}
                                    x
                                  </div>
                                  <div className="font-medium text-green-400">
                                    Final payout: 🔗{payoutConfig?.payout || 0}{" "}
                                    ×{" "}
                                    {(
                                      betAmount / spinGame.config.defaultBet
                                    ).toFixed(2)}{" "}
                                    = 🔗{payline.payout}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>

                {/* Total Payout Summary */}
                <div className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Payout:</span>
                    <span className="text-xl font-bold text-green-400">
                      🔗{lastWin.payout}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {lastWin.paylines.filter((p: any) => p.payout > 0).length}{" "}
                    winning payline
                    {lastWin.paylines.filter((p: any) => p.payout > 0)
                      .length !== 1
                      ? "s"
                      : ""}{" "}
                    combined
                  </div>
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        {/* Paytable */}
        <Collapsible>
          <CollapsibleTrigger>
            <div className="font-semibold mb-2 flex items-center gap-2 text-center justify-center">
              Pay Table <ChevronDown className="w-4 h-4" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Symbols</TableHead>
                      <TableHead className="text-center">Payout</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {spinGame.config.payouts
                      .filter((payout) => payout.line >= 2)
                      .map((payout) => (
                        <TableRow key={payout.line}>
                          <TableCell className="text-center">
                            {payout.line} Matching
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            🔗
                            {payout.payout *
                              (betAmount / spinGame.config.defaultBet)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                {/* Scatter Payouts Table */}
                {spinGame.config.scatterPayouts && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">
                          🎰 Scatters
                        </TableHead>
                        <TableHead className="text-center">Payout</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {spinGame.config.scatterPayouts.map((scatterPayout) => (
                        <TableRow key={scatterPayout.count}>
                          <TableCell className="text-center">
                            {scatterPayout.count} Scatters
                          </TableCell>
                          <TableCell className="text-center font-medium text-purple-400">
                            🔗
                            {scatterPayout.payout *
                              (betAmount / spinGame.config.defaultBet)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Paylines</h4>
                <div className="space-y-1 text-sm">
                  {spinGame.config.paylines.map((payline) => (
                    <div key={payline.type} className="flex justify-between">
                      <span>{payline.name}</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  ))}
                </div>

                {/* Scatter Info */}
                <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <h4 className="font-semibold text-purple-400 mb-2">
                    🎰 Scatter Wins
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Get 3 or more scatter symbols anywhere on the reels to win!
                    Scatters don&apos;t need to be on a payline.
                  </p>
                </div>

                {/* Wild Info */}
                <div className="mt-4 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <h4 className="font-semibold text-orange-400 mb-2">
                    🃏 Wild Symbols
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Wild symbols substitute for any symbol to create winning
                    combinations! Example: 2 BALL + 1 WILD = 3 BALL win.
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Separator className="my-6" />

      {/* Spins History */}
      <div className="text-center">
        <div className="font-semibold mb-4">Recent Spins</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">When</TableHead>
              <TableHead className="text-center">Bet</TableHead>
              <TableHead className="text-center">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spinGame.spins?.map((spin) => (
              <TableRow key={spin._id}>
                <TableCell className="text-center">
                  {formatDistanceToNow(spin.spunAt)} ago
                </TableCell>
                <TableCell className="text-center">
                  🔗{spin.betAmount || 0}
                </TableCell>
                <TableCell className="text-center">
                  {spin.payout > 0 ? (
                    <span className="text-green-500 font-medium">
                      🔗+{spin.payout}
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
