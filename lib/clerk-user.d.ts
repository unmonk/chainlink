import { PushSubscription } from "web-push";

declare global {
  interface UserPrivateMetadata {
    pushSubscriptions: PushSubscription[] | undefined;
  }
}
