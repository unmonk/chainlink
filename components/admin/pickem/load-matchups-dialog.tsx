"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { League } from "@/convex/types";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  league: z.string(),
  includePreseason: z.boolean(),
  includeRegularSeason: z.boolean(),
  includePostSeason: z.boolean(),
  seasonYear: z.number().min(2020).max(2030),
});

interface LoadMatchupsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: Id<"pickemCampaigns">;
  campaignLeague: League;
}

export function LoadMatchupsDialog({
  open,
  onOpenChange,
  campaignId,
  campaignLeague,
}: LoadMatchupsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      league: campaignLeague,
      includePreseason: false,
      includeRegularSeason: true,
      includePostSeason: false,
      seasonYear: new Date().getFullYear(),
    },
  });

  const insertMatchups = useAction(api.pickemSchedules.insertNFLPickemMatchups);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (values.league === "NFL") {
        await insertMatchups({
          campaignId,
          includePreseason: values.includePreseason,
          includeRegularSeason: values.includeRegularSeason,
          includePostseason: values.includePostSeason,
          seasonYear: values.seasonYear,
        });
      }

      toast.success("Schedule imported successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error importing schedule:", error);
      toast.error("Failed to import schedule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Load Matchups from Schedule</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="league"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>League</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seasonYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Season Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      min={2020}
                      max={2030}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includePreseason"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Include Preseason</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includeRegularSeason"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Include Regular Season</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includePostSeason"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Include Post Season</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Import Schedule"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
