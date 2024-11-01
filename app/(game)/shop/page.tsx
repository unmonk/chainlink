import { ContentLayout } from "@/components/nav/content-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const shopItems = [
  {
    id: 1,
    name: "ChainLink Sticker",
    price: 100000,
    image: "/items/sword.png",
    icon: "🏷️",
    comingSoon: true,
  },
  {
    id: 2,
    name: "T-Shirt",
    price: 300000,
    image: "/items/potion.png",
    icon: "👕",
    comingSoon: true,
  },
  {
    id: 3,
    name: "Hoodie",
    price: 450000,
    image: "/items/shield.png",
    icon: "👕",
    comingSoon: true,
  },
];

export default function Page() {
  return (
    <ContentLayout title="Shop">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Shop</h1>
          <Badge variant="secondary" className="text-lg">
            Coming Soon!
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopItems.map((item) => (
            <Card key={item.id} className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-md mb-4 flex items-center justify-center">
                  {/* Replace with actual images later */}
                  <div className="text-4xl opacity-30">{item.icon}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-cyan-500">🔗</span>
                    <span className="font-bold text-cyan-500">
                      {new Intl.NumberFormat("en-US", {
                        style: "decimal",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(item.price)}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs text-nowrap">
                    Coming Soon
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ContentLayout>
  );
}
