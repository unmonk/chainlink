import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";

const CoinStats = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>This Month</CardDescription>
        <CardTitle className="text-3xl text-yellow-500">🔗9,999</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          +100% from last month
        </div>
      </CardContent>
      <CardFooter>
        <Progress value={12} aria-label="12% increase" className="" />
      </CardFooter>
    </Card>
  );
};

export default CoinStats;
