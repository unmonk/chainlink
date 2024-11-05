/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as achievements from "../achievements.js";
import type * as announcements from "../announcements.js";
import type * as blackjack from "../blackjack.js";
import type * as brackets from "../brackets.js";
import type * as campaigns from "../campaigns.js";
import type * as chains from "../chains.js";
import type * as coingames from "../coingames.js";
import type * as crons from "../crons.js";
import type * as espnbracket from "../espnbracket.js";
import type * as friends from "../friends.js";
import type * as leaderboards from "../leaderboards.js";
import type * as matchups from "../matchups.js";
import type * as notifications from "../notifications.js";
import type * as pickqueue from "../pickqueue.js";
import type * as picks from "../picks.js";
import type * as quiz from "../quiz.js";
import type * as scheduleprocessors from "../scheduleprocessors.js";
import type * as schedules from "../schedules.js";
import type * as scoreboards from "../scoreboards.js";
import type * as squads from "../squads.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  achievements: typeof achievements;
  announcements: typeof announcements;
  blackjack: typeof blackjack;
  brackets: typeof brackets;
  campaigns: typeof campaigns;
  chains: typeof chains;
  coingames: typeof coingames;
  crons: typeof crons;
  espnbracket: typeof espnbracket;
  friends: typeof friends;
  leaderboards: typeof leaderboards;
  matchups: typeof matchups;
  notifications: typeof notifications;
  pickqueue: typeof pickqueue;
  picks: typeof picks;
  quiz: typeof quiz;
  scheduleprocessors: typeof scheduleprocessors;
  schedules: typeof schedules;
  scoreboards: typeof scoreboards;
  squads: typeof squads;
  users: typeof users;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
