"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TeamInput } from "@/components/admin/brackets/team-input";

const formSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  cost: z.number().min(0),
  reward: z.number().min(0),
  status: z
    .enum(["DRAFT", "ACTIVE", "IN_PROGRESS", "COMPLETE"])
    .default("DRAFT"),
  teams: z
    .array(
      z.object({
        name: z.string(),
        seed: z.number().min(1).max(16),
        region: z.string(),
        image: z.string().url(),
        espnId: z.string().optional(),
        id: z.string().optional(),
      })
    )
    .length(64),
});

export function CreateBracketForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "DRAFT",
      teams: Array(64).fill({
        name: "",
        seed: 1,
        region: "",
        image: "",
      }),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Convert string dates to timestamps
      const startDate = new Date(values.startDate).getTime();
      const endDate = new Date(values.endDate).getTime();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tournament Name</FormLabel>
              <FormControl>
                <Input placeholder="March Madness 2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Tournament details..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry Cost (Links)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reward"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reward (Links)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Teams</h3>
          {["East", "West", "South", "North"].map((region) => (
            <div key={region} className="space-y-2">
              <h4 className="font-medium">{region} Region</h4>
              {[...Array(16)].map((_, index) => (
                <TeamInput
                  key={`${region}-${index}`}
                  region={region}
                  index={index}
                  form={form}
                />
              ))}
            </div>
          ))}
        </div>

        <Button type="submit">Create Tournament</Button>
      </form>
    </Form>
  );
}
