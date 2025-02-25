import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { question_status } from "./schema";
import { api, internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

export const updateQuizStatus = mutation({
  args: { quizId: v.id("globalQuiz"), status: question_status },
  handler: async (ctx, { quizId, status }) => {
    await ctx.db.patch(quizId, { status });
  },
});

export const submitAnswer = mutation({
  args: {
    quizId: v.id("globalQuiz"),
    selectedOptionId: v.string(),
    wager: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, { quizId, selectedOptionId, wager, userId }) => {
    //ensure user does not have a response already
    const existingResponse = await ctx.db
      .query("quizResponses")
      .withIndex("by_quizId_userId", (q) =>
        q.eq("quizId", quizId).eq("userId", userId)
      )
      .first();

    if (existingResponse) return;

    if (wager < 0) return;
    if (wager > 0) {
      //deduct coins
      try {
        await ctx.runMutation(api.users.subtractCoins, {
          amount: wager,
          transactionType: "WAGER",
          userId,
        });
      } catch (error) {
        console.error(error);
      }
    }

    await ctx.db.insert("quizResponses", {
      quizId,
      selectedOptionId,
      wager,
      userId,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

export const listQuizzes = query({
  args: {},
  handler: async ({ db }) => {
    const quizzes = await db.query("globalQuiz").order("desc").take(15);
    const quizzesWithResponses = await Promise.all(
      quizzes.map(async (quiz) => {
        const responses = await db
          .query("quizResponses")
          .withIndex("by_quizId", (q) => q.eq("quizId", quiz._id))
          .collect();
        return {
          ...quiz,
          responses,
          totalParticipants: responses.length,
          totalWagers: responses.reduce((acc, curr) => acc + curr.wager, 0),
        };
      })
    );
    return quizzesWithResponses;
  },
});

export const getActiveQuiz = query({
  args: {},
  handler: async ({ db }) => {
    const quiz = await db
      .query("globalQuiz")
      .withIndex("by_status", (q) => q.eq("status", "ACTIVE"))
      .first();
    if (!quiz) return null;
    const quizResponses = await db
      .query("quizResponses")
      .withIndex("by_quizId", (q) => q.eq("quizId", quiz?._id))
      .collect();

    const totalParticipants = quizResponses.length;
    const totalWagers = quizResponses.reduce(
      (acc, curr) => acc + curr.wager,
      0
    );
    const percentagePerOption = quizResponses.reduce(
      (acc, response) => {
        const count = acc[response.selectedOptionId] || 0;
        acc[response.selectedOptionId] = count + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const percentageResults = Object.entries(percentagePerOption).map(
      ([optionId, count]) => {
        const percentage = (count / totalParticipants) * 100;
        return {
          optionId,
          percentage,
        };
      }
    );
    return {
      quiz,
      participants: quizResponses,
      totalParticipants,
      totalWagers,
      percentagePerOption,
      percentageResults,
    };
  },
});

export const updateQuiz = mutation({
  args: {
    quizId: v.id("globalQuiz"),
    status: question_status,
    correctAnswerId: v.optional(v.string()),
  },
  handler: async (ctx, { quizId, status, correctAnswerId }) => {
    if (status === "COMPLETE") {
      const quiz = await ctx.db.get(quizId);
      if (!quiz) return;

      // Get all responses for this quiz
      const quizResponses = await ctx.db
        .query("quizResponses")
        .withIndex("by_quizId", (q) => q.eq("quizId", quizId))
        .collect();

      if (correctAnswerId === "TIE") {
        // In case of a tie, pay out everyone who participated
        for (const response of quizResponses) {
          const payout = response.wager * 10;
          await ctx.scheduler.runAfter(0, api.users.adjustCoins, {
            amount: payout,
            transactionType: "PAYOUT",
            userId: response.userId,
          });
          await ctx.db.patch(response._id, { win: true });
        }
      } else {
        // Set win status for all responses
        for (const response of quizResponses) {
          const userWin = response.selectedOptionId === correctAnswerId;
          await ctx.db.patch(response._id, { win: userWin });

          // Only pay out winning responses
          if (userWin) {
            const payout = response.wager * 10;
            await ctx.scheduler.runAfter(0, api.users.adjustCoins, {
              amount: payout,
              transactionType: "PAYOUT",
              userId: response.userId,
            });
          }
        }
      }
    }

    await ctx.db.patch(quizId, { status, correctAnswerId });
  },
});

export const createQuiz = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    minWager: v.number(),
    maxWager: v.number(),
    expiresAt: v.number(),
    options: v.array(
      v.object({
        optionId: v.string(),
        optionText: v.string(),
      })
    ),
  },
  handler: async (
    ctx,
    { title, description, minWager, maxWager, expiresAt, options }
  ) => {
    await ctx.db.insert("globalQuiz", {
      title,
      description,
      minWager,
      maxWager,
      expiresAt,
      options: options.map((option) => ({
        id: option.optionId,
        text: option.optionText,
      })),
      status: "DRAFT",
    });
  },
});

interface ResponseWithUser extends Doc<"quizResponses"> {
  user: Doc<"users">;
}

export const getQuizById = query({
  args: { quizId: v.id("globalQuiz") },
  handler: async (ctx, { quizId }) => {
    const quiz = await ctx.db.get(quizId);
    if (!quiz) return null;
    const quizResponses = await ctx.db
      .query("quizResponses")
      .withIndex("by_quizId", (q) => q.eq("quizId", quiz?._id))
      .collect();

    const userIds = Array.from(
      new Set(quizResponses.map((response) => response.userId))
    );

    const users = await Promise.all(
      userIds.map(async (userId) => {
        const user = await ctx.db.get(userId);
        return user;
      })
    );

    const userMap = users.reduce(
      (acc, user) => {
        if (user) {
          acc[user._id] = {
            name: user.name,
            image: user.image,
            metadata: user.metadata,
          };
        }
        return acc;
      },
      {} as Record<string, { name: string; image: string; metadata: any }>
    );

    const responsesWithUsers = quizResponses.map((response) => ({
      ...response,
      user: userMap[response.userId] || { name: "Unknown User", image: "" },
    }));

    const totalParticipants = quizResponses.length;
    const totalWagers = quizResponses.reduce(
      (acc, curr) => acc + curr.wager,
      0
    );
    const percentagePerOption = quizResponses.reduce(
      (acc, response) => {
        const count = acc[response.selectedOptionId] || 0;
        acc[response.selectedOptionId] = count + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const percentageResults = Object.entries(percentagePerOption).map(
      ([optionId, count]) => {
        const percentage = (count / totalParticipants) * 100;
        return {
          optionId,
          percentage,
        };
      }
    );
    return {
      quiz,
      responses: responsesWithUsers,
      totalParticipants,
      totalWagers,
      percentagePerOption,
      percentageResults,
    } as QuizResults;
  },
});

export interface QuizResults {
  quiz: Doc<"globalQuiz">;
  responses: ResponseWithUser[];
  totalParticipants: number;
  totalWagers: number;
  percentagePerOption: Record<string, number>;
  percentageResults: { optionId: string; percentage: number }[];
}

export const getUserQuizRecord = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, { userId }) => {
    if (!userId) return [];

    const responses = await ctx.db
      .query("quizResponses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    return responses;
  },
});
