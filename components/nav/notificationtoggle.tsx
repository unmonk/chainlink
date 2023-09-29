import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Loader } from "../ui/loader";
import {
  getSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/lib/notifications";
import { BellIcon, BellOffIcon, BellRingIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";

interface NotificationToggleProps {}

const NotificationToggle: FC<NotificationToggleProps> = ({}) => {
  const [hasActivePushSubscription, setHasActivePushSubscription] =
    useState<Boolean>(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getActivePushSubscription() {
      const subscription = await getSubscription();
      setHasActivePushSubscription(!!subscription);
    }
    getActivePushSubscription();
  }, []);

  async function setPushNotificationsEnabled(enabled: Boolean) {
    if (loading) return;
    setLoading(true);

    try {
      if (enabled) {
        await registerPushNotifications();
        toast.success("Notifications Enabled");
      } else {
        await unregisterPushNotifications();
        toast.success("Notifications Disabled");
      }
      setHasActivePushSubscription(enabled);
      setLoading(false);
    } catch (err) {
      console.error(err);
      if (enabled && Notification.permission === "denied") {
        toast.error("Please enable notifications in your browser settings");
        Notification.requestPermission();
      } else {
        toast.error("Failed to change notification settings");
      }
    }
  }

  if (hasActivePushSubscription === undefined) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" disabled={loading}>
          {loading ? (
            <Loader />
          ) : !loading && hasActivePushSubscription ? (
            <BellRingIcon className="w-[1.2rem] h-[1.2rem]" />
          ) : (
            <BellOffIcon className="w-[1.2rem] h-[1.2rem]" />
          )}
          <span className="sr-only">Toggle Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setPushNotificationsEnabled(true)}>
          Enabled
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setPushNotificationsEnabled(false)}>
          Disabled
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationToggle;
