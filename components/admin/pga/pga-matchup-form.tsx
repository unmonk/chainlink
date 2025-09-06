"use client";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "@/convex/_generated/dataModel";

const formSchema = z.object({
  golferAId: z.string(),
  golferBId: z.string(),
  holes: z.coerce.number(),
  thru: z.coerce.number(),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date and time.",
  }),
  eventId: z.string(),
});

const PgaMatchupForm = () => {
  const players = useQuery(api.pga.getPgaPlayers, {});
  const events = useQuery(api.pga.getPgaEvents, {});
  const createMatchup = useMutation(api.pga.createPgaMatchup);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMatchup({
      ...values,
      startTime: new Date(values.startTime).getTime(),
      league: "PGA",
      active: true,
      status: "PENDING",
    }).then(() => {
      toast({
        title: "Matchup created",
        description: "The new PGA matchup has been created.",
      });
      form.reset();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="golferAId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Golfer A</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Golfer A" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {players?.map((player: Doc<"pgaPlayers">) => (
                    <SelectItem key={player._id} value={player._id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="golferBId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Golfer B</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Golfer B" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {players?.map((player: Doc<"pgaPlayers">) => (
                    <SelectItem key={player._id} value={player._id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="holes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Holes</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="thru"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thru</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {events?.map((event) => (
                    <SelectItem key={event._id} value={event.externalId}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Matchup</Button>
      </form>
    </Form>
  );
};

export default PgaMatchupForm;
