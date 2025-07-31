import { ConvexError, v } from "convex/values";
import {
  mutation,
  query,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { api, internal } from "./_generated/api";
import { pickem_matchup_status } from "./schema";
import { Doc } from "./_generated/dataModel";

///CAMPAIGNS/////

// Create a new pickem campaign
export const createPickemCampaign = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    league: v.string(),
    type: v.union(v.literal("TRADITIONAL"), v.literal("SURVIVOR")),
    scoringType: v.union(v.literal("STANDARD"), v.literal("CONFIDENCE")),
    startDate: v.number(),
    endDate: v.number(),
    entryFee: v.number(),
    isPrivate: v.optional(v.boolean()),
    privateCode: v.optional(v.string()),
    settings: v.optional(v.any()),
    prizes: v.optional(v.array(v.any())),
    sponsorInfo: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Not authenticated");

    // Check if user is admin
    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();

    if (!userProfile || userProfile.role !== "ADMIN") {
      throw new ConvexError("Admin access required");
    }

    const campaignId = await ctx.db.insert("pickemCampaigns", {
      ...args,
    });

    return campaignId;
  },
});

// Update a pickem campaign
export const updatePickemCampaign = mutation({
  args: {
    campaignId: v.id("pickemCampaigns"),
    name: v.string(),
    description: v.optional(v.string()),
    league: v.string(),
    type: v.union(v.literal("TRADITIONAL"), v.literal("SURVIVOR")),
    scoringType: v.union(v.literal("STANDARD"), v.literal("CONFIDENCE")),
    startDate: v.number(),
    endDate: v.number(),
    entryFee: v.number(),
    isPrivate: v.optional(v.boolean()),
    privateCode: v.optional(v.string()),
    settings: v.optional(v.any()),
    prizes: v.optional(v.array(v.any())),
    sponsorInfo: v.optional(v.any()),
  },
  handler: async (ctx, { campaignId, ...updates }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Not authenticated");

    // Check if user is admin
    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();

    if (!userProfile || userProfile.role !== "ADMIN") {
      throw new ConvexError("Admin access required");
    }

    await ctx.db.patch(campaignId, updates);
  },
});

//////MATCHUPS//////

// Create a new pickem matchup (admin only)
export const createPickemMatchup = mutation({
  args: {
    campaignId: v.id("pickemCampaigns"),
    week: v.number(),
    seasonType: v.optional(
      v.union(
        v.literal("PRESEASON"),
        v.literal("REGULAR_SEASON"),
        v.literal("POSTSEASON")
      )
    ),
    winnerId: v.optional(v.string()),
    status: pickem_matchup_status,
    title: v.string(),
    gameId: v.string(),
    startTime: v.number(),
    homeTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    awayTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Not authenticated");

    // Check if user is admin
    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();

    if (!userProfile || userProfile.role !== "ADMIN") {
      throw new ConvexError("Admin access required");
    }

    const matchupId = await ctx.db.insert("pickemMatchups", {
      ...args,
    });

    return matchupId;
  },
});

// Update pickem matchup status and results
export const updatePickemMatchup = mutation({
  args: {
    matchupId: v.id("pickemMatchups"),
    status: v.union(
      v.literal("PENDING"),
      v.literal("ACTIVE"),
      v.literal("LOCKED"),
      v.literal("COMPLETE")
    ),
    homeTeam: v.optional(
      v.object({
        id: v.string(),
        name: v.string(),
        score: v.number(),
        image: v.string(),
      })
    ),
    awayTeam: v.optional(
      v.object({
        id: v.string(),
        name: v.string(),
        score: v.number(),
        image: v.string(),
      })
    ),
    week: v.optional(v.number()),
    seasonType: v.optional(
      v.union(
        v.literal("PRESEASON"),
        v.literal("REGULAR_SEASON"),
        v.literal("POSTSEASON")
      )
    ),
    title: v.string(),
    gameId: v.string(),
    startTime: v.number(),
    winnerId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, { matchupId, ...updates }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Not authenticated");

    // Check if user is admin
    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();

    if (!userProfile || userProfile.role !== "ADMIN") {
      throw new ConvexError("Admin access required");
    }

    // Get the matchup to find its campaign and week
    const matchup = await ctx.db.get(matchupId);
    if (!matchup) throw new ConvexError("Matchup not found");

    await ctx.db.patch(matchupId, updates);

    // If matchup is completed, process results
    if (updates.status === "COMPLETE" && updates.winnerId) {
      await ctx.scheduler.runAfter(
        0,
        internal.pickem.processPickemMatchupResults,
        {
          matchupId,
        }
      );
    }
  },
});

//get pickem matchups by campaign
export const getPickemMatchupsByCampaign = query({
  args: { campaignId: v.id("pickemCampaigns") },
  handler: async (ctx, { campaignId }) => {
    return await ctx.db
      .query("pickemMatchups")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaignId))
      .collect();
  },
});

// Delete pickem matchup (admin only)
export const deletePickemMatchup = mutation({
  args: { matchupId: v.id("pickemMatchups") },
  handler: async (ctx, { matchupId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Not authenticated");

    // Check if user is admin
    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();

    if (!userProfile || userProfile.role !== "ADMIN") {
      throw new ConvexError("Admin access required");
    }

    // Delete associated picks first
    const picks = await ctx.db
      .query("pickemPicks")
      .withIndex("by_matchup", (q) => q.eq("matchupId", matchupId))
      .collect();

    for (const pick of picks) {
      await ctx.db.delete(pick._id);
    }

    // Delete the matchup
    await ctx.db.delete(matchupId);
  },
});

// Process results when a pickem matchup is completed
export const processPickemMatchupResults = internalMutation({
  args: { matchupId: v.id("pickemMatchups") },
  handler: async (ctx, { matchupId }) => {
    const matchup = await ctx.db.get(matchupId);
    if (!matchup || matchup.status !== "COMPLETE") return;

    const picks = await ctx.db
      .query("pickemPicks")
      .withIndex("by_matchup", (q) => q.eq("matchupId", matchupId))
      .collect();

    for (const pick of picks) {
      let pointsEarned = 0;
      let status: "WIN" | "LOSS" | "PUSH" = "LOSS";

      if (matchup.winnerId === "PUSH") {
        status = "PUSH";
        pointsEarned = 0.5; // Half point for ties
      } else if (pick.pick.teamId === matchup.winnerId) {
        status = "WIN";
        pointsEarned = pick.confidencePoints || 1; // Use confidence points if available
      }

      // Update pick
      await ctx.db.patch(pick._id, {
        status,
        pointsEarned,
      });

      // Update participant stats using weeklyStats
      const participant = await ctx.db.get(pick.participantId);
      if (participant) {
        // weeklyStats is an object, or undefined
        const prevStats = participant.weeklyStats ?? {};

        // Get seasonType from the matchup, fallback to pick's seasonType, then default to REGULAR_SEASON
        const seasonType =
          matchup.seasonType || pick.seasonType || "REGULAR_SEASON";
        const week = pick.week;

        // Create nested structure: seasonType -> week -> stats
        const seasonKey = seasonType.toLowerCase();
        const weekKey = `week${week}`;

        const prevSeasonStats = prevStats[seasonKey] ?? {};
        const prevWeekStats = prevSeasonStats[weekKey] ?? {
          points: 0,
          correct: 0,
          incorrect: 0,
          pushed: 0,
        };

        const newWeekStats = {
          points: (prevWeekStats.points || 0) + pointsEarned,
          correct: (prevWeekStats.correct || 0) + (status === "WIN" ? 1 : 0),
          incorrect:
            (prevWeekStats.incorrect || 0) + (status === "LOSS" ? 1 : 0),
          pushed: (prevWeekStats.pushed || 0) + (status === "PUSH" ? 1 : 0),
        };

        const newSeasonStats = {
          ...prevSeasonStats,
          [weekKey]: newWeekStats,
        };

        const newWeeklyStats = {
          ...prevStats,
          [seasonKey]: newSeasonStats,
        };

        await ctx.db.patch(participant._id, {
          weeklyStats: newWeeklyStats,
        });
      }
    }
  },
});

// Join a pickem campaign
export const joinPickemCampaign = mutation({
  args: {
    campaignId: v.id("pickemCampaigns"),
    privateCode: v.optional(v.string()),
  },
  handler: async (ctx, { campaignId, privateCode }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Not authenticated");

    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();

    if (!userProfile) throw new ConvexError("User not found");

    const campaign = await ctx.db.get(campaignId);
    if (!campaign) throw new ConvexError("Campaign not found");

    // If campaign is private, require correct code
    if (campaign.isPrivate) {
      if (!privateCode || privateCode !== campaign.privateCode) {
        throw new ConvexError("Invalid or missing private code");
      }
    }

    // Check if user already joined
    const existingParticipant = await ctx.db
      .query("pickemParticipants")
      .withIndex("by_campaign_user", (q) =>
        q.eq("campaignId", campaignId).eq("userId", userProfile._id)
      )
      .unique();

    if (existingParticipant) {
      throw new ConvexError("Already joined this campaign");
    }

    // Check entry fee
    if (campaign.entryFee > 0) {
      if (userProfile.coins < campaign.entryFee) {
        throw new ConvexError("Insufficient Links");
      }
      // Deduct entry fee
      await ctx.db.patch(userProfile._id, {
        coins: userProfile.coins - campaign.entryFee,
      });
    }

    const participantId = await ctx.db.insert("pickemParticipants", {
      campaignId,
      userId: userProfile._id,
      joinedAt: new Date().getTime(),
      survivor: {
        eliminated: false,
      },
      picksMade: 0,
      weeklyStats: {},
    });

    return participantId;
  },
});

// Get active pickem campaigns
export const getActivePickemCampaigns = query({
  args: { league: v.optional(v.string()) },
  handler: async (ctx, { league }) => {
    if (!league) {
      throw new ConvexError("League is required");
    }
    const currentTime = new Date().getTime();
    const campaigns = await ctx.db
      .query("pickemCampaigns")
      .filter((q) =>
        q.and(
          q.lte(q.field("startDate"), currentTime),
          q.gte(q.field("endDate"), currentTime)
        )
      )
      .collect();

    return campaigns;
  },
});

// Get user's pickem campaigns
export const getUserPickemCampaigns = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();

    if (!userProfile) return [];

    const participants = await ctx.db
      .query("pickemParticipants")
      .withIndex("by_user", (q) => q.eq("userId", userProfile._id))
      .collect();

    const campaigns = await Promise.all(
      participants.map(async (participant) => {
        const campaign = await ctx.db.get(participant.campaignId);
        return { campaign, participant };
      })
    );

    return campaigns.filter((c) => c.campaign !== null);
  },
});

// Add: Get all pickem campaigns (admin)
export const getAllPickemCampaigns = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pickemCampaigns").collect();
  },
});

// Add: Get pickem campaign by ID (admin)
export const getPickemCampaign = query({
  args: { campaignId: v.id("pickemCampaigns") },
  handler: async (ctx, { campaignId }) => {
    const campaign = await ctx.db.get(campaignId);

    if (!campaign) {
      return null;
    }

    // Generate proper URLs for sponsor logo if it exists
    if (campaign.sponsorInfo?.logoStorageId) {
      const logoUrl = await ctx.storage.getUrl(
        campaign.sponsorInfo.logoStorageId
      );
      if (logoUrl) {
        campaign.sponsorInfo.logo = logoUrl;
      }
    }

    // Generate proper URLs for prize merchandise if they exist
    if (campaign.prizes) {
      for (const prize of campaign.prizes) {
        if (prize.merchStorageId) {
          const merchUrl = await ctx.storage.getUrl(prize.merchStorageId);
          if (merchUrl) {
            prize.merch = merchUrl;
          }
        }
      }
    }

    return campaign;
  },
});

// Get pickem participants by campaign
export const getPickemParticipantsByCampaign = query({
  args: { campaignId: v.id("pickemCampaigns") },
  handler: async (ctx, { campaignId }) => {
    const participants = await ctx.db
      .query("pickemParticipants")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaignId))
      .collect();

    // Get user details for each participant
    const participantsWithUsers = await Promise.all(
      participants.map(async (participant) => {
        const user = await ctx.db.get(participant.userId);
        return {
          ...participant,
          user: {
            name: user?.name,
            image: user?.image,
          },
        };
      })
    );

    return participantsWithUsers;
  },
});

// Get matchups organized by season type and week for a campaign
export const getPickemMatchupsBySeasonAndWeek = query({
  args: { campaignId: v.id("pickemCampaigns") },
  handler: async (ctx, { campaignId }) => {
    const matchups = await ctx.db
      .query("pickemMatchups")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaignId))
      .collect();

    // Group matchups by season type and week
    const organizedMatchups: Record<string, Record<number, any[]>> = {};

    matchups.forEach((matchup) => {
      const seasonType = matchup.seasonType || "REGULAR_SEASON";
      const week = matchup.week || 0;

      if (!organizedMatchups[seasonType]) {
        organizedMatchups[seasonType] = {};
      }

      if (!organizedMatchups[seasonType][week]) {
        organizedMatchups[seasonType][week] = [];
      }

      organizedMatchups[seasonType][week].push(matchup);
    });

    // Sort weeks within each season type
    Object.keys(organizedMatchups).forEach((seasonType) => {
      const weeks = Object.keys(organizedMatchups[seasonType])
        .map(Number)
        .sort((a, b) => a - b);
      const sortedWeeks: Record<number, any[]> = {};
      weeks.forEach((week) => {
        sortedWeeks[week] = organizedMatchups[seasonType][week];
      });
      organizedMatchups[seasonType] = sortedWeeks;
    });

    return organizedMatchups;
  },
});

// Get matchups for a specific week and season type
export const getPickemMatchupsForWeek = query({
  args: {
    campaignId: v.id("pickemCampaigns"),
    seasonType: v.union(
      v.literal("PRESEASON"),
      v.literal("REGULAR_SEASON"),
      v.literal("POSTSEASON")
    ),
    weekNumber: v.number(),
  },
  handler: async (ctx, { campaignId, seasonType, weekNumber }) => {
    const matchups = await ctx.db
      .query("pickemMatchups")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaignId))
      .filter((q) =>
        q.and(
          q.eq(q.field("seasonType"), seasonType),
          q.eq(q.field("week"), weekNumber)
        )
      )
      .collect();

    // Sort matchups by start time
    return matchups.sort((a, b) => a.startTime - b.startTime);
  },
});

// Get user's picks for a specific week
export const getUserPickemPicksForWeek = query({
  args: {
    campaignId: v.id("pickemCampaigns"),
    seasonType: v.union(
      v.literal("PRESEASON"),
      v.literal("REGULAR_SEASON"),
      v.literal("POSTSEASON")
    ),
    weekNumber: v.number(),
  },
  handler: async (ctx, { campaignId, seasonType, weekNumber }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    // Get user profile
    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();
    if (!userProfile) return [];

    // Get participant
    const participant = await ctx.db
      .query("pickemParticipants")
      .withIndex("by_campaign_user", (q) =>
        q.eq("campaignId", campaignId).eq("userId", userProfile._id)
      )
      .unique();
    if (!participant) return [];

    // Get picks for this participant, week, and seasonType
    const picks = await ctx.db
      .query("pickemPicks")
      .withIndex("by_participant", (q) =>
        q.eq("participantId", participant._id)
      )
      .filter((q) =>
        q.and(
          q.eq(q.field("week"), weekNumber),
          q.eq(q.field("seasonType"), seasonType)
        )
      )
      .collect();

    return picks;
  },
});

// Submit picks for a week
export const submitPickemPicks = mutation({
  args: {
    campaignId: v.id("pickemCampaigns"),
    week: v.number(),
    seasonType: v.optional(
      v.union(
        v.literal("PRESEASON"),
        v.literal("REGULAR_SEASON"),
        v.literal("POSTSEASON")
      )
    ),
    picks: v.array(
      v.object({
        matchupId: v.id("pickemMatchups"),
        teamId: v.string(),
        teamName: v.string(),
        teamImage: v.string(),
        confidencePoints: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, { campaignId, week, seasonType, picks }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Not authenticated");

    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();

    if (!userProfile) throw new ConvexError("User not found");

    const campaign = await ctx.db.get(campaignId);
    if (!campaign) throw new ConvexError("Campaign not found");

    const participant = await ctx.db
      .query("pickemParticipants")
      .withIndex("by_campaign_user", (q) =>
        q.eq("campaignId", campaignId).eq("userId", userProfile._id)
      )
      .unique();

    if (!participant) throw new ConvexError("Not a participant");

    // Validate picks based on campaign type
    if (campaign.type === "SURVIVOR" && picks.length !== 1) {
      throw new ConvexError(
        "Survivor campaigns require exactly one pick per week"
      );
    }

    // Get existing picks for this week and seasonType
    const existingPicks = await ctx.db
      .query("pickemPicks")
      .withIndex("by_participant", (q) =>
        q.eq("participantId", participant._id)
      )
      .filter((q) =>
        q.and(
          q.eq(q.field("week"), week),
          q.eq(q.field("seasonType"), seasonType || "REGULAR_SEASON")
        )
      )
      .collect();

    // Create a map of existing picks by matchupId for easy lookup
    const existingPicksMap = new Map(
      existingPicks.map((pick) => [pick.matchupId, pick])
    );

    // Process each pick - either update existing or create new
    const pickIds = await Promise.all(
      picks.map(async (pick) => {
        const existingPick = existingPicksMap.get(pick.matchupId);

        if (existingPick) {
          // Update existing pick
          await ctx.db.patch(existingPick._id, {
            pick: {
              teamId: pick.teamId,
              teamName: pick.teamName,
              teamImage: pick.teamImage,
            },
            confidencePoints: pick.confidencePoints,
            status: "PENDING",
            submittedAt: new Date().getTime(),
          });
          return existingPick._id;
        } else {
          // Create new pick
          return await ctx.db.insert("pickemPicks", {
            campaignId,
            participantId: participant._id,
            matchupId: pick.matchupId,
            week,
            seasonType: seasonType || "REGULAR_SEASON",
            pick: {
              teamId: pick.teamId,
              teamName: pick.teamName,
              teamImage: pick.teamImage,
            },
            confidencePoints: pick.confidencePoints,
            status: "PENDING",
            pointsEarned: 0,
            submittedAt: new Date().getTime(),
            metadata: {},
          });
        }
      })
    );

    // Update participant stats - only count new picks
    const newPicksCount = picks.filter(
      (pick) => !existingPicksMap.has(pick.matchupId)
    ).length;
    if (newPicksCount > 0) {
      await ctx.db.patch(participant._id, {
        picksMade: participant.picksMade + newPicksCount,
      });
    }

    return pickIds;
  },
});

// Cancel a pickem pick
export const cancelPickemPick = mutation({
  args: { pickId: v.id("pickemPicks") },
  handler: async (ctx, { pickId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Not authenticated");

    const pick = await ctx.db.get(pickId);
    if (!pick) {
      throw new ConvexError("PICK_NOT_FOUND");
    }

    // Get the matchup to check if it's still pending
    const matchup = await ctx.db.get(pick.matchupId);
    if (!matchup) {
      throw new ConvexError("MATCHUP_NOT_FOUND");
    }

    // Only allow cancellation if matchup is still pending
    if (matchup.status !== "PENDING") {
      throw new ConvexError("MATCHUP_ALREADY_LOCKED");
    }

    // Verify the user owns this pick
    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();

    if (!userProfile) throw new ConvexError("User not found");

    const participant = await ctx.db
      .query("pickemParticipants")
      .withIndex("by_campaign_user", (q) =>
        q.eq("campaignId", pick.campaignId).eq("userId", userProfile._id)
      )
      .unique();

    if (!participant || participant._id !== pick.participantId) {
      throw new ConvexError("Not authorized to cancel this pick");
    }

    // Delete the pick
    await ctx.db.delete(pickId);

    // Update participant stats
    await ctx.db.patch(participant._id, {
      picksMade: Math.max(0, participant.picksMade - 1),
    });
  },
});

// Get active pickem campaigns with participant counts
export const getActivePickemCampaignsWithCounts = query({
  args: {},
  handler: async (ctx, {}) => {
    const currentTime = Date.now();
    const campaigns = await ctx.db
      .query("pickemCampaigns")
      .filter((q) =>
        q.and(
          q.lte(q.field("startDate"), currentTime),
          q.gte(q.field("endDate"), currentTime)
        )
      )
      .collect();

    // Get participant counts for each campaign
    const campaignsWithCounts = await Promise.all(
      campaigns.map(async (campaign) => {
        // Get all participants for this campaign
        const allParticipants = await ctx.db
          .query("pickemParticipants")
          .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
          .collect();

        // Get participants who have made at least one pick
        const participantsWithPicks = allParticipants.filter(
          (participant) => participant.picksMade > 0
        );

        // Generate proper URLs for sponsor logo if it exists
        if (campaign.sponsorInfo?.logoStorageId) {
          const logoUrl = await ctx.storage.getUrl(
            campaign.sponsorInfo.logoStorageId
          );
          if (logoUrl) {
            campaign.sponsorInfo.logo = logoUrl;
          }
        }

        // Generate proper URLs for prize merchandise if they exist
        if (campaign.prizes) {
          for (const prize of campaign.prizes) {
            if (prize.merchStorageId) {
              const merchUrl = await ctx.storage.getUrl(prize.merchStorageId);
              if (merchUrl) {
                prize.merch = merchUrl;
              }
            }
          }
        }

        return {
          ...campaign,
          participantCounts: {
            total: allParticipants.length,
            withPicks: participantsWithPicks.length,
          },
        };
      })
    );

    return campaignsWithCounts;
  },
});

// Get pickem matchups by gameIds
export const getPickemMatchupsByGameIds = internalQuery({
  args: { gameIds: v.array(v.string()) },
  handler: async (ctx, { gameIds }) => {
    console.log(`Searching for ${gameIds.length} pickem games:`, gameIds);

    // Split gameIds into chunks of 25 to avoid hitting memory limits
    const chunkSize = 25;
    const chunks = [];
    for (let i = 0; i < gameIds.length; i += chunkSize) {
      chunks.push(gameIds.slice(i, i + chunkSize));
    }

    let allMatchups: Doc<"pickemMatchups">[] = [];
    for (const chunk of chunks) {
      // Query each gameId individually and combine results
      const matchupsChunk = await Promise.all(
        chunk.map(async (gameId) => {
          const matches = await ctx.db
            .query("pickemMatchups")
            .withIndex("by_gameId", (q) => q.eq("gameId", gameId))
            .collect();
          if (matches.length === 0) {
            console.log(`No pickem matchup found for gameId: ${gameId}`);
          }
          return matches;
        })
      );

      const flattenedChunk = matchupsChunk.flat();
      console.log(
        `Found ${flattenedChunk.length} pickem matchups in chunk of ${chunk.length} gameIds`
      );

      allMatchups = [...allMatchups, ...flattenedChunk];
    }

    console.log(
      `Total pickem matchups found: ${allMatchups.length} out of ${gameIds.length} gameIds`
    );
    return allMatchups;
  },
});

// Handle pickem matchup started
export const handlePickemMatchupStarted = internalMutation({
  args: {
    matchupId: v.id("pickemMatchups"),
    status: pickem_matchup_status,
    homeTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    awayTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, { matchupId, homeTeam, awayTeam, status, metadata }) => {
    // Update pickem matchup to locked
    await ctx.db.patch(matchupId, {
      status: "LOCKED",
      homeTeam,
      awayTeam,
      metadata,
    });
  },
});

// Handle pickem matchup updated
export const handlePickemMatchupUpdated = internalMutation({
  args: {
    matchupId: v.id("pickemMatchups"),
    status: pickem_matchup_status,
    homeTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    awayTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, { matchupId, homeTeam, awayTeam, status, metadata }) => {
    // Update pickem matchup
    await ctx.db.patch(matchupId, {
      status,
      homeTeam,
      awayTeam,
      metadata,
    });
  },
});

// Handle pickem matchup finished
export const handlePickemMatchupFinished = internalMutation({
  args: {
    matchupId: v.id("pickemMatchups"),
    homeTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    awayTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    status: pickem_matchup_status,
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, { matchupId, homeTeam, awayTeam, status, metadata }) => {
    // Determine winner based on scores
    let winnerId: string | undefined;

    if (homeTeam.score > awayTeam.score) {
      winnerId = homeTeam.id;
    } else if (awayTeam.score > homeTeam.score) {
      winnerId = awayTeam.id;
    } else {
      winnerId = "PUSH"; // Tie
    }

    // Update pickem matchup to complete
    await ctx.db.patch(matchupId, {
      status: "COMPLETE",
      homeTeam,
      awayTeam,
      winnerId,
      metadata,
    });

    // Process results if there's a winner
    if (winnerId) {
      await ctx.scheduler.runAfter(
        0,
        internal.pickem.processPickemMatchupResults,
        {
          matchupId,
        }
      );
    }
  },
});

// Distribute weekly prizes for a specific campaign and week
export const distributeWeeklyPrizes = mutation({
  args: {
    campaignId: v.id("pickemCampaigns"),
    seasonType: v.union(
      v.literal("PRESEASON"),
      v.literal("REGULAR_SEASON"),
      v.literal("POSTSEASON")
    ),
    weekNumber: v.number(),
  },
  returns: v.object({
    message: v.string(),
    results: v.array(
      v.object({
        position: v.number(),
        winner: v.string(),
        prize: v.string(),
        coins: v.number(),
        points: v.number(),
      })
    ),
  }),
  handler: async (ctx, { campaignId, seasonType, weekNumber }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Not authenticated");

    // Check if user is admin
    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();

    if (!userProfile || userProfile.role !== "ADMIN") {
      throw new ConvexError("Admin access required");
    }

    const campaign = await ctx.db.get(campaignId);
    if (!campaign) throw new ConvexError("Campaign not found");

    // Get weekly prizes
    const weeklyPrizes =
      campaign.prizes?.filter((prize) => prize.prizeType === "WEEKLY") || [];

    if (weeklyPrizes.length === 0) {
      throw new ConvexError("No weekly prizes configured for this campaign");
    }

    // Get all participants for this campaign
    const participants = await ctx.db
      .query("pickemParticipants")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaignId))
      .collect();

    // Calculate weekly stats for each participant
    const participantStats = await Promise.all(
      participants.map(async (participant) => {
        const user = await ctx.db.get(participant.userId);
        if (!user) return null;

        // Get weekly stats from participant
        const weeklyStats = participant.weeklyStats || {};
        const seasonKey = seasonType.toLowerCase();
        const weekKey = `week${weekNumber}`;
        const weekStats = weeklyStats[seasonKey]?.[weekKey] || {
          points: 0,
          correct: 0,
          incorrect: 0,
          pushed: 0,
        };

        return {
          participant,
          user,
          weekStats,
          totalPoints: weekStats.points || 0,
          correctPicks: weekStats.correct || 0,
        };
      })
    );

    // Filter out null entries and sort by points (descending)
    const validStats = participantStats
      .filter((stat): stat is NonNullable<typeof stat> => stat !== null)
      .sort((a, b) => b.totalPoints - a.totalPoints);

    // Distribute prizes
    const prizeResults = [];
    for (let i = 0; i < Math.min(weeklyPrizes.length, validStats.length); i++) {
      const prize = weeklyPrizes[i];
      const winner = validStats[i];

      if (prize.coins && prize.coins > 0) {
        // Add coins to winner
        await ctx.db.patch(winner.user._id, {
          coins: winner.user.coins + prize.coins,
        });

        // Record transaction
        await ctx.db.insert("coinTransactions", {
          userId: winner.user._id,
          amount: prize.coins,
          type: "PRIZE",
          status: "COMPLETE",
          from: "PICKEM_WEEKLY_PRIZE",
          metadata: {
            campaignId,
            campaignName: campaign.name,
            seasonType,
            weekNumber,
            prizeType: "WEEKLY",
            prizeName: prize.name,
            prizeDescription: prize.description,
            position: i + 1,
            points: winner.totalPoints,
            correctPicks: winner.correctPicks,
          },
        });

        prizeResults.push({
          position: i + 1,
          winner: winner.user.name,
          prize: prize.name,
          coins: prize.coins,
          points: winner.totalPoints,
        });
      }
    }

    return {
      message: `Distributed ${prizeResults.length} weekly prizes`,
      results: prizeResults,
    };
  },
});

// Distribute season prizes for a specific campaign
export const distributeSeasonPrizes = mutation({
  args: {
    campaignId: v.id("pickemCampaigns"),
    seasonType: v.union(
      v.literal("PRESEASON"),
      v.literal("REGULAR_SEASON"),
      v.literal("POSTSEASON")
    ),
  },
  returns: v.object({
    message: v.string(),
    results: v.array(
      v.object({
        position: v.number(),
        winner: v.string(),
        prize: v.string(),
        coins: v.number(),
        totalPoints: v.number(),
        totalCorrect: v.number(),
      })
    ),
  }),
  handler: async (ctx, { campaignId, seasonType }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Not authenticated");

    // Check if user is admin
    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();

    if (!userProfile || userProfile.role !== "ADMIN") {
      throw new ConvexError("Admin access required");
    }

    const campaign = await ctx.db.get(campaignId);
    if (!campaign) throw new ConvexError("Campaign not found");

    // Get season prizes
    const seasonPrizes =
      campaign.prizes?.filter((prize) => prize.prizeType === "SEASON") || [];

    if (seasonPrizes.length === 0) {
      throw new ConvexError("No season prizes configured for this campaign");
    }

    // Get all participants for this campaign
    const participants = await ctx.db
      .query("pickemParticipants")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaignId))
      .collect();

    // Calculate season stats for each participant
    const participantStats = await Promise.all(
      participants.map(async (participant) => {
        const user = await ctx.db.get(participant.userId);
        if (!user) return null;

        // Get season stats from participant
        const weeklyStats = participant.weeklyStats || {};
        const seasonKey = seasonType.toLowerCase();
        const seasonStats = weeklyStats[seasonKey] || {};

        // Sum up all weeks for this season
        let totalPoints = 0;
        let totalCorrect = 0;
        let totalIncorrect = 0;
        let totalPushed = 0;

        Object.values(seasonStats).forEach((weekStats: any) => {
          totalPoints += weekStats.points || 0;
          totalCorrect += weekStats.correct || 0;
          totalIncorrect += weekStats.incorrect || 0;
          totalPushed += weekStats.pushed || 0;
        });

        return {
          participant,
          user,
          seasonStats: {
            totalPoints,
            totalCorrect,
            totalIncorrect,
            totalPushed,
          },
        };
      })
    );

    // Filter out null entries and sort by total points (descending)
    const validStats = participantStats
      .filter((stat): stat is NonNullable<typeof stat> => stat !== null)
      .sort((a, b) => b.seasonStats.totalPoints - a.seasonStats.totalPoints);

    // Distribute prizes
    const prizeResults = [];
    for (let i = 0; i < Math.min(seasonPrizes.length, validStats.length); i++) {
      const prize = seasonPrizes[i];
      const winner = validStats[i];

      if (prize.coins && prize.coins > 0) {
        // Add coins to winner
        await ctx.db.patch(winner.user._id, {
          coins: winner.user.coins + prize.coins,
        });

        // Record transaction
        await ctx.db.insert("coinTransactions", {
          userId: winner.user._id,
          amount: prize.coins,
          type: "PRIZE",
          status: "COMPLETE",
          from: "PICKEM_SEASON_PRIZE",
          metadata: {
            campaignId,
            campaignName: campaign.name,
            seasonType,
            prizeType: "SEASON",
            prizeName: prize.name,
            prizeDescription: prize.description,
            position: i + 1,
            totalPoints: winner.seasonStats.totalPoints,
            totalCorrect: winner.seasonStats.totalCorrect,
            totalIncorrect: winner.seasonStats.totalIncorrect,
            totalPushed: winner.seasonStats.totalPushed,
          },
        });

        prizeResults.push({
          position: i + 1,
          winner: winner.user.name,
          prize: prize.name,
          coins: prize.coins,
          totalPoints: winner.seasonStats.totalPoints,
          totalCorrect: winner.seasonStats.totalCorrect,
        });
      }
    }

    return {
      message: `Distributed ${prizeResults.length} season prizes`,
      results: prizeResults,
    };
  },
});

// Get prize distribution history for a campaign
export const getPrizeDistributionHistory = query({
  args: { campaignId: v.id("pickemCampaigns") },
  returns: v.array(
    v.object({
      _id: v.id("coinTransactions"),
      _creationTime: v.number(),
      userId: v.string(),
      amount: v.number(),
      type: v.string(),
      status: v.string(),
      from: v.optional(v.string()),
      metadata: v.optional(v.any()),
    })
  ),
  handler: async (ctx, { campaignId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Not authenticated");

    // Check if user is admin
    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();

    if (!userProfile || userProfile.role !== "ADMIN") {
      throw new ConvexError("Admin access required");
    }

    // Get all prize transactions for this campaign
    const transactions = await ctx.db
      .query("coinTransactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("type"), "PRIZE"),
          q.or(
            q.eq(q.field("from"), "PICKEM_WEEKLY_PRIZE"),
            q.eq(q.field("from"), "PICKEM_SEASON_PRIZE")
          )
        )
      )
      .order("desc")
      .collect();

    return transactions.filter((transaction) => {
      const metadata = transaction.metadata as
        | { campaignId?: string }
        | undefined;
      return metadata?.campaignId === campaignId;
    });
  },
});

// Get participant standings for a specific week
export const getWeeklyStandings = query({
  args: {
    campaignId: v.id("pickemCampaigns"),
    seasonType: v.union(
      v.literal("PRESEASON"),
      v.literal("REGULAR_SEASON"),
      v.literal("POSTSEASON")
    ),
    weekNumber: v.number(),
  },
  returns: v.array(
    v.object({
      userId: v.id("users"),
      name: v.string(),
      image: v.optional(v.string()),
      points: v.number(),
      correct: v.number(),
      incorrect: v.number(),
      pushed: v.number(),
    })
  ),
  handler: async (ctx, { campaignId, seasonType, weekNumber }) => {
    const participants = await ctx.db
      .query("pickemParticipants")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaignId))
      .collect();

    const standings = await Promise.all(
      participants.map(async (participant) => {
        const user = await ctx.db.get(participant.userId);
        if (!user) return null;

        const weeklyStats = participant.weeklyStats || {};
        const seasonKey = seasonType.toLowerCase();
        const weekKey = `week${weekNumber}`;
        const weekStats = weeklyStats[seasonKey]?.[weekKey] || {
          points: 0,
          correct: 0,
          incorrect: 0,
          pushed: 0,
        };

        return {
          userId: user._id,
          name: user.name,
          image: user.image,
          points: weekStats.points || 0,
          correct: weekStats.correct || 0,
          incorrect: weekStats.incorrect || 0,
          pushed: weekStats.pushed || 0,
        };
      })
    );

    return standings
      .filter(
        (standing): standing is NonNullable<typeof standing> =>
          standing !== null
      )
      .sort((a, b) => b.points - a.points);
  },
});

// Get participant standings for the entire season
export const getSeasonStandings = query({
  args: {
    campaignId: v.id("pickemCampaigns"),
    seasonType: v.union(
      v.literal("PRESEASON"),
      v.literal("REGULAR_SEASON"),
      v.literal("POSTSEASON")
    ),
  },
  returns: v.array(
    v.object({
      userId: v.id("users"),
      name: v.string(),
      image: v.optional(v.string()),
      totalPoints: v.number(),
      totalCorrect: v.number(),
      totalIncorrect: v.number(),
      totalPushed: v.number(),
    })
  ),
  handler: async (ctx, { campaignId, seasonType }) => {
    const participants = await ctx.db
      .query("pickemParticipants")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaignId))
      .collect();

    const standings = await Promise.all(
      participants.map(async (participant) => {
        const user = await ctx.db.get(participant.userId);
        if (!user) return null;

        const weeklyStats = participant.weeklyStats || {};
        const seasonKey = seasonType.toLowerCase();
        const seasonStats = weeklyStats[seasonKey] || {};

        // Sum up all weeks for this season
        let totalPoints = 0;
        let totalCorrect = 0;
        let totalIncorrect = 0;
        let totalPushed = 0;

        Object.values(seasonStats).forEach((weekStats: any) => {
          totalPoints += weekStats.points || 0;
          totalCorrect += weekStats.correct || 0;
          totalIncorrect += weekStats.incorrect || 0;
          totalPushed += weekStats.pushed || 0;
        });

        return {
          userId: user._id,
          name: user.name,
          image: user.image,
          totalPoints,
          totalCorrect,
          totalIncorrect,
          totalPushed,
        };
      })
    );

    return standings
      .filter(
        (standing): standing is NonNullable<typeof standing> =>
          standing !== null
      )
      .sort((a, b) => b.totalPoints - a.totalPoints);
  },
});

// Advance week for all active pickem campaigns
export const advancePickemWeek = internalMutation({
  args: {},
  returns: v.object({
    message: v.string(),
    campaignsUpdated: v.number(),
    matchupsActivated: v.number(),
    seasonTransitions: v.number(),
  }),
  handler: async (ctx) => {
    const currentTime = new Date().getTime();

    // Get all active pickem campaigns
    const activeCampaigns = await ctx.db
      .query("pickemCampaigns")
      .filter((q) =>
        q.and(
          q.lte(q.field("startDate"), currentTime),
          q.gte(q.field("endDate"), currentTime)
        )
      )
      .collect();

    let campaignsUpdated = 0;
    let matchupsActivated = 0;
    let seasonTransitions = 0;

    for (const campaign of activeCampaigns) {
      // Get current state
      const currentWeek = campaign.currentWeek || 0;
      const currentSeasonType = campaign.currentSeasonType || "PRESEASON";

      // Determine next week and season type
      let nextWeek: number;
      let nextSeasonType: "PRESEASON" | "REGULAR_SEASON" | "POSTSEASON";

      if (currentSeasonType === "PRESEASON") {
        if (currentWeek >= 4) {
          // Transition from preseason to regular season
          nextSeasonType = "REGULAR_SEASON";
          nextWeek = 1; // Reset to week 1
          seasonTransitions++;
        } else {
          // Stay in preseason
          nextSeasonType = "PRESEASON";
          nextWeek = currentWeek + 1;
        }
      } else if (currentSeasonType === "REGULAR_SEASON") {
        if (currentWeek >= 18) {
          // Transition from regular season to postseason
          nextSeasonType = "POSTSEASON";
          nextWeek = 1; // Reset to week 1
          seasonTransitions++;
        } else {
          // Stay in regular season
          nextSeasonType = "REGULAR_SEASON";
          nextWeek = currentWeek + 1;
        }
      } else {
        // Already in postseason, just increment week
        nextSeasonType = "POSTSEASON";
        nextWeek = currentWeek + 1;
      }

      // Update campaign with new week and season type
      await ctx.db.patch(campaign._id, {
        currentWeek: nextWeek,
        currentSeasonType: nextSeasonType,
      });
      campaignsUpdated++;

      // Find all pending matchups for this campaign, season type, and week
      const matchups = await ctx.db
        .query("pickemMatchups")
        .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
        .filter((q) =>
          q.and(
            q.eq(q.field("week"), nextWeek),
            q.eq(q.field("seasonType"), nextSeasonType),
            q.eq(q.field("status"), "PENDING")
          )
        )
        .collect();

      // Activate all pending matchups for this week
      for (const matchup of matchups) {
        await ctx.db.patch(matchup._id, {
          status: "ACTIVE",
        });
        matchupsActivated++;
      }
    }

    return {
      message: `Advanced week for ${campaignsUpdated} campaigns, activated ${matchupsActivated} matchups, and completed ${seasonTransitions} season transitions`,
      campaignsUpdated,
      matchupsActivated,
      seasonTransitions,
    };
  },
});

// Get current week and season type for a pickem campaign
export const getPickemCampaignCurrentState = query({
  args: { campaignId: v.id("pickemCampaigns") },
  returns: v.object({
    currentWeek: v.number(),
    currentSeasonType: v.union(
      v.literal("PRESEASON"),
      v.literal("REGULAR_SEASON"),
      v.literal("POSTSEASON")
    ),
    nextWeek: v.number(),
    nextSeasonType: v.union(
      v.literal("PRESEASON"),
      v.literal("REGULAR_SEASON"),
      v.literal("POSTSEASON")
    ),
  }),
  handler: async (ctx, { campaignId }) => {
    const campaign = await ctx.db.get(campaignId);
    if (!campaign) {
      throw new ConvexError("Campaign not found");
    }

    const currentWeek = campaign.currentWeek || 0;
    const currentSeasonType = campaign.currentSeasonType || "PRESEASON";

    // Calculate next state
    let nextWeek: number;
    let nextSeasonType: "PRESEASON" | "REGULAR_SEASON" | "POSTSEASON";

    if (currentSeasonType === "PRESEASON") {
      if (currentWeek >= 4) {
        nextSeasonType = "REGULAR_SEASON";
        nextWeek = 1;
      } else {
        nextSeasonType = "PRESEASON";
        nextWeek = currentWeek + 1;
      }
    } else if (currentSeasonType === "REGULAR_SEASON") {
      if (currentWeek >= 18) {
        nextSeasonType = "POSTSEASON";
        nextWeek = 1;
      } else {
        nextSeasonType = "REGULAR_SEASON";
        nextWeek = currentWeek + 1;
      }
    } else {
      nextSeasonType = "POSTSEASON";
      nextWeek = currentWeek + 1;
    }

    return {
      currentWeek,
      currentSeasonType,
      nextWeek,
      nextSeasonType,
    };
  },
});

// Manual function to advance week for testing (admin only)
export const manualAdvancePickemWeek = mutation({
  args: { campaignId: v.optional(v.id("pickemCampaigns")) },
  returns: v.object({
    message: v.string(),
    campaignsUpdated: v.number(),
    matchupsActivated: v.number(),
    seasonTransitions: v.number(),
  }),
  handler: async (
    ctx,
    { campaignId }
  ): Promise<{
    message: string;
    campaignsUpdated: number;
    matchupsActivated: number;
    seasonTransitions: number;
  }> => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Not authenticated");

    // Check if user is admin
    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();

    if (!userProfile || userProfile.role !== "ADMIN") {
      throw new ConvexError("Admin access required");
    }

    // If campaignId is provided, advance only that campaign
    if (campaignId) {
      const campaign = await ctx.db.get(campaignId);
      if (!campaign) throw new ConvexError("Campaign not found");

      const currentWeek = campaign.currentWeek || 0;
      const currentSeasonType = campaign.currentSeasonType || "PRESEASON";

      // Determine next state
      let nextWeek: number;
      let nextSeasonType: "PRESEASON" | "REGULAR_SEASON" | "POSTSEASON";
      let seasonTransitions = 0;

      if (currentSeasonType === "PRESEASON") {
        if (currentWeek >= 4) {
          nextSeasonType = "REGULAR_SEASON";
          nextWeek = 1;
          seasonTransitions = 1;
        } else {
          nextSeasonType = "PRESEASON";
          nextWeek = currentWeek + 1;
        }
      } else if (currentSeasonType === "REGULAR_SEASON") {
        if (currentWeek >= 18) {
          nextSeasonType = "POSTSEASON";
          nextWeek = 1;
          seasonTransitions = 1;
        } else {
          nextSeasonType = "REGULAR_SEASON";
          nextWeek = currentWeek + 1;
        }
      } else {
        nextSeasonType = "POSTSEASON";
        nextWeek = currentWeek + 1;
      }

      await ctx.db.patch(campaign._id, {
        currentWeek: nextWeek,
        currentSeasonType: nextSeasonType,
      });

      // Find and activate matchups for this campaign, season type, and week
      const matchups = await ctx.db
        .query("pickemMatchups")
        .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
        .filter((q) =>
          q.and(
            q.eq(q.field("week"), nextWeek),
            q.eq(q.field("seasonType"), nextSeasonType),
            q.eq(q.field("status"), "PENDING")
          )
        )
        .collect();

      let matchupsActivated = 0;
      for (const matchup of matchups) {
        await ctx.db.patch(matchup._id, {
          status: "ACTIVE",
        });
        matchupsActivated++;
      }

      return {
        message: `Advanced campaign '${campaign.name}' to ${nextSeasonType} Week ${nextWeek} and activated ${matchupsActivated} matchups`,
        campaignsUpdated: 1,
        matchupsActivated,
        seasonTransitions,
      };
    }

    // Otherwise, advance all active campaigns
    const result = await ctx.runMutation(internal.pickem.advancePickemWeek, {});
    return result;
  },
});
