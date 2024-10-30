"use client";

import { Search } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { User } from "@clerk/nextjs/server";

export function AdminSearchBox({
  placeholder = "Search users...",
  onUserSelect,
}: {
  placeholder?: string;
  onUserSelect: (user: User) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!debouncedQuery) {
      setUsers([]);
      return;
    }

    startTransition(async () => {
      const response = await fetch(
        `/api/clerk?query=${encodeURIComponent(debouncedQuery)}`
      );
      const data = await response.json();

      if (!response.ok) {
        console.error("Search failed:", data.error);
        return;
      }

      setUsers(data.users);
    });
  }, [debouncedQuery]);

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        {placeholder}
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Users">
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => {
                    // Handle user selection
                    onUserSelect(user);
                    setSearchQuery("");
                    setUsers([]);
                    setOpen(false);
                  }}
                >
                  {user.email || user.username}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
