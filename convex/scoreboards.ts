import { internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";
import { ScoreboardResponse } from "./espn";
import { League } from "./types";
import {
  ACTIVE_LEAGUES,
  getHawaiiTime,
  MATCHUP_FINAL_STATUSES,
  MATCHUP_IN_PROGRESS_STATUSES,
  MATCHUP_SCHEDULED_STATUSES,
} from "./utils";

export const scoreboards = action({
  args: {},
  handler: async (ctx) => {
    let actionResponse: Record<
      string,
      {
        fetchedEvents: number;
        fetchedMatchups: number;
        matchupsStarted: number;
        matchupsFinished: number;
        matchupsUpdated: number;
        message: string;
        games: { game: string; result: string }[];
      }
    > = {};

    // Fetch scoreboard data for all leagues
    const leagueData: Record<League, ScoreboardResponse> = {
      NFL: {
        events: [],
        leagues: undefined,
      },
      NBA: {
        events: [],
        leagues: undefined,
      },
      MLB: {
        events: [],
        leagues: undefined,
      },
      NHL: {
        events: [],
        leagues: undefined,
      },
      "COLLEGE-FOOTBALL": {
        events: [],
        leagues: undefined,
      },
      MBB: {
        events: [],
        leagues: undefined,
      },
      WBB: {
        events: [],
        leagues: undefined,
      },
      WNBA: {
        events: [],
        leagues: undefined,
      },
      MLS: {
        events: [],
        leagues: undefined,
      },
      PLL: {
        events: [],
        leagues: undefined,
      },
      NWSL: {
        events: [],
        leagues: undefined,
      },
      EPL: {
        events: [],
        leagues: undefined,
      },
      RPL: {
        events: [],
        leagues: undefined,
      },
      ARG: {
        events: [],
        leagues: undefined,
      },
      TUR: {
        events: [],
        leagues: undefined,
      },
      CSL: {
        events: [],
        leagues: undefined,
      },
      NBAG: {
        events: [],
        leagues: undefined,
      },
      FRIENDLY: {
        events: [],
        leagues: undefined,
      },
      UFL: {
        events: [],
        leagues: undefined,
      },
    };
    const allGameIds: string[] = [];

    for (const league of ACTIVE_LEAGUES) {
      const urlOrUrls = getScoreboardUrl(league);

      if (Array.isArray(urlOrUrls)) {
        // Handle WBB/MBB case with multiple URLs
        const allResponses = await Promise.all(
          urlOrUrls.map((url) =>
            fetch(url).then((res) => res.json() as Promise<ScoreboardResponse>)
          )
        );

        // Merge all responses into one
        leagueData[league] = allResponses.reduce(
          (acc, curr) => ({
            events: [...(acc.events || []), ...(curr.events || [])],
            leagues: curr.leagues, // Take the last one or handle as needed
          }),
          { events: [], leagues: undefined }
        );
      } else {
        // Handle single URL case for other leagues
        const response = await fetch(urlOrUrls);
        const data = (await response.json()) as ScoreboardResponse;
        leagueData[league] = data;
      }

      if (leagueData[league].events && leagueData[league].events.length > 0) {
        //remove duplicates from events
        leagueData[league].events = leagueData[league].events.filter(
          (event, index, self) =>
            index === self.findIndex((t) => t.id === event.id)
        );

        allGameIds.push(...leagueData[league].events.map((event) => event.id));
      }
    }
    // Query all matchups at once
    const allMatchups = await ctx.runQuery(
      internal.matchups.getMatchupsByGameIds,
      {
        gameIds: allGameIds,
      }
    );

    // Process each league
    for (const league of ACTIVE_LEAGUES) {
      let leagueResponse = {
        fetchedEvents: 0,
        fetchedMatchups: 0,
        matchupsStarted: 0,
        matchupsFinished: 0,
        matchupsUpdated: 0,
        message: "",
        games: [] as { game: string; result: string }[],
      };

      const data = leagueData[league];

      //check if no events found
      if (!data.events || data.events.length === 0) {
        leagueResponse.message = "NO EVENTS FOUND";
        actionResponse[league] = leagueResponse;
        continue;
      }

      //filter matchups by league
      const leagueMatchups = allMatchups.filter((m) => m.league === league);

      leagueResponse.fetchedEvents = data.events.length;
      leagueResponse.fetchedMatchups = leagueMatchups.length;

      // Process events for the current league
      for (const event of data.events) {
        const matchup = leagueMatchups.find((m) => m.gameId === event.id);
        //check if no matchup found
        if (!matchup) {
          leagueResponse.games.push({
            game: event.shortName || "",
            result: `Skipped with no matchup`,
          });
          continue;
        }

        // Skip if matchup is already final
        if (MATCHUP_FINAL_STATUSES.includes(matchup.status)) {
          leagueResponse.games.push({
            game: event.shortName || "",
            result: `Skipped - already final`,
          });
          continue;
        }

        //get event status
        const eventStatus = event.competitions[0].status?.type?.name;
        if (!eventStatus) {
          leagueResponse.games.push({
            game: event.shortName || "",
            result: `Skipped - no event status`,
          });
          continue;
        }

        const statusDetails = event.competitions[0].status?.type?.detail;
        const homeTeam = event.competitions[0].competitors.find(
          (competitor) => competitor.homeAway === "home"
        );
        const awayTeam = event.competitions[0].competitors.find(
          (competitor) => competitor.homeAway === "away"
        );
        //check if no home or away team found
        if (!homeTeam || !awayTeam) {
          leagueResponse.games.push({
            game: event.shortName || "",
            result: `Skipped with no home or away team`,
          });
          continue;
        }
        const homeScore = parseInt(homeTeam.score);
        const awayScore = parseInt(awayTeam.score);

        //#region HANDLE MATCHUP STATUS AND SCORE CHANGES

        ///////////////////MATCHUP STARTED////////////////////////
        if (
          MATCHUP_SCHEDULED_STATUSES.includes(matchup.status) &&
          MATCHUP_IN_PROGRESS_STATUSES.includes(eventStatus)
        ) {
          await ctx.runMutation(internal.matchups.handleMatchupStarted, {
            matchupId: matchup._id,
            status: eventStatus,
            homeTeam: {
              id: matchup.homeTeam.id,
              name: matchup.homeTeam.name,
              score: homeScore,
              image: matchup.homeTeam.image,
            },
            awayTeam: {
              id: matchup.awayTeam.id,
              name: matchup.awayTeam.name,
              score: awayScore,
              image: matchup.awayTeam.image,
            },
            metadata: {
              ...matchup.metadata,
              statusDetails: statusDetails,
            },
          });
          leagueResponse.matchupsStarted++;
          leagueResponse.games.push({
            game: event.shortName || "",
            result: `Matchup started`,
          });
        }

        ///////////////////MATCHUP ENDED////////////////////////
        if (
          MATCHUP_IN_PROGRESS_STATUSES.includes(matchup.status) &&
          MATCHUP_FINAL_STATUSES.includes(eventStatus)
        ) {
          await ctx.runMutation(internal.matchups.handleMatchupFinished, {
            matchupId: matchup._id,
            homeTeam: {
              id: matchup.homeTeam.id,
              name: matchup.homeTeam.name,
              score: homeScore,
              image: matchup.homeTeam.image,
            },
            awayTeam: {
              id: matchup.awayTeam.id,
              name: matchup.awayTeam.name,
              score: awayScore,
              image: matchup.awayTeam.image,
            },
            status: eventStatus,
            type: matchup.type,
            typeDetails: matchup.typeDetails,
            metadata: {
              ...matchup.metadata,
              statusDetails: statusDetails,
            },
          });
          leagueResponse.matchupsFinished++;
          leagueResponse.games.push({
            game: event.shortName || "",
            result: `Matchup finished`,
          });
        }

        /////////////MATCHUP POSTPONED///////////////////////////
        //release picks / push

        /////////////MATCHUP DELAYED////////////////////////////
        //hold
        /////////////MATCHUP CANCELLED//////////////////////////
        //release

        //overtime

        /////////////MATCHUP UPDATE ONLY////////////////////////
        if (
          eventStatus &&
          !MATCHUP_FINAL_STATUSES.includes(eventStatus) &&
          !MATCHUP_SCHEDULED_STATUSES.includes(matchup.status)
        ) {
          //#region CHECK FOR CHANGES IN MATCHUP and LOGGING
          let hasChanged = false;
          let hasChangedDetails = "";
          if (matchup.status !== eventStatus) {
            hasChanged = true;
            hasChangedDetails += `status difference ours: ${matchup.status} espn: ${eventStatus} for ${event.shortName}`;
          }
          if (matchup.homeTeam.score !== homeScore) {
            hasChanged = true;
            hasChangedDetails += `home score changed from ${matchup.homeTeam.score} to ${homeScore} for ${event.shortName}`;
          }
          if (matchup.awayTeam.score !== awayScore) {
            hasChanged = true;
            hasChangedDetails += `away score changed from ${matchup.awayTeam.score} to ${awayScore} for ${event.shortName}`;
          }
          //#endregion
          if (!hasChanged) {
            leagueResponse.games.push({
              game: event.shortName || "",
              result: `No changes for ${event.shortName}, skipping update`,
            });
            continue;
          } else {
            await ctx.runMutation(internal.matchups.handleMatchupUpdated, {
              matchupId: matchup._id,
              status: eventStatus,
              homeTeam: {
                id: matchup.homeTeam.id,
                name: matchup.homeTeam.name,
                score: homeScore,
                image: matchup.homeTeam.image,
              },
              awayTeam: {
                id: matchup.awayTeam.id,
                name: matchup.awayTeam.name,
                score: awayScore,
                image: matchup.awayTeam.image,
              },
              metadata: {
                ...matchup.metadata,
                statusDetails: statusDetails,
              },
            });
            leagueResponse.matchupsUpdated++;
            leagueResponse.games.push({
              game: event.shortName || "",
              result: `Matchup updated with ${hasChangedDetails}`,
            });
          }
        }
        // #endregion
      }

      leagueResponse.message = "SUCCESS";
      actionResponse[league] = leagueResponse;
    }
    if (process.env.NODE_ENV === "development") {
      console.log(actionResponse);
    }
    return actionResponse;
  },
});

/**
 * Returns the URL for the scoreboard API based on the given league and parameter.
 *
 * @param league - The league for which the scoreboard URL is needed.
 * @param param - The parameter to be included in the scoreboard URL.
 * @returns The URL for the scoreboard API.
 * @throws {Error} If an invalid league is provided.
 */
function getScoreboardUrl(league: League) {
  const hawaiiDate = getHawaiiTime();
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  const limit = 300;

  switch (league) {
    case "MBB":
      return `http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=${hawaiiDate}&limit=${limit}&groups=50`;
    case "WBB":
      return `http://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/scoreboard?dates=${hawaiiDate}&limit=${limit}&groups=50`;
    case "MLB":
      return `http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=${hawaiiDate}&limit=${limit}`;
    case "NFL":
      return `http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${hawaiiDate}&limit=${limit}`;
    case "COLLEGE-FOOTBALL":
      return `http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?dates=${hawaiiDate}&limit=${limit}`;
    case "WNBA":
      return `http://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard?dates=${hawaiiDate}&limit=${limit}`;
    case "NBA":
      return `http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${hawaiiDate}&limit=${limit}`;
    case "NHL":
      return `http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard?dates=${hawaiiDate}&limit=${limit}`;
    case "MLS":
      return `http://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard?dates=${hawaiiDate}&limit=${limit}`;
    case "UFL":
      return `http://site.api.espn.com/apis/site/v2/sports/football/ufl/scoreboard?dates=${hawaiiDate}&limit=${limit}`;
    case "ARG":
      return `http://site.api.espn.com/apis/site/v2/sports/soccer/arg.1/scoreboard?dates=${date}&limit=${limit}`;
    case "CSL":
      return `http://site.api.espn.com/apis/site/v2/sports/soccer/chn.1/scoreboard?dates=${date}&limit=${limit}`;
    case "EPL":
      return `http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=${date}&limit=${limit}`;
    case "NWSL":
      return `http://site.api.espn.com/apis/site/v2/sports/soccer/usa.nwsl/scoreboard?dates=${date}&limit=${limit}`;
    case "FRIENDLY":
      return `http://site.api.espn.com/apis/site/v2/sports/soccer/fifa.friendly/scoreboard?dates=${date}&limit=${limit}`;
    case "TUR":
      return `http://site.api.espn.com/apis/site/v2/sports/soccer/tur.1/scoreboard?dates=${date}&limit=${limit}`;
    case "RPL":
      return `http://site.api.espn.com/apis/site/v2/sports/soccer/rus.1/scoreboard?dates=${date}&limit=${limit}`;
    case "PLL":
      return `http://site.api.espn.com/apis/site/v2/sports/lacrosse/pll/scoreboard?dates=${date}&limit=${limit}`;
    case "NBAG":
      return `http://site.api.espn.com/apis/site/v2/sports/basketball/nba-g-league/scoreboard?dates=${hawaiiDate}&limit=${limit}`;
    default:
      throw new Error("Invalid league");
  }
}
