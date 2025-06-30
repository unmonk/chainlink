import { ConvexError, v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { pickem_matchup_status } from "./schema";

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
    league: v.string(),
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

//get pickem matchups by campaign
export const getPickemMatchupsByCampaign = query({
  args: { campaignId: v.id("pickemCampaigns") },
  handler: async (ctx, { campaignId }) => {
    return await ctx.db
      .query("pickemMatchups")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
      .collect();
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
      .withIndex("by_matchupId", (q) => q.eq("matchupId", matchupId))
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
      .withIndex("by_matchupId", (q) => q.eq("matchupId", matchupId))
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

      // Update participant stats
      const participant = await ctx.db.get(pick.participantId);
      if (participant) {
        const weeklyPoints = { ...participant.weeklyPoints };
        const weekKey = `week${pick.week}`;
        weeklyPoints[weekKey] = (weeklyPoints[weekKey] || 0) + pointsEarned;

        await ctx.db.patch(participant._id, {
          totalPoints: participant.totalPoints + pointsEarned,
          weeklyPoints,
          correctPicks: participant.correctPicks + (status === "WIN" ? 1 : 0),
          incorrectPicks:
            participant.incorrectPicks + (status === "LOSS" ? 1 : 0),
          pushedPicks: participant.pushedPicks + (status === "PUSH" ? 1 : 0),
        });
      }
    }
  },
});

// Create a new pickem campaign
export const createPickemCampaign = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    league: v.string(),
    type: v.union(
      v.literal("TRADITIONAL"),
      v.literal("WEEKLY"),
      v.literal("SURVIVOR")
    ),
    scoringType: v.union(
      v.literal("STANDARD"),
      v.literal("SPREAD"),
      v.literal("CONFIDENCE")
    ),
    startDate: v.number(),
    endDate: v.number(),
    entryFee: v.number(),
    settings: v.object({
      allowTies: v.boolean(),
      dropLowestWeeks: v.optional(v.number()),
      excludeGames: v.optional(v.array(v.string())),
      confidencePoints: v.optional(v.boolean()),
      pointSpreads: v.optional(v.boolean()),
      includePlayoffs: v.optional(v.boolean()),
      includePreseason: v.optional(v.boolean()),
    }),
    prizes: v.optional(
      v.array(
        v.object({
          place: v.number(),
          coins: v.number(),
          merch: v.optional(v.string()),
          merchStorageId: v.optional(v.id("_storage")),
          description: v.string(),
        })
      )
    ),
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
      active: true,
      featured: false,
      metadata: {},
    });

    return campaignId;
  },
});

// Join a pickem campaign
export const joinPickemCampaign = mutation({
  args: { campaignId: v.id("pickemCampaigns") },
  handler: async (ctx, { campaignId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Not authenticated");

    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();

    if (!userProfile) throw new ConvexError("User not found");

    const campaign = await ctx.db.get(campaignId);
    if (!campaign) throw new ConvexError("Campaign not found");
    if (!campaign.active) throw new ConvexError("Campaign not active");

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
        throw new ConvexError("Insufficient coins");
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
      active: true,
      eliminated: false,
      totalPoints: 0,
      weeklyPoints: {},
      picksMade: 0,
      correctPicks: 0,
      incorrectPicks: 0,
      pushedPicks: 0,
      usedTeams: [],
      metadata: {},
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
    const campaigns = await ctx.db
      .query("pickemCampaigns")
      .withIndex("by_league_active", (q) =>
        q.eq("league", league).eq("active", true)
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
      .withIndex("by_userId", (q) => q.eq("userId", userProfile._id))
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

// Submit picks for a week
export const submitPickemPicks = mutation({
  args: {
    campaignId: v.id("pickemCampaigns"),
    week: v.number(),
    picks: v.array(
      v.object({
        matchupId: v.id("pickemMatchups"),
        teamId: v.string(),
        teamName: v.string(),
        teamImage: v.string(),
        confidencePoints: v.optional(v.number()),
        pointSpread: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, { campaignId, week, picks }) => {
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
    if (participant.eliminated)
      throw new ConvexError("Eliminated from campaign");

    // Validate picks based on campaign type
    if (campaign.type === "SURVIVOR" && picks.length !== 1) {
      throw new ConvexError(
        "Survivor campaigns require exactly one pick per week"
      );
    }

    // Check if picks are already submitted for this week
    const existingPicks = await ctx.db
      .query("pickemPicks")
      .withIndex("by_campaign_week", (q) =>
        q.eq("campaignId", campaignId).eq("week", week)
      )
      .filter((q) => q.eq(q.field("participantId"), participant._id))
      .collect();

    if (existingPicks.length > 0) {
      throw new ConvexError("Picks already submitted for this week");
    }

    // Create picks
    const pickIds = await Promise.all(
      picks.map(async (pick) => {
        return await ctx.db.insert("pickemPicks", {
          campaignId,
          participantId: participant._id,
          matchupId: pick.matchupId,
          week,
          pick: {
            teamId: pick.teamId,
            teamName: pick.teamName,
            teamImage: pick.teamImage,
          },
          confidencePoints: pick.confidencePoints,
          pointSpread: pick.pointSpread,
          status: "PENDING",
          pointsEarned: 0,
          submittedAt: new Date().getTime(),
          metadata: {},
        });
      })
    );

    // Update participant stats
    await ctx.db.patch(participant._id, {
      picksMade: participant.picksMade + picks.length,
    });

    return pickIds;
  },
});

// Get leaderboard for a campaign
export const getPickemLeaderboard = query({
  args: { campaignId: v.id("pickemCampaigns") },
  handler: async (ctx, { campaignId }) => {
    const participants = await ctx.db
      .query("pickemParticipants")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
      .order("desc")
      .collect();

    const leaderboard = await Promise.all(
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

    return leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
  },
});

// Add: Get all pickem campaigns (admin)
export const getAllPickemCampaigns = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pickemCampaigns").collect();
  },
});

// Add: Get all pickem participants (admin)
export const getAllPickemParticipants = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pickemParticipants").collect();
  },
});

// Add: Get pickem campaign by ID (admin)
export const getPickemCampaignById = query({
  args: { campaignId: v.id("pickemCampaigns") },
  handler: async (ctx, { campaignId }) => {
    return await ctx.db.get(campaignId);
  },
});

// Get pickem weeks by campaign
export const getPickemWeeksByCampaign = query({
  args: { campaignId: v.id("pickemCampaigns") },
  handler: async (ctx, { campaignId }) => {
    const weeks = await ctx.db
      .query("pickemWeeks")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
      .order("asc")
      .collect();

    // Get the actual matchup data for each week
    const weeksWithMatchups = await Promise.all(
      weeks.map(async (week) => {
        const matchups = await Promise.all(
          week.matchups.map(async (matchupId) => {
            return await ctx.db.get(matchupId);
          })
        );

        return {
          ...week,
          matchups: matchups.filter(Boolean), // Remove any null matchups
        };
      })
    );

    return weeksWithMatchups;
  },
});

// Update a pickem campaign
export const updatePickemCampaign = mutation({
  args: {
    campaignId: v.id("pickemCampaigns"),
    name: v.string(),
    description: v.string(),
    league: v.string(),
    type: v.union(
      v.literal("TRADITIONAL"),
      v.literal("WEEKLY"),
      v.literal("SURVIVOR")
    ),
    scoringType: v.union(
      v.literal("STANDARD"),
      v.literal("SPREAD"),
      v.literal("CONFIDENCE")
    ),
    startDate: v.number(),
    endDate: v.number(),
    entryFee: v.number(),
    featured: v.boolean(),
    settings: v.object({
      allowTies: v.boolean(),
      dropLowestWeeks: v.optional(v.number()),
      excludeGames: v.optional(v.array(v.string())),
      confidencePoints: v.optional(v.boolean()),
      pointSpreads: v.optional(v.boolean()),
      includePlayoffs: v.optional(v.boolean()),
      includePreseason: v.optional(v.boolean()),
    }),
    prizes: v.optional(
      v.array(
        v.object({
          place: v.number(),
          coins: v.number(),
          merch: v.optional(v.string()),
          merchStorageId: v.optional(v.id("_storage")),
          description: v.string(),
        })
      )
    ),
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

// Get matchups organized by season type and week for a campaign
export const getPickemMatchupsBySeasonAndWeek = query({
  args: { campaignId: v.id("pickemCampaigns") },
  handler: async (ctx, { campaignId }) => {
    const matchups = await ctx.db
      .query("pickemMatchups")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
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
