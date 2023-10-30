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
import { deleteActivePickByUserId } from "@/lib/actions/picks";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

export const AdminDeletePickModal = ({
  disabled,
  userId,
}: {
  className?: string;
  disabled: boolean;
  userId: string;
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (userId: string) => {
    setLoading(true);
    await deleteActivePickByUserId(userId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size={"icon"} disabled={disabled}>
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Are you sure you want to remove this pick?</DialogHeader>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the pick
          from the database. There is currently no notification to the user that
          this occured.
        </DialogDescription>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>

          <Button
            variant="destructive"
            type="submit"
            onClick={() => handleConfirm(userId)}
          >
            {loading ? <Loader className="h-5 w-5" /> : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
