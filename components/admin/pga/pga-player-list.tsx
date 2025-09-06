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
  externalId: z.string().min(1, {
    message: "External ID is required.",
  }),
});

const PgaPlayerList = () => {
  const players = useQuery(api.pga.getPgaPlayers, {});
  const createPlayer = useMutation(api.pga.createPgaPlayer);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      externalId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createPlayer(values).then(() => {
      toast({
        title: "Player created",
        description: `${values.name} has been added.`,
      });
      form.reset();
    });
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Add New Player</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jon Rahm" {...field} />
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
                    <Input placeholder="12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Player</Button>
          </form>
        </Form>
      </div>
      <div>
        <h2 className="text-xl font-bold">Existing Players</h2>
        <ul className="space-y-2">
          {players?.map((player) => (
            <li key={player._id} className="border p-2 rounded">
              <p className="font-bold">{player.name}</p>
              <p className="text-sm text-gray-500">ID: {player.externalId}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PgaPlayerList;
