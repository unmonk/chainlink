import { useUser } from "@clerk/nextjs";
import { useAction, useConvexAuth, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

export default function useStoreChain() {
  const { isAuthenticated } = useConvexAuth();
  const { user } = useUser();

  // When this state is set we know the server
  // has stored the chain.
  const [activeChain, setActiveChain] = useState<Id<"chains"> | null>(null);
  const storeChain = useMutation(api.chains.createActiveChain);

  // Ensure the user has an active chain, if not create one
  // Call the `storeUser` mutation function to store
  // the current user in the `users` table and return the `Id` value.
  useEffect(() => {
    // If the user is not logged in don't do anything
    if (!isAuthenticated) {
      return;
    }

    // Create an active chain for the user if they don't have one
    async function createChain() {
      const id = await storeChain();
      setActiveChain(id);
    }

    createChain();

    // Cleanup the effect
    return () => setActiveChain(null);
    // Make sure the effect reruns if the user logs in with
    // a different identity
  }, [isAuthenticated, user?.id, storeChain]);
  return activeChain;
}
