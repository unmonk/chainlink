`use client`;
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { useForm, Form, FormProvider } from "react-hook-form";
import { Button } from "../ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { ACTIVE_LEAGUES } from "@/convex/utils";
import Image from "next/image";
import { leagueLogos } from "@/convex/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { manuallyFinalizeMatchup } from "@/convex/matchups";
import { toast } from "sonner";
import { forceCancelPicks, releasePicksAllWinners } from "@/convex/picks";

const EditMatchupFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  league: z.string().min(1, { message: "League is required." }),
  type: z.enum(["SCORE", "STATS", "LEADERS", "BOOLEAN", "CUSTOM"]),
  typeDetails: z.string().optional(),
  cost: z.number().min(0, { message: "Cost must be a non-negative number." }),
  homeTeam: z.object({
    id: z.string(),
    name: z.string(),
    score: z.number(),
    image: z.string(),
  }),
  awayTeam: z.object({
    id: z.string(),
    name: z.string(),
    score: z.number(),
    image: z.string(),
  }),
  startTime: z.number(),
  active: z.boolean(),
  status: z.string(),
  featured: z.boolean(),
  gameId: z.string(),
  winnerId: z.string().optional(),
  metadata: z.any(),
  featuredType: z.enum(["CHAINBUILDER", "SPONSORED"]).optional(),
});

export interface EditMatchupFormProps {
  row: z.infer<typeof EditMatchupFormSchema> & { _id: string };
  totalPicks: number;
}

export function EditMatchupForm({ row, totalPicks }: EditMatchupFormProps) {
  const updateMatchup = useMutation(api.matchups.updateMatchup);
  const releasePicksAllWinners = useMutation(api.picks.releasePicksAllWinners);
  const releasePicksAllLosers = useMutation(api.picks.releasePicksAllLosers);
  const releasePicksAllPushes = useMutation(api.picks.releasePicksAllPushes);
  const forceCancelPicks = useMutation(api.picks.forceCancelPicks);

  const methods = useForm<z.infer<typeof EditMatchupFormSchema>>({
    resolver: zodResolver(EditMatchupFormSchema),
    defaultValues: {
      title: row.title,
      league: row.league,
      type: row.type,
      typeDetails: row.typeDetails,
      cost: row.cost,
      startTime: row.startTime,
      active: row.active,
      featured: row.featured,
      featuredType: row.featuredType,
      homeTeam: {
        id: row.homeTeam.id,
        name: row.homeTeam.name,
        score: row.homeTeam.score,
        image: row.homeTeam.image,
      },
      awayTeam: {
        id: row.awayTeam.id,
        name: row.awayTeam.name,
        score: row.awayTeam.score,
        image: row.awayTeam.image,
      },
      status: row.status,
      gameId: row.gameId,
      winnerId: row.winnerId,
      metadata: row.metadata,
    },
  });

  async function handleReleasePicks(releaseType: string) {
    try {
      if (releaseType === "DELETE") {
        await forceCancelPicks({
          matchupId: row._id as Id<"matchups">,
        });
        toast.success("Picks deleted");
      }
      if (releaseType === "ALL_WINNERS") {
        await releasePicksAllWinners({
          matchupId: row._id as Id<"matchups">,
        });
        toast.success("Picks released, all winners");
      }
      if (releaseType === "ALL_LOSERS") {
        await releasePicksAllLosers({
          matchupId: row._id as Id<"matchups">,
        });
        toast.success("Picks released, all losers");
      }
      if (releaseType === "ALL_PUSHES") {
        await releasePicksAllPushes({
          matchupId: row._id as Id<"matchups">,
        });
        toast.success("Picks released, all pushes");
      }
    } catch (error) {
      console.error("Failed to release picks:", error);
    }
  }

  async function onSubmit(values: z.infer<typeof EditMatchupFormSchema>) {
    try {
      await updateMatchup({
        matchupId: row._id as Id<"matchups">,
        ...values,
        startTime: values.startTime,
      });
      // Close the dialog or show a success message
    } catch (error) {
      console.error("Failed to update matchup:", error);
      // Show an error message to the user
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={
            row.status === "STATUS_FINAL" || row.status === "STATUS_FULL_TIME"
          }
          className={
            row.status !== "STATUS_SCHEDULED"
              ? "border-red-500 border animate-pulse"
              : ""
          }
        >
          Edit
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-[425px] px-4">
        <DrawerHeader>
          <DrawerTitle>Edit Matchup</DrawerTitle>
          <DrawerDescription>
            {row.title} - {row.league}
          </DrawerDescription>
        </DrawerHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            {/* Form fields go here */}
            <FormField
              control={methods.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matchup Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="league"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>League</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a league" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ACTIVE_LEAGUES.map((league) => (
                        <SelectItem key={league} value={league}>
                          <div className="flex items-center space-x-2">
                            <Image
                              src={leagueLogos[league]}
                              alt={league}
                              height={40}
                              width={40}
                              style={{
                                maxWidth: "100%",
                                height: "auto"
                              }} />
                            <span>{league}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={methods.control}
                  name="awayTeam.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Away Team Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="awayTeam.image"
                  render={({ field }) => (
                    <>
                      {field.value && (
                        <div className="flex items-center justify-center">
                          <Image
                            src={field.value}
                            alt={"Away Team Image"}
                            width={40}
                            height={40}
                            style={{
                              maxWidth: "100%",
                              height: "auto"
                            }} />
                        </div>
                      )}
                      <FormItem>
                        <FormLabel>Away Team Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="awayTeam.score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Away Team Score</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={methods.control}
                  name="homeTeam.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Team Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="homeTeam.image"
                  render={({ field }) => (
                    <>
                      {field.value && (
                        <div className="flex items-center justify-center">
                          <Image
                            src={field.value}
                            alt={"Home Team Image"}
                            width={40}
                            height={40}
                            style={{
                              maxWidth: "100%",
                              height: "auto"
                            }} />
                        </div>
                      )}
                      <FormItem>
                        <FormLabel>Home Team Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="homeTeam.score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Team Score</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={methods.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        {["SCORE", "STATS", "LEADERS", "BOOLEAN", "CUSTOM"].map(
                          (type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="typeDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type Details</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={new Date(
                        field.value -
                          new Date(field.value).getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .slice(0, 16)}
                      onChange={(e) => {
                        const localDate = new Date(e.target.value);
                        const utcDate = new Date(
                          localDate.getTime() +
                            localDate.getTimezoneOffset() * 60000
                        );
                        field.onChange(utcDate);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            {methods.watch("featured") && (
              <FormField
                control={methods.control}
                name="featuredType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a featured type" />
                        </SelectTrigger>
                        <SelectContent>
                          {["CHAINBUILDER", "SPONSORED"].map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <hr className="my-4" />
            <div className="flex flex-col space-y-2">
              <h4 className="text-lg font-medium">In Progress Actions</h4>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Finalize Matchup</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Finalize Matchup</DialogTitle>
                    <DialogDescription>
                      Finalizing the matchup will close the match and score all
                      picks the same, or with standard win/loss scoring
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col space-y-2">
                    <DialogTrigger asChild>
                      <Button
                        //onClick={() => handleFinalize("STANDARD_FINAL")}
                        variant={"secondary"}
                      >
                        Score Regularly
                      </Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <Button
                        // onClick={() => handleFinalize("ALL_WINNERS")}
                        variant={"outline"}
                      >
                        All Picks Win
                      </Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <Button
                        //onClick={() => handleFinalize("ALL_LOSERS")}
                        variant={"outline"}
                      >
                        All Picks Lose
                      </Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <Button
                        //onClick={() => handleFinalize("ALL_PUSHES")}
                        variant={"outline"}
                      >
                        All Picks Push
                      </Button>
                    </DialogTrigger>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">Release Picks</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Release Picks</DialogTitle>
                    <DialogDescription>
                      Release the picks without finalizing the matchup.
                      <br />
                      <span className="text-lg text-red-500">
                        <span className="font-bold text-xl">{totalPicks}</span>{" "}
                        picks will be released
                      </span>
                      <br />
                      <b>Warning: This action cannot be undone.</b>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col space-y-2">
                    <DialogClose asChild>
                      <Button
                        onClick={() => handleReleasePicks("DELETE")}
                        variant={"destructive"}
                      >
                        Delete All Picks
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        onClick={() => handleReleasePicks("ALL_WINNERS")}
                        variant={"outline"}
                      >
                        All Picks Win
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        onClick={() => handleReleasePicks("ALL_LOSERS")}
                        variant={"outline"}
                      >
                        All Picks Lose
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        onClick={() => handleReleasePicks("ALL_PUSHES")}
                        variant={"outline"}
                      >
                        All Picks Push
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr className="my-4" />
            <div className="flex justify-end space-x-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button type="submit">Update Matchup</Button>
            </div>
          </form>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  );
}
