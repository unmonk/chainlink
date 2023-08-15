import { Matchup } from "@/drizzle/schema";

/**
 * Handles a score vs score matchup by updating the matchup status, scores, winner, and picks in the database.
 * @param matchup - The matchup object to handle.
 * @returns The updated Matchup object.
 */
export function handleScorevsScoreMatchup(matchup: Matchup) {
  if (
    matchup.operator &&
    !matchup.home_win_condition_operator &&
    !matchup.away_win_condition_operator &&
    matchup.home_win_condition === matchup.away_win_condition
  ) {
    switch (matchup.operator) {
      case "GREATER_THAN": {
        if (matchup.home_value > matchup.away_value) {
          matchup.winner_id = matchup.home_id;
        } else if (matchup.away_value > matchup.home_value) {
          matchup.winner_id = matchup.away_id;
        } else {
          matchup.winner_id = null;
        }
        break;
      }
      case "LESS_THAN": {
        if (matchup.home_value < matchup.away_value) {
          matchup.winner_id = matchup.home_id;
        } else if (matchup.away_value < matchup.home_value) {
          matchup.winner_id = matchup.away_id;
        } else {
          matchup.winner_id = null;
        }
        break;
      }
      case "GREATER_THAN_OR_EQUAL_TO": {
        if (matchup.home_value >= matchup.away_value) {
          matchup.winner_id = matchup.home_id;
        } else if (matchup.away_value >= matchup.home_value) {
          matchup.winner_id = matchup.away_id;
        } else {
          matchup.winner_id = null;
        }
        break;
      }
      case "LESS_THAN_OR_EQUAL_TO": {
        if (matchup.home_value <= matchup.away_value) {
          matchup.winner_id = matchup.home_id;
        } else if (matchup.away_value <= matchup.home_value) {
          matchup.winner_id = matchup.away_id;
        } else {
          matchup.winner_id = null;
        }
        break;
      }
      default: {
        matchup.winner_id = null;
        break;
      }
    }
  }
  return matchup;
}
