"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ACTIVE_LEAGUES, leagueLogos } from "@/convex/utils";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SponsoredMatchupForm } from "../sponsored-matchup-form";
import { ImageUpload } from "@/components/ui/image-upload";
import { DateTimePicker } from "@/components/ui/date-time-picker";

const CreateMatchupFormSchema = z.object({
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
  featured: z.boolean(),
  featuredType: z.enum(["CHAINBUILDER", "SPONSORED"]).optional(),
  metadata: z.any().optional(),
});

export function CreateMatchupForm() {
  const createMatchup = useMutation(api.matchups.create);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const methods = useForm<z.infer<typeof CreateMatchupFormSchema>>({
    resolver: zodResolver(CreateMatchupFormSchema),
    defaultValues: {
      title: "",
      league: "OTHER",
      type: "CUSTOM",
      typeDetails: "",
      cost: 30,
      startTime: new Date().getTime(),
      active: false,
      featured: false,
      homeTeam: {
        id: "home",
        name: "",
        score: 0,
        image: "",
      },
      awayTeam: {
        id: "away",
        name: "",
        score: 0,
        image: "",
      },
    },
  });

  async function onSubmit(values: z.infer<typeof CreateMatchupFormSchema>) {
    try {
      setLoading(true);
      await createMatchup({
        ...values,
        gameId: `CUSTOM_${new Date().getTime()}`,
        status: "STATUS_SCHEDULED",
      });
      setLoading(false);
      toast.success("Matchup created");
      router.push("/admin/matchups");
    } catch (error) {
      console.error("Failed to create matchup:", error);
      toast.error("Failed to create matchup");
      setLoading(false);
    }
  }

  function handleStartTimeChange(date: Date | undefined) {
    if (date) {
      methods.setValue("startTime", date.getTime());
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Create New Matchup
        </h2>
        <p className="text-muted-foreground">
          Create a new custom matchup for your users
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
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
                    {[...ACTIVE_LEAGUES, "OTHER"].map((league) => (
                      <SelectItem key={league} value={league}>
                        <div className="flex items-center space-x-2">
                          <Image
                            src={
                              leagueLogos[league] || "/icons/favicon-32x32.png"
                            }
                            alt={league}
                            height={32}
                            width={32}
                            className="object-contain"
                          />
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
                  <FormItem>
                    <FormLabel>Away Team Image URL</FormLabel>
                    <FormControl>
                      <ImageUpload {...field} />
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
                  <FormItem>
                    <FormLabel>Home Team Image URL</FormLabel>
                    <FormControl>
                      <ImageUpload {...field} />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
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
                <FormDescription>
                  Automatic scoring is initiated by this type. Use CUSTOM for
                  anything manually scored.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {methods.watch("type") !== "CUSTOM" && (
            <FormField
              control={methods.control}
              name="typeDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type Details</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type details" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          "GREATER_THAN",
                          "LESS_THAN",
                          "EQUAL",
                          "GREATER_THAN_EQUAL_TO",
                          "LESS_THAN_EQUAL_TO",
                        ].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    This is the comparison operator for the matchup type.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={methods.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <DateTimePicker
                    hourCycle={12}
                    value={new Date(field.value)}
                    onChange={handleStartTimeChange}
                  />
                </FormControl>
                <FormDescription>
                  <p>
                    <span className="font-bold">UTC Time:</span>{" "}
                    {new Date(field.value).toLocaleString("en-US", {
                      timeZone: "UTC",
                    })}
                  </p>
                  <p>
                    <span className="font-bold">Local Time:</span>{" "}
                    {new Date(field.value).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-bold">Arizona Time:</span>{" "}
                    {new Date(field.value).toLocaleString("en-US", {
                      timeZone: "America/Phoenix",
                    })}
                  </p>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="active"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="featured"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a featured type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["CHAINBUILDER", "SPONSORED"].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {methods.watch("featured") &&
            methods.watch("featuredType") === "SPONSORED" && (
              <SponsoredMatchupForm
                onChange={(sponsoredData) => {
                  methods.setValue("metadata.sponsored", sponsoredData, {
                    shouldValidate: true,
                  });
                }}
                initialData={methods.getValues().metadata?.sponsored}
              />
            )}

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Matchup"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
