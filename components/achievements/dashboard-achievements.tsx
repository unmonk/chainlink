import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

const DashboardAchievements = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>My Achievements</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          0/10 Achievements
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default DashboardAchievements;
