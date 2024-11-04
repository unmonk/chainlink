"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface TeamInputProps {
  region: string;
  index: number;
  form: UseFormReturn<any>;
}

export function TeamInput({ region, index, form }: TeamInputProps) {
  const fieldIndex =
    ["East", "West", "South", "North"].indexOf(region) * 16 + index;

  return (
    <div className="grid grid-cols-4 gap-2 items-end">
      <FormField
        control={form.control}
        name={`teams.${fieldIndex}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`teams.${fieldIndex}.seed`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Seed</FormLabel>
            <FormControl>
              <Input type="number" min={1} max={16} {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`teams.${fieldIndex}.image`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team Logo URL</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`teams.${fieldIndex}.region`}
        render={({ field }) => (
          <FormItem className="hidden">
            <FormControl>
              <Input {...field} value={region} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
