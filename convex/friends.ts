import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { queryByClerkId } from "./users";

export const sendFriendRequest = mutation({
  args: { receiverId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const sender = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .first();
    if (!sender) throw new Error("User not found");

    // Check if request already exists
    const existingRequest = await ctx.db
      .query("friendRequests")
      .withIndex("by_users", (q) =>
        q.eq("senderId", sender.externalId).eq("receiverId", args.receiverId)
      )
      .first();

    if (existingRequest) throw new Error("Friend request already exists");

    // Check if trying to send request to self
    if (sender.externalId === args.receiverId) {
      throw new Error("Cannot send friend request to yourself");
    }

    return await ctx.db.insert("friendRequests", {
      senderId: sender.externalId,
      receiverId: args.receiverId,
      status: "PENDING",
      sentAt: Date.now(),
    });
  },
});

export const acceptFriendRequest = mutation({
  args: { requestId: v.id("friendRequests") },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Friend request not found");

    //check if receiver is the one accepting
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    if (request.receiverId !== identity.subject)
      throw new Error("Unauthorized");

    //get convex user ids from clerk ids
    const sender = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", request.senderId))
      .first();
    if (!sender) throw new Error("Sender user not found");

    const receiver = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", request.receiverId))
      .first();
    if (!receiver) throw new Error("Receiver user not found");

    //add each other to friends list
    await ctx.db.patch(receiver._id, {
      friends: [
        ...receiver.friends,
        {
          userId: request.senderId,
          status: "ONLINE",
          addedAt: new Date().getTime(),
        },
      ],
    });

    //add receiver to sender's friends list
    await ctx.db.patch(sender._id, {
      friends: [
        ...sender.friends,
        {
          userId: request.receiverId,
          status: "ONLINE",
          addedAt: new Date().getTime(),
        },
      ],
    });

    //patch request to accepted
    await ctx.db.patch(args.requestId, {
      status: "ACCEPTED",
      updatedAt: new Date().getTime(),
    });
  },
});

export const removeFriend = mutation({
  args: { friendId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      friends: user.friends.filter((friend) => friend.userId !== args.friendId),
    });
  },
});

export const checkIfFriends = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", identity.subject))
      .unique();
    if (!user) return false;

    const pendingRequests = await ctx.db
      .query("friendRequests")
      .withIndex("by_receiver", (q) => q.eq("receiverId", identity.subject))
      .filter((q) => q.eq(q.field("status"), "PENDING"))
      .take(1);

    const isPending = pendingRequests.length > 0;

    return {
      isFriend: user.friends.some((friend) => friend.userId === args.userId),
      isPending,
    };
  },
});

export const denyFriendRequest = mutation({
  args: { requestId: v.id("friendRequests") },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Friend request not found");

    await ctx.db.patch(args.requestId, {
      status: "DECLINED",
      updatedAt: new Date().getTime(),
    });
  },
});

export const getPendingFriendRequests = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db
      .query("friendRequests")
      .withIndex("by_receiver", (q) =>
        q.eq("receiverId", identity.subject).eq("status", "PENDING")
      )
      .collect();
  },
});

export const getFriends = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", identity.subject))
      .unique();

    console.log(user, "user");

    if (!user) throw new Error("User not found");

    return user.friends || [];
  },
});
