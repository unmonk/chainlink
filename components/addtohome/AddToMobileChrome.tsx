import React from "react";

import { MdAddToHomeScreen } from "react-icons/md";
import { ArrowBigUpDash, EllipsisVertical, X } from "lucide-react";

interface Props {
  closePrompt: () => void;
  doNotShowAgain: () => void;
}

export default function AddToMobileChrome(props: Props) {
  const { closePrompt, doNotShowAgain } = props;

  return (
    <div className="fixed top-0 left-0 right-0 h-[60%] z-50 pt-12 px-4 text-foreground bg-background border rounded-lg border-primary">
      <ArrowBigUpDash className="text-4xl absolute top-[10px] right-[10px] text-green-700 z-10  font-extrabold animate-bounce" />
      <div className="relative bg-background p-4 h-full rounded-xl flex flex-col justify-around items-center text-center">
        <button className="absolute top-0 right-0 p-3" onClick={closePrompt}>
          <X className="text-2xl" />
        </button>
        <p className="text-lg">
          For the best experience, we recommend installing the ChainLink app to
          your home screen!
        </p>
        <div className="flex gap-2 items-center text-lg">
          <p>Click the</p>
          <EllipsisVertical className="text-4xl" />
          <p>icon</p>
        </div>
        <div className="flex flex-col gap-2 items-center text-lg w-full px-4">
          <p>Scroll down and then click:</p>
          <div className="bg-primary flex justify-between items-center px-4 py-2 rounded-lg">
            <MdAddToHomeScreen className="text-2xl" />
            <p>Add to Home Screen</p>
          </div>
        </div>
        <button className="border-2 p-1" onClick={doNotShowAgain}>
          Don&apos;t show again
        </button>
      </div>
    </div>
  );
}
