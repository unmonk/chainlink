export type BracketTeam = {
  name: string;
  image: string;
  seed: number;
  region: string;
  order: number;
  homeAway: "HOME" | "AWAY";
  winner?: boolean;
  score?: number;
  espnId?: string;
  id?: string;
};

export type BracketGame = {
  id: string;
  tournamentId: string;
  round: number;
  gamePosition: number;
  region: string;
  teams: BracketTeam[];
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
  scheduledAt: number;
};

export type BracketPrediction = {
  homeTeamScore: number;
  awayTeamScore: number;
  winnerId?: string;
};

export interface BracketProps {
  tournamentId: string;
  games?: BracketGame[];
  predictions?: Record<string, BracketPrediction>;
  onPredictionSubmit?: (gameId: string, prediction: BracketPrediction) => void;
}
