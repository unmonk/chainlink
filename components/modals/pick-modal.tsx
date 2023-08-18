"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Loader } from "../ui/loader";
import { usePick } from "@/hooks/usePick";
import { deletePick, makePick } from "@/lib/actions/picks";
import { useState } from "react";

export const PickModal = () => {
  const [loading, setLoading] = useState(false);
  const { openModal, closeModal, modalOpen, newPick, setPick } = usePick();

  const handleConfirm = async () => {
    setLoading(true);
    if (!newPick) return;
    await deletePick();
    await makePick(newPick);
    setLoading(false);
    window.scrollTo(0, 0);
    closeModal();
  };
  const handleCancel = () => {
    closeModal();
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Overwrite Pick</DialogTitle>
          <DialogDescription>
            Are you sure you want to overwrite your pick?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex flex-row justify-evenly w-full">
            <Button
              onClick={handleCancel}
              variant={"secondary"}
              className="w-1/3"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant="destructive"
              className="w-1/3"
            >
              {loading ? <Loader className="h-5 w-5" /> : "Confirm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
