import { useUser } from "@clerk/nextjs";
import { useAction, useConvexAuth, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function useStoreUserEffect() {
  const { isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  // When this state is set we know the server
  // has stored the user.
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const storeUser = useMutation(api.users.store);

  // Ensure the user has an active chain, if not create one
  const activeChain = useQuery(api.chains.getUserActiveChain, {});
  const createActiveChain = useAction(api.chains.createActiveChain);
  // Call the `storeUser` mutation function to store
  // the current user in the `users` table and return the `Id` value.
  useEffect(() => {
    // If the user is not logged in don't do anything
    if (!isAuthenticated) {
      return;
    }
    // Store the user in the database.
    // Recall that `storeUser` gets the user information via the `auth`
    // object on the server. You don't need to pass anything manually here.
    async function createUser() {
      const id = await storeUser();
      setUserId(id);
    }

    async function createChain() {
      if (!activeChain && isAuthenticated) {
        await createActiveChain();
      }
    }

    createUser();
    createChain();

    // Cleanup the effect
    return () => setUserId(null);
    // Make sure the effect reruns if the user logs in with
    // a different identity
  }, [isAuthenticated, storeUser, user?.id, activeChain]);
  return userId;
}
