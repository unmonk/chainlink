import { ArrowRight, LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface IGetStartedButtonProps {
  text: string;
  className?: string;
}

export default function GetStartedButton({
  text = "Get started",
  className,
}: IGetStartedButtonProps) {
  return (
    <Button
      size="lg"
      variant="outline"
      className={cn(
        "group flex items-center justify-center gap-3 rounded-lg bg-gradient-to-br from-green-900 via-green-600 to-green-300 p-2 font-bold w-full h-full hover:bg-gradient-to-br hover:from-green-800 hover:via-green-500 hover:to-green-200",
        className
      )}
    >
      <span className="text-white group-hover:text-green-100">{text}</span>
      <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white/10">
        <div className="absolute left-0 flex h-7 w-14 -translate-x-1/2 items-center justify-center transition-all duration-200 ease-in-out group-hover:translate-x-0 group-hover:bg-green-800">
          <LinkIcon
            size={16}
            className="size-7 transform p-1 text-green-100 opacity-0 group-hover:opacity-100"
          />
          <ArrowRight
            size={16}
            className="size-7 transform p-1 text-green-800 opacity-100 transition-transform duration-300 ease-in-out group-hover:opacity-0"
          />
        </div>
      </div>
    </Button>
  );
}
