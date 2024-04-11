import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { ScoreboardResponse } from "./espn";
import { League } from "./types";
import { ACTIVE_LEAGUES, getHawaiiTime } from "./utils";

export const scoreboards = internalAction({
  args: {},
  handler: async (ctx) => {
    let actionResponse: Record<
      string,
      {
        matchupsStarted: number;
        matchupsFinished: number;
        matchupsUpdated: number;
        message: string;
      }
    > = {};
    for (const league of ACTIVE_LEAGUES) {
      let leagueResponse = {
        matchupsStarted: 0,
        matchupsFinished: 0,
        matchupsUpdated: 0,
        message: "",
      };
      //Get scoreboard data
      const url = getScoreboardUrl(league);
      const response = await fetch(url);
      const data = (await response.json()) as ScoreboardResponse;

      //skip if no events for league
      if (!data.events || data.events.length === 0) {
        console.log(`${league}: no events fetched`);
        leagueResponse = {
          ...leagueResponse,
          message: "NO EVENTS FOUND",
        };
        actionResponse[league] = leagueResponse;
        continue;
      }

      //get list of gameIds
      const gameIds = data.events.map((event) => event.id);

      //get matchups from db
      const matchups = await ctx.runQuery(
        internal.matchups.getMatchupsByLeagueAndGameIds,
        {
          league,
          gameIds,
        }
      );

      console.log(
        `${league}: total fetched matchups (from db): ${matchups.length} :: total fetched events (from espn): ${data.events.length}`
      );

      //#region compare each matchup with matching event for changes to score and status
      for (const event of data.events) {
        const matchup = matchups.find((matchup) => matchup.gameId === event.id);
        //skip if no matchup found
        if (!matchup) {
          continue;
        }

        console.log(
          `${league}: processing matchup ${event.shortName} :: ${event.competitions[0].status?.type?.name} :: ${matchup.status}`
        );

        const eventStatus = event.competitions[0].status?.type?.name;
        const statusDetails = event.competitions[0].status?.type?.detail;
        const homeTeam = event.competitions[0].competitors.find(
          (competitor) => competitor.homeAway === "home"
        );
        const awayTeam = event.competitions[0].competitors.find(
          (competitor) => competitor.homeAway === "away"
        );
        if (!homeTeam || !awayTeam) {
          console.log(
            `${league}: no home or away team found for ${event.shortName}`
          );
          continue;
        }
        const homeScore = parseInt(homeTeam.score);
        const awayScore = parseInt(awayTeam.score);

        //#endregion

        //#region HANDLE MATCHUP STATUS AND SCORE CHANGES

        ///////////////////MATCHUP STARTED////////////////////////
        if (
          matchup.status === "STATUS_SCHEDULED" &&
          (eventStatus === "STATUS_IN_PROGRESS" ||
            eventStatus === "STATUS_FIRST_HALF")
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
          console.log(`${league}: matchup started for ${event.shortName}`);
        }

        ///////////////////MATCHUP ENDED////////////////////////
        if (
          (matchup.status === "STATUS_IN_PROGRESS" ||
            matchup.status === "STATUS_END_PERIOD") &&
          (eventStatus === "STATUS_FINAL" || eventStatus === "STATUS_FULL_TIME")
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
          console.log(`${league}: matchup finished for ${event.shortName}`);
        }

        /////////////MATCHUP UPDATE ONLY////////////////////////
        if (
          eventStatus &&
          eventStatus !== "STATUS_FINAL" &&
          eventStatus !== "STATUS_FULL_TIME" &&
          eventStatus !== "STATUS_SCHEDULED"
        ) {
          //#region CHECK FOR CHANGES IN MATCHUP and LOGGING
          let hasChanged = false;
          let hasChangedDetails = "";
          if (matchup.status !== eventStatus) {
            hasChanged = true;
            hasChangedDetails += `status changed from ${matchup.status} to ${eventStatus} for ${event.shortName}`;
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
            console.log(`${league}: matchup updated for ${event.shortName}`);
            console.log(hasChangedDetails);
          }
        }
        // #endregion
      }

      leagueResponse.message = `SUCCESS`;
      actionResponse[league] = leagueResponse;
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
  const date = getHawaiiTime();

  const limit = 300;
  switch (league) {
    case "MLB":
      return `http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=${date}&limit=${limit}`;
    case "NFL":
      return `http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${date}&limit=${limit}`;
    case "COLLEGE-FOOTBALL":
      return `http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?dates=${date}&limit=${limit}`;
    case "WNBA":
      return `http://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard?dates=${date}&limit=${limit}`;
    case "NBA":
      return `http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${date}&limit=${limit}`;
    case "NHL":
      return `http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard?dates=${date}&limit=${limit}`;
    case "MLS":
      return `http://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard?dates=${date}&limit=${limit}`;
    case "MBB":
      return `http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=${date}&limit=${limit}`;
    case "WBB":
      return `http://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/scoreboard?dates=${date}&limit=${limit}`;
    case "UFL":
      return `http://site.api.espn.com/apis/site/v2/sports/football/ufl/scoreboard?dates=${date}&limit=${limit}`;
    default:
      throw new Error("Invalid league");
  }
}
