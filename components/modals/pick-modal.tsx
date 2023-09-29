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
    await deletePick();
    if (newPick) {
      await makePick(newPick);
    }
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
          <DialogTitle>Remove Active Pick?</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove your active pick?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="w-full flex flex-row justify-evenly">
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
              {loading ? <Loader className="w-5 h-5" /> : "Confirm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
