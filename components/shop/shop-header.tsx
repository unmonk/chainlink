import { Badge } from "../ui/badge";

interface ShopHeaderProps {
  coins: number;
}

export function ShopHeader({ coins }: ShopHeaderProps) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-primary mb-2">Link Shop</h1>
      <div className="flex items-center justify-center gap-2">
        <span className="text-cyan-500 flex items-center gap-1">
          <span>🔗</span>
          <span className="font-bold">
            {new Intl.NumberFormat().format(coins)}
          </span>
        </span>
        <Badge variant="secondary">Available Links</Badge>
      </div>
    </div>
  );
}
