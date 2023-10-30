"use client";

import { Loader } from "../ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  NewPick,
  Pick,
  PickType,
  PickStatus,
  PickWithMatchup,
  picks,
} from "@/drizzle/schema";
import { updatePickById } from "@/lib/actions/picks";
import { zodResolver } from "@hookform/resolvers/zod";
import { match } from "assert";
import { Edit, Edit2Icon, Router } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  pick_type: z.enum(picks.pick_type.enumValues, {
    required_error: "Pick type is required.",
  }),

  pick_status: z.enum(picks.pick_status.enumValues, {
    required_error: "Pick type is required.",
  }),
});

export const AdminEditPickModal = ({
  disabled,
  pick,
}: {
  disabled: boolean;
  pick: {
    pick_type: PickType;
    pick_status: PickStatus;
    pick_id: number;
    user_id: string;
    matchup: {
      home_team: {
        team_name: string;
        team_logo: string | null;
      };
      away_team: {
        team_name: string;
        team_logo: string | null;
      };
      question: string;
    };
  };
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pick_type: pick.pick_type,
      pick_status: pick.pick_status,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const new_pick: Partial<NewPick> = {
        pick_type: values.pick_type,
        pick_status: values.pick_status,
      };
      await updatePickById(pick.pick_id, new_pick);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isMounted) {
    return null;
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} size={"icon"} disabled={disabled}>
          <Edit2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background overflow-hidden rounded-lg p-0">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Edit Pick
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            Change the selected pick for this user.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="pick_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase">
                      Team
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      {...field}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select Team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="HOME">
                          <div className="flex flex-row gap-2">
                            <Image
                              src={
                                pick.matchup.home_team.team_logo ||
                                "/images/alert-octagon.svg"
                              }
                              className="h-5 w-5"
                              width={28}
                              height={28}
                              alt={pick.matchup.home_team.team_name || "Home"}
                            />
                            <span>
                              {pick.matchup.home_team.team_name || "Home"}
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="AWAY">
                          <div className="flex flex-row gap-2">
                            <Image
                              src={
                                pick.matchup.away_team.team_logo ||
                                "/images/alert-octagon.svg"
                              }
                              className="h-5 w-5"
                              width={28}
                              height={28}
                              alt={pick.matchup.away_team.team_name || "Away"}
                            />
                            <span>
                              {pick.matchup.away_team.team_name || "Away"}
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="pick_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase">
                      Status
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      {...field}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {picks.pick_status.enumValues.map((pick_status) => {
                          return (
                            <SelectItem value={pick_status}>
                              {pick_status}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-accent gap-2 px-6 py-4">
              <DialogClose asChild>
                <Button variant={"secondary"}>Cancel</Button>
              </DialogClose>
              <Button variant="default" type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="h-5 w-5" /> : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
