import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Megaphone, CogIcon, Star, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";

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

interface AnnouncementModalProps {
  announcement: any; // Replace 'any' with your announcement type
  isOpen: boolean;
  onClose: () => void;
}

function AnnouncementModal({
  announcement,
  isOpen,
  onClose,
}: AnnouncementModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div
              className={`p-2 rounded-full ${getAnnouncementColor(announcement.type)}`}
            >
              {getAnnouncementIcon(announcement.type)}
            </div>
            {announcement.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {announcement.image && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={announcement.image}
                alt={announcement.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <p className="text-muted-foreground">{announcement.content}</p>
          {announcement.link && (
            <a
              href={announcement.link}
              className="block text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more →
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const ANNOUNCEMENT_TYPES = {
  ALL: "ALL",
  NEWS: "NEWS",
  MAINTENANCE: "MAINTENANCE",
  FEATURE: "FEATURE",
  PROMOTION: "PROMOTION",
  ALERT: "ALERT",
} as const;

type AnnouncementType = keyof typeof ANNOUNCEMENT_TYPES;

export default function DashboardAnnouncements() {
  const announcements = useQuery(api.announcements.getActive);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(
    null
  );
  const [activeFilter, setActiveFilter] = useState<AnnouncementType>("ALL");

  if (!announcements?.length) return null;

  const filteredAnnouncements =
    activeFilter === "ALL"
      ? announcements.slice(0, 5)
      : announcements
          .filter((announcement) => announcement.type === activeFilter)
          .slice(0, 5);

  return (
    <div className="lg:col-span-4 lg:row-span-1">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">News & Announcements</CardTitle>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
            {Object.keys(ANNOUNCEMENT_TYPES).map((type) => (
              <Badge
                key={type}
                variant={activeFilter === type ? "default" : "outline"}
                className={`cursor-pointer hover:opacity-80 transition-all px-2 sm:px-3 py-1 text-xs ${
                  activeFilter === type
                    ? getAnnouncementColor(type)
                    : "hover:" + getAnnouncementColor(type)
                }`}
                onClick={() => setActiveFilter(type as AnnouncementType)}
              >
                <span className="flex items-center gap-1">
                  {getAnnouncementIcon(type)}
                  <span className="hidden sm:inline text-xs">
                    {type === "ALL" ? "All" : type}
                  </span>
                </span>
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => setSelectedAnnouncement(announcement)}
            >
              <div
                className={`p-2 rounded-full ${getAnnouncementColor(announcement.type)}`}
              >
                {getAnnouncementIcon(announcement.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium line-clamp-1">
                    {announcement.title}
                  </h4>
                  <Badge
                    variant="outline"
                    className={getAnnouncementColor(announcement.type)}
                  >
                    {announcement.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
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
          {filteredAnnouncements.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No announcements found for this category
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAnnouncement && (
        <AnnouncementModal
          announcement={selectedAnnouncement}
          isOpen={!!selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </div>
  );
}
