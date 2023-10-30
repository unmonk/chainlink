"use client";

import { Loader } from "../ui/loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

export const AdminDeleteAchievementModal = ({
  disabled,
  achievementId,
}: {
  className?: string;
  disabled: boolean;
  achievementId: number;
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (achievementId: number) => {
    setLoading(true);
    //do delete achievement
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size={"icon"} disabled={disabled}>
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          Are you sure you want to remove this achievement?
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the
          achievement from the database. Any users assigned this achievement
          will have that removed as well.
        </DialogDescription>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>

          <Button
            variant="destructive"
            type="submit"
            onClick={() => handleConfirm(achievementId)}
          >
            {loading ? <Loader className="h-5 w-5" /> : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
