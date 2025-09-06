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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  leaderboardUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  externalId: z.string().min(1, {
    message: "External ID is required.",
  }),
});

const PgaEventList = () => {
  const events = useQuery(api.pga.getPgaEvents, {});
  const createEvent = useMutation(api.pga.createPgaEvent);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      leaderboardUrl: "",
      externalId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createEvent(values).then(() => {
      toast({
        title: "Event created",
        description: `${values.name} has been added.`,
      });
      form.reset();
    });
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Add New Event</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="The Masters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leaderboardUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leaderboard URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.pga.com/leaderboard" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="externalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External ID</FormLabel>
                  <FormControl>
                    <Input placeholder="evt-123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Event</Button>
          </form>
        </Form>
      </div>
      <div>
        <h2 className="text-xl font-bold">Existing Events</h2>
        <ul className="space-y-2">
          {events?.map((event) => (
            <li key={event._id} className="border p-2 rounded">
              <p className="font-bold">{event.name}</p>
              <p className="text-sm text-gray-500">ID: {event.externalId}</p>
              <p className="text-sm text-gray-500">URL: {event.leaderboardUrl}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PgaEventList;
