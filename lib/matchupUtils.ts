import { setPicksInProgress } from "./actions/picks";
import { League, Matchup, MatchupStatus, NewMatchup } from "@/drizzle/schema";

export async function handleStatusInProgress(matchup: Matchup) {
  if (matchup.status !== "STATUS_IN_PROGRESS") return matchup;
  await setPicksInProgress(matchup.id);
}

export function handleStatusFinal(matchup: Matchup) {
  return handleScorevsScoreMatchup(matchup);
}

export function handleScorevsScoreMatchup(matchup: Matchup): Matchup {
  if (
    matchup.operator &&
    matchup.home_win_condition === "score" &&
    matchup.home_win_condition === matchup.away_win_condition
  ) {
    console.log("Score vs Score Matchup", matchup.id);
    console.log("HOME:", matchup.home_id, matchup.home_value);
    console.log("AWAY:", matchup.away_id, matchup.away_value);

    switch (matchup.operator) {
      case "GREATER_THAN": {
        console.log("GREATER_THAN");
        if (matchup.home_value > matchup.away_value) {
          console.log(
            "HOME WINS",
            matchup.home_value,
            matchup.away_value,
            matchup.home_value > matchup.away_value,
          );
          matchup.winner_id = matchup.home_id;
        }
        if (matchup.away_value > matchup.home_value) {
          console.log(
            "AWAY WINS",
            matchup.away_value,
            matchup.home_value,
            matchup.away_value > matchup.home_value,
          );
          matchup.winner_id = matchup.away_id;
        }
        break;
      }
      case "LESS_THAN": {
        console.log("LESS_THAN");
        if (matchup.home_value < matchup.away_value) {
          matchup.winner_id = matchup.home_id;
        }
        if (matchup.away_value < matchup.home_value) {
          matchup.winner_id = matchup.away_id;
        }
        break;
      }
      case "GREATER_THAN_OR_EQUAL_TO": {
        console.log("GREATER_THAN_OR_EQUAL_TO");
        if (matchup.home_value >= matchup.away_value) {
          matchup.winner_id = matchup.home_id;
        }
        if (matchup.away_value >= matchup.home_value) {
          matchup.winner_id = matchup.away_id;
        }
        break;
      }
      case "LESS_THAN_OR_EQUAL_TO": {
        console.log("LESS_THAN_OR_EQUAL_TO");
        if (matchup.home_value <= matchup.away_value) {
          matchup.winner_id = matchup.home_id;
        }
        if (matchup.away_value <= matchup.home_value) {
          matchup.winner_id = matchup.away_id;
        }
        break;
      }
    }
  }
  console.log(
    "Winner Determined: ",
    matchup.winner_id,
    "Home: ",
    matchup.home_id,
    "Away: ",
    matchup.away_id,
  );
  return matchup;
}

//TODO type schedule and competitor
export function getScheduleVariables(schedule: any, league: League) {
  const output = [];
  for (const day in schedule) {
    if (!schedule[day].games) continue;
    for (const game of schedule[day].games) {
      const matchup: Partial<NewMatchup> = {};
      const competition = game.competitions[0];
      //Skip if no competition data or if game is not scheduled
      if (!competition) continue;
      matchup.status =
        (competition.status.type.name as MatchupStatus) ?? "STATUS_SCHEDULED";
      if (matchup.status !== "STATUS_SCHEDULED") continue;

      matchup.start_time = new Date(competition.startDate);
      matchup.game_id = game.id as string;
      matchup.league = league;
      matchup.network = competition.geoBroadcasts[0]?.media?.shortName ?? "N/A";
      competition.competitors.forEach((competitor: any) => {
        if (competitor.homeAway === "home") {
          matchup.home_team = competitor.team.displayName;
          matchup.home_id = competitor.id;
          matchup.home_image = competitor.team.logo;
          matchup.home_value = 0;
        } else if (competitor.homeAway === "away") {
          matchup.away_team = competitor.team.displayName;
          matchup.away_id = competitor.id;
          matchup.away_image = competitor.team.logo;
          matchup.away_value = 0;
        }
      });
      output.push(matchup);
    }
  }
  return output;
}

export function makeWhoWillWinQuestions(
  matchups: Partial<NewMatchup>[],
): Partial<NewMatchup>[] {
  return matchups.map((matchup) => {
    matchup.question = `Who will win this matchup? ${matchup.away_team} @ ${matchup.home_team}?`;
    matchup.home_win_condition = "score";
    matchup.away_win_condition = "score";
    matchup.operator = "GREATER_THAN";
    return matchup;
  });
}
