"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { Id } from "@/convex/_generated/dataModel";

interface SearchSponsorProps {
  onSponsorAdd?: () => void;
}

export function SearchSponsor({ onSponsorAdd }: SearchSponsorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Query sponsors that aren't featured yet
  const sponsors = useQuery(api.sponsors.search, {
    query: debouncedSearch,
  });

  // Mutation to add sponsor to featured list
  const addToFeatured = useMutation(api.sponsors.toggleFeatured);

  const handleSelect = async (sponsorId: Id<"sponsors">) => {
    try {
      await addToFeatured({
        id: sponsorId,
      });
      toast.success("Sponsor added to featured list");
      setOpen(false);
      onSponsorAdd?.();
    } catch (error) {
      toast.error("Failed to add sponsor");
    }
  };

  return (
    <>
      <Button variant="outline" className="gap-2" onClick={() => setOpen(true)}>
        <Search className="h-4 w-4" />
        Search Sponsors
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search sponsors..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No sponsors found.</CommandEmpty>
          <CommandGroup heading="Available Sponsors">
            {sponsors?.map((sponsor) => (
              <CommandItem
                key={sponsor._id}
                value={sponsor.name}
                onSelect={() => handleSelect(sponsor._id)}
              >
                {sponsor.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
