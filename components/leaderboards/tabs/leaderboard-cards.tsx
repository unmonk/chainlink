import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn, COSMETIC_STYLE } from "@/lib/utils";

interface LeaderCardProps {
  user: any;
  stats: React.ReactNode;
  label?: string;
}

export function LeaderCard({ user, stats, label = "Leader" }: LeaderCardProps) {
  return (
    <BackgroundGradient
      key={user._id}
      animate={true}
      className="rounded-lg overflow-hidden shadow-lg"
    >
      <Link href={`/u/${user.name}`} passHref>
        <Card className="flex flex-col items-center gap-2 p-4 bg-background/80">
          <Avatar
            height="h-20"
            width="w-20"
            cosmetic={user.metadata?.avatarBackground as COSMETIC_STYLE}
            hasGlow={!!user.metadata?.avatarBackground}
          >
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>

          <h3 className="text-xl font-semibold">{user.name}</h3>
          {stats}
          <p className="text-sm font-bold">{label}</p>
        </Card>
      </Link>
    </BackgroundGradient>
  );
}

interface RunnerUpCardProps {
  user: any;
  stats: React.ReactNode;
  position: "2nd" | "3rd";
}

export function RunnerUpCard({ user, stats, position }: RunnerUpCardProps) {
  return (
    <Link href={`/u/${user.name}`} passHref>
      <Card className="flex flex-col items-center gap-1 p-2 bg-background/80">
        <Avatar
          className="w-20 h-20"
          cosmetic={user.metadata?.avatarBackground as COSMETIC_STYLE}
          hasGlow={!!user.metadata?.avatarBackground}
          height="h-20"
          width="w-20"
        >
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>

        <h3 className="text-xl font-semibold">{user.name}</h3>
        {stats}
        <p className="text-sm font-bold">{position}</p>
      </Card>
    </Link>
  );
}
