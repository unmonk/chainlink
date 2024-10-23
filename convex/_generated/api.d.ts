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
import type * as campaigns from "../campaigns.js";
import type * as chains from "../chains.js";
import type * as crons from "../crons.js";
import type * as leaderboards from "../leaderboards.js";
import type * as matchups from "../matchups.js";
import type * as notifications from "../notifications.js";
import type * as picks from "../picks.js";
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
  campaigns: typeof campaigns;
  chains: typeof chains;
  crons: typeof crons;
  leaderboards: typeof leaderboards;
  matchups: typeof matchups;
  notifications: typeof notifications;
  picks: typeof picks;
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
