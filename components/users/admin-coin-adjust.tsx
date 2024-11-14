"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Coins, Link2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CoinAdjustmentModalProps {
  userId: Id<"users">;
}

export function CoinAdjustmentModal({ userId }: CoinAdjustmentModalProps) {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const adjustCoins = useMutation(api.users.adjustCoins);

  const handleAdjustCoins = async () => {
    if (!amount) return;
    if (isNaN(parseInt(amount))) return;

    try {
      const newBalance = await adjustCoins({
        userId,
        amount: parseInt(amount),
        transactionType: "OTHER",
      });
      toast.success(`Links adjusted to ${newBalance}`);
      setAmount("");
      setIsOpen(false);
    } catch (error) {
      toast.error("Error adjusting links");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Link2Icon className="mr-2 h-4 w-4" />
          Adjust Links
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust User Links</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Input
              type="number"
              placeholder="Amount (negative to remove)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <Button onClick={handleAdjustCoins} className="w-full">
            Confirm Adjustment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
