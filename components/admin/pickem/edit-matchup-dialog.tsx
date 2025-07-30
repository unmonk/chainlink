"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const formSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "LOCKED", "COMPLETE"]),
  homeTeamScore: z.number().min(0, "Score must be 0 or greater"),
  awayTeamScore: z.number().min(0, "Score must be 0 or greater"),
});

interface EditMatchupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matchup: {
    _id: Id<"pickemMatchups">;
    title: string;
    status: string;
    homeTeam: { id: string; name: string; score: number; image: string };
    awayTeam: { id: string; name: string; score: number; image: string };
    winnerId?: string;
  } | null;
}

export function EditMatchupDialog({
  open,
  onOpenChange,
  matchup,
}: EditMatchupDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: (matchup?.status as any) || "PENDING",
      homeTeamScore: matchup?.homeTeam.score || 0,
      awayTeamScore: matchup?.awayTeam.score || 0,
    },
  });

  const updateMatchup = useMutation(api.pickem.updatePickemMatchup);

  // Reset form when matchup changes
  useEffect(() => {
    if (matchup) {
      form.reset({
        status: matchup.status as any,
        homeTeamScore: matchup.homeTeam.score,
        awayTeamScore: matchup.awayTeam.score,
      });
    }
  }, [matchup, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!matchup) return;

    setIsLoading(true);
    try {
      // Determine winner based on scores
      let winnerId: string | undefined = undefined;
      if (values.homeTeamScore > values.awayTeamScore) {
        winnerId = matchup.homeTeam.id;
      } else if (values.awayTeamScore > values.homeTeamScore) {
        winnerId = matchup.awayTeam.id;
      }
      // If scores are tied, winnerId remains undefined

      await updateMatchup({
        matchupId: matchup._id,
        status: values.status,
        title: matchup.title,
        gameId: `${matchup.homeTeam.id}-vs-${matchup.awayTeam.id}`, // Reconstruct gameId
        startTime: Date.now(), // This would need to be passed from parent or kept as original
        homeTeam: {
          ...matchup.homeTeam,
          score: values.homeTeamScore,
        },
        awayTeam: {
          ...matchup.awayTeam,
          score: values.awayTeamScore,
        },
        winnerId,
      });

      toast.success("Matchup updated successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating matchup:", error);
      toast.error("Failed to update matchup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "LOCKED":
        return "destructive";
      case "COMPLETE":
        return "outline";
      case "PENDING":
      default:
        return "outline";
    }
  };

  const getCurrentWinner = () => {
    const homeScore = form.watch("homeTeamScore");
    const awayScore = form.watch("awayTeamScore");

    if (homeScore > awayScore) {
      return matchup?.homeTeam;
    } else if (awayScore > homeScore) {
      return matchup?.awayTeam;
    }
    return null; // Tie
  };

  if (!matchup) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Matchup Results & Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Matchup Info */}
          <div className="space-y-2">
            <h4 className="font-medium">{matchup.title}</h4>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Image
                  src={matchup.awayTeam.image}
                  alt={matchup.awayTeam.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-medium">{matchup.awayTeam.name}</span>
              </div>
              <span className="text-muted-foreground">@</span>
              <div className="flex items-center gap-2">
                <Image
                  src={matchup.homeTeam.image}
                  alt={matchup.homeTeam.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-medium">{matchup.homeTeam.name}</span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Status Field */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">PENDING</Badge>
                            <span>Not started yet</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="ACTIVE">
                          <div className="flex items-center gap-2">
                            <Badge variant="default">ACTIVE</Badge>
                            <span>Users can make picks</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="LOCKED">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">LOCKED</Badge>
                            <span>Picks locked, game in progress</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="COMPLETE">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">COMPLETE</Badge>
                            <span>Game finished, results final</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Scores */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="awayTeamScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Image
                          src={matchup.awayTeam.image}
                          alt={matchup.awayTeam.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        {matchup.awayTeam.name} Score
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="homeTeamScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Image
                          src={matchup.homeTeam.image}
                          alt={matchup.homeTeam.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        {matchup.homeTeam.name} Score
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Winner Preview */}
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Current Winner:</span>
                  {getCurrentWinner() ? (
                    <div className="flex items-center gap-2">
                      <Image
                        src={getCurrentWinner()!.image}
                        alt={getCurrentWinner()!.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span>{getCurrentWinner()!.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Tie Game</span>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  Update Matchup
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
