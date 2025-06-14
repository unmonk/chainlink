export type Event = {
  id: string;
  uid?: string;
  date?: string;
  name?: string;
  shortName?: string;
  season?: Season;
  competitions: Competition[];
  links?: EventLink[];
};

export type ScheduleResponse = {
  type: string;
  content: ScheduleContent;
};

export type ScheduleContent = {
  schedule: Schedule;
  league: string;
  activeDate: string;
  sport: string;
};

export type Schedule = {
  [day: string]: ScheduleDay;
};

export type ScoreboardScheduleResponse = {
  leagues: ELeague[];
  events: Event[];
  eventsDate: {
    date: string;
    seasonType: number;
  };
  groups: number[];
};

export type ScheduleDay = {
  leagueName: string;
  calendartype: string;
  label: string;
  seasonObj: SeasonObj;
  games: Game[];
};

export type SeasonObj = {
  year: number;
  type: number;
  slug: string;
};

export type Game = {
  date: string;
  uid: string;
  name: string;
  competitions: Competition[];
  id: string;
  shortName: string;
  status: EventStatus;
  season: SeasonObj;
};

export type Competition = {
  id?: string;
  uid?: string;
  date?: string;
  attendance?: number;
  timeValid?: boolean;
  neutralSite?: boolean;
  conferenceCompetition?: boolean;
  playByPlayAvailable?: boolean;
  recent?: boolean;
  neutralSite?: boolean;
  conferenceCompetition?: boolean;
  boxscoreAvailable?: boolean;
  recent?: boolean;
  onWatchEspn?: boolean;
  odds?: {
    overUnder?: number;
    spread?: number;
    pointSpread?: {
      away?: {
        close?: {
          line?: string;
        };
      };
      home?: {
        close?: {
          line?: string;
        };
      };
    };
  }[];
  wasSuspended?: boolean;
  competitors: Competitor[];
  venue?: Venue;
  status?: EventStatus;
  notes?: any[];
  broadcasts?: EventBroadcast[];
  leaders?: any[];
  format: {
    regulation?: {
      peroids?: number;
    };
  };
  startDate?: string;
  geoBroadcasts?: GeoBroadcast[];
  headlines?: EventHeadline[];
  series?: any[];
};

export type Competitor = {
  id: string;
  uid?: string;
  type?: string;
  order?: number;
  homeAway?: string;
  winner?: boolean;
  score: string;
  hits?: number;
  errors?: number;
  linescores?: LineScore[];
  statistics?: Statistic[];
  records?: Record[];
  team: CompetitorTeam;
  probables?: any[];
  leaders?: any[];
};

export type LineScore = {
  value?: number;
};

export type Statistic = {
  name?: string;
  displayValue?: string;
  appreviation?: string;
  value?: number;
  description?: string;
  displayName?: string;
  shortDisplayName?: string;
  stats?: Statistic[];
};

export type Record = {
  name?: string;
  type?: string;
  abbreviation?: string;
  summary?: string;
};

export type CompetitorTeam = {
  id?: string;
  uid?: string;
  location?: string;
  name?: string;
  abbreviation?: string;
  displayName?: string;
  shortDisplayName?: string;
  color?: string;
  alternateColor?: string;
  isActive?: boolean;
  logo?: string;
  links: Link[];
};

export type Venue = {
  id?: string;
  fullName?: string;
  address?: {
    city?: string;
    state?: string;
  };
  capacity?: number;
  indoor?: boolean;
};

export type EventHeadline = {
  description?: string;
  shortLinkText?: string;
  type?: string;
  video?: any[];
};

export type EventBroadcast = {
  market?: string;
  names?: string[];
};
export type GeoBroadcast = {
  type?: {
    id?: string;
    shortName?: string;
  };
  market?: {
    id?: string;
    type?: string;
  };
  media?: {
    shortName?: string;
  };
  lang?: string;
  region?: string;
};

export type Link = {
  language?: string;
  text?: string;
  shortText?: string;
  href?: string;
  isExternal?: boolean;
  isPremium?: boolean;
  rel?: string[];
};

export type Season = {
  year?: number;
  type?: number;
  slug?: string;
};

export type EventStatus = {
  clock?: number;
  displayClock?: string;
  period?: number;
  type?: {
    id?: string;
    name?: string;
    state?: string;
    completed?: boolean;
    description?: string;
    detail?: string;
    shortDetail?: string;
  };
  featuredAthletes?: any[];
};

type ELeague = {
  id?: string;
  uid?: string;
  name?: string;
  abbreviation?: string;
  midsizeName?: string;
  slug?: string;
  isTournament?: boolean;
  season?: Season;
  calendarType?: string;
  calendarIsWhitelist?: boolean;
  calendarStartDate?: string;
  calendarEndDate?: string;
};

export type ScoreboardResponse = {
  events: Event[];
  leagues?: ELeague[];
};

export type SummaryTeam = {
  team?: CompetitorTeam;
  statistics: Statistic[];
  details: Statistic[];
};

export type SummaryResponse = {
  notes?: string[];
  boxscore?: BoxScore;
  ganeInfo?: {
    venue?: Venue;
    attendance?: number;
    gameDuration?: string;
  };
  predictor?: {
    header?: string;
    homeTeam?: Predictor;
    awayTeam?: Predictor;
  };
  pickcenter?: PickCenter;
  header?: {
    id?: string;
    uid?: string;
    timeValid?: boolean;
    competitions?: Competition[];
    links?: Link[];
    league?: ELeague;
  };
  news?: {
    header?: string;
    link?: Link;
    articles?: any[];
  };
  article?: any;
  videos?: any[];
  plays?: any[];
  playsMap?: any[];
  atBats?: any[];
  standings?: any[];
  seasonSeries?: any[];
  rosters?: any[];
};

export type PickCenter = {
  provider?: {
    id?: string;
    name?: string;
    priority?: number;
  };
  details?: string;
  overUnder?: number;
  spread?: number;
  awayTeamOdds?: TeamOdds;
  homeTeamOdds?: TeamOdds;
};

type TeamOdds = {
  favorite?: boolean;
  underdog?: boolean;
  moneyLine?: number;
  teamId?: string;
};

export type BoxScore = {
  teams: SummaryTeam[];
  players: SummaryPlayer[];
};

export type SummaryPlayer = {
  team?: CompetitorTeam;
  statistics?: PlayerStatistics;
};

export type PlayerStatistics = {
  type?: string;
  names?: string[];
  keys?: string[];
  labels?: string[];
  descriptions?: string[];
  totals?: string[];
  athletes?: any[];
};

export type Athlete = {
  active?: boolean;
  starter?: boolean;
  athlete?: any;
  batOrder?: number;
  position?: AthletePosition;
  positions?: AthletePosition[];
  atBats?: AtBats[];
  stats?: string[];
};

export type AthletePosition = {
  id?: string;
  name?: string;
  abbreviation?: string;
  displayName?: string;
};

export type AtBats = {
  id?: string;
  atBatId?: string;
  playId?: string;
};

export type Predictor = {
  id?: string;
  gameProjection?: string;
  teamChangeLoss?: string;
};
