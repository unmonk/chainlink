"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus } from "lucide-react";
import { ReactionDialog } from "./reaction-dialog";
import { Doc, Id } from "@/convex/_generated/dataModel";
import Image from "next/image";

export function ReactionsList() {
  const [selectedReaction, setSelectedReaction] =
    useState<Doc<"reactions"> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const reactions = useQuery(api.reactions.list, { activeOnly: false }) || [];
  const updateReaction = useMutation(api.reactions.update);
  const deleteReaction = useMutation(api.reactions.remove);

  const handleToggleActive = async (
    id: Id<"reactions">,
    currentActive: boolean
  ) => {
    await updateReaction({
      id,
      active: !currentActive,
    });
  };

  const handleEdit = (reaction: Doc<"reactions">) => {
    setSelectedReaction(reaction);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: Id<"reactions">) => {
    if (confirm("Are you sure you want to delete this reaction?")) {
      await deleteReaction({ id });
    }
  };

  const handleCreate = () => {
    setSelectedReaction(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reactions</h2>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Reaction
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Preview</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Premium</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reactions.map((reaction) => (
            <TableRow key={reaction._id}>
              <TableCell>
                {reaction.imageUrl ? (
                  <Image
                    src={reaction.imageUrl}
                    alt={reaction.name}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <span className="text-2xl">{reaction.code}</span>
                )}
              </TableCell>
              <TableCell>{reaction.name}</TableCell>
              <TableCell>{reaction.code}</TableCell>
              <TableCell>
                <Switch
                  checked={reaction.active}
                  onCheckedChange={() =>
                    handleToggleActive(reaction._id, reaction.active)
                  }
                />
              </TableCell>
              <TableCell>
                <Switch checked={reaction.premium} disabled />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(reaction)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(reaction._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ReactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        reaction={selectedReaction}
      />
    </div>
  );
}
