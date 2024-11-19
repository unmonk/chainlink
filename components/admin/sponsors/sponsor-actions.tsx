"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Star, Power } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface SponsorActionsProps {
  sponsor: {
    _id: Id<"sponsors">;
    active: boolean;
    featured: boolean;
  };
}

export function SponsorActions({ sponsor }: SponsorActionsProps) {
  //const updateSponsor = useMutation(api.sponsors.update);
  const deleteSponsor = useMutation(api.sponsors.remove);

  const handleToggleActive = async () => {
    console.log("toggle active");
  };

  const handleToggleFeatured = async () => {
    console.log("toggle featured");
  };

  const handleDelete = async () => {
    try {
      await deleteSponsor({
        id: sponsor._id,
      });
      toast.success("Sponsor deleted successfully");
    } catch (error) {
      toast.error("Failed to delete sponsor");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleToggleActive}>
          <Power className="mr-2 h-4 w-4" />
          {sponsor.active ? "Deactivate" : "Activate"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleFeatured}>
          <Star className="mr-2 h-4 w-4" />
          {sponsor.featured ? "Unfeature" : "Feature"}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
