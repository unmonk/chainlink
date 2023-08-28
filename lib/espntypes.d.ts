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
  wasSuspended?: boolean;
  competitors: EventCompetitor[];
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
};

export type EventCompetitor = {
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
  links: EventLink[];
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

export type EventLink = {
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

export type EventLeague = {
  id?: string;
  uid?: string;
  name?: string;
  abbreviation?: string;
  midsizeName?: string;
  slug?: string;
  season?: Season;
  calendarType?: string;
  calendarIsWhitelist?: boolean;
  calendarStartDate?: string;
  calendarEndDate?: string;
};

export type ScoreboardResponse = {
  events: Event[];
  leagues?: EventLeague[];
};
