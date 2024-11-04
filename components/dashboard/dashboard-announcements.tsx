import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Megaphone, CogIcon, Star, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const getAnnouncementIcon = (type: string) => {
  switch (type) {
    case "NEWS":
      return <Megaphone className="h-4 w-4" />;
    case "MAINTENANCE":
      return <CogIcon className="h-4 w-4" />;
    case "FEATURE":
      return <Star className="h-4 w-4" />;
    case "PROMOTION":
      return <Bell className="h-4 w-4" />;
    case "ALERT":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getAnnouncementColor = (type: string) => {
  switch (type) {
    case "NEWS":
      return "bg-blue-500/10 text-blue-500";
    case "MAINTENANCE":
      return "bg-yellow-500/10 text-yellow-500";
    case "FEATURE":
      return "bg-green-500/10 text-green-500";
    case "PROMOTION":
      return "bg-purple-500/10 text-purple-500";
    case "ALERT":
      return "bg-red-500/10 text-red-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

export default function DashboardAnnouncements() {
  const announcements = useQuery(api.announcements.getActive);

  if (!announcements?.length) return null;

  return (
    <div className="lg:col-span-4 lg:row-span-1">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">News & Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50"
            >
              <div
                className={`p-2 rounded-full ${getAnnouncementColor(announcement.type)}`}
              >
                {getAnnouncementIcon(announcement.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <Badge
                    variant="outline"
                    className={getAnnouncementColor(announcement.type)}
                  >
                    {announcement.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {announcement.content}
                </p>
                {announcement.link && (
                  <a
                    href={announcement.link}
                    className="text-sm text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
