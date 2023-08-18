"use client";

import { Button } from "../ui/button";
import { usePick } from "@/hooks/usePick";
import { deletePick } from "@/lib/actions/picks";
import { useAuth } from "@clerk/nextjs";
import { FC, useState } from "react";

interface CancelPickButtonProps {}

const CancelPickButton: FC<CancelPickButtonProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const { openModal } = usePick();
  const handleCancel = async () => {
    setLoading(true);
    if (!userId) return;
    openModal();
    setLoading(false);
    return;
  };
  return (
    <Button
      variant="destructive"
      className="text-xs"
      size={"sm"}
      onClick={handleCancel}
    >
      Cancel
    </Button>
  );
};

export default CancelPickButton;
