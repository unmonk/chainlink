"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

export function DatePicker() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dateParam = searchParams.get("date");
  const date = dateParam ? new Date(dateParam) : new Date();

  const handleSetDate = (date: Date | undefined) => {
    if (!date) return;
    const dateString = date.toLocaleDateString().replaceAll("/", "-");
    router.push("/admin/matchups?date=" + dateString);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start font-normal text-left",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSetDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
