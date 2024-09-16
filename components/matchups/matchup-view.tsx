import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cloud, MapPin } from "lucide-react";
import { ColoredProgress, Progress } from "../ui/progress";
import Link from "next/link";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { UrlObject } from "url";

const MatchupView = ({ data, league }: { data: any; league: string }) => {
  const homeTeam = data.boxscore.teams[1].team;
  const awayTeam = data.boxscore.teams[0].team;
  const venue = data.gameInfo.venue;
  const weather = data.gameInfo.weather;
  const predictor = data.predictor;
  const playerStats = data.boxscore.players;
  const lastFiveGames = data.lastFiveGames;
  const news = data.news;
  const espnSummaryUrl = data.header.links[0].href;

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {awayTeam.displayName} vs {homeTeam.displayName}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="flex justify-center items-center space-x-8">
            <TeamLogo team={awayTeam} />
            <div className="text-3xl font-bold">VS</div>
            <TeamLogo team={homeTeam} />
          </div>
          <VenueAndWeather venue={venue} weather={weather} />
          {espnSummaryUrl && (
            <div className="text-sm text-muted-foreground">
              <Link href={espnSummaryUrl}>View Full Game</Link>
            </div>
          )}
        </CardContent>
      </Card>

      {predictor && (
        <MatchupPredictor
          predictor={predictor}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      )}

      {playerStats && playerStats.length > 0 && (
        <PlayerStats playerStats={playerStats} league={league} />
      )}

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats">Team Stats</TabsTrigger>
          {lastFiveGames && (
            <TabsTrigger value="lastGames">Last 5 Games</TabsTrigger>
          )}
          {news && <TabsTrigger value="news">News</TabsTrigger>}
        </TabsList>
        <TabsContent value="stats">
          <TeamStats homeTeam={homeTeam} awayTeam={awayTeam} data={data} />
        </TabsContent>
        {lastFiveGames && (
          <TabsContent value="lastGames">
            <LastGames lastFiveGames={lastFiveGames} />
          </TabsContent>
        )}
        {news && (
          <TabsContent value="news">
            <News news={news} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

const MatchupPredictor = ({ predictor, homeTeam, awayTeam }: any) => {
  const isHomeTeamBetter =
    parseFloat(predictor.homeTeam.gameProjection) >
    parseFloat(predictor.awayTeam.gameProjection);
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{predictor.header}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">{awayTeam.abbreviation}</span>
          <span className="font-semibold">{homeTeam.abbreviation}</span>
        </div>
        <Progress
          value={parseFloat(predictor.awayTeam.gameProjection)}
          className={`h-4 mb-2`}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{predictor.awayTeam.gameProjection}%</span>
          <span>{predictor.homeTeam.gameProjection}%</span>
        </div>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>{awayTeam.abbreviation}</TableHead>
              <TableHead>{homeTeam.abbreviation}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Win Chance</TableCell>
              <TableCell>
                {(100 - parseFloat(predictor.awayTeam.teamChanceLoss)).toFixed(
                  1
                )}
                %
              </TableCell>
              <TableCell>
                {(100 - parseFloat(predictor.homeTeam.teamChanceLoss)).toFixed(
                  1
                )}
                %
              </TableCell>
            </TableRow>
            {predictor.awayTeam.teamChanceTie &&
              predictor.homeTeam.teamChanceTie && (
                <TableRow>
                  <TableCell>Tie Chance</TableCell>
                  <TableCell>{predictor.awayTeam.teamChanceTie}%</TableCell>
                  <TableCell>{predictor.homeTeam.teamChanceTie}%</TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const PlayerStats = ({
  playerStats,
  league,
}: {
  playerStats: any[];
  league: string;
}) => {
  const awayTeam = playerStats[0].team;
  const homeTeam = playerStats[1].team;
  const awayTeamStats = playerStats[0].statistics;
  const homeTeamStats = playerStats[1].statistics;

  if (!awayTeamStats || !homeTeamStats) {
    return null;
  }

  return (
    <div>
      <Tabs defaultValue={`team-0`} className="w-full mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={`team-0`}>{awayTeam.displayName}</TabsTrigger>
          <TabsTrigger value={`team-1`}>{homeTeam.displayName}</TabsTrigger>
        </TabsList>
        <TabsContent value={`team-0`}>
          <Card>
            <CardHeader>
              <CardTitle>{awayTeam.displayName} Player Stats</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Player stats content for this team */}
              {awayTeamStats.map(
                (
                  statGroup: {
                    name: string;
                    text: string;
                    labels: string[];
                    values: string[];
                    descriptions: string[];
                    athletes: [
                      {
                        active: boolean;
                        athlete: {
                          id: string;
                          firstName: string;
                          lastName: string;
                          jersey: string;
                          shortName: string;
                          headshot: {
                            href: string;
                          };
                          links: [
                            {
                              href: string;
                              text: string;
                            },
                          ];
                          displayName: string;
                        };
                        stats: string[];
                      },
                    ];
                    totals: string[];
                  },
                  index: React.Key | null | undefined
                ) => (
                  <Card key={index} className="mb-4">
                    <CardHeader>
                      <CardTitle>{statGroup.text}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Player</TableHead>
                            {statGroup.labels.map((label, index) => (
                              <TableHead key={index}>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span>{label}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {statGroup.descriptions[index]}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {statGroup.athletes.map((athlete) => {
                            if (athlete.active === false) {
                              return null;
                            }
                            return (
                              <TableRow key={athlete.athlete.id}>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Avatar className="h-10 w-10 mr-2">
                                      <AvatarImage
                                        src={
                                          athlete.athlete.headshot?.href || ""
                                        }
                                        alt={athlete.athlete.displayName}
                                      />
                                      <AvatarFallback>
                                        {athlete.athlete.shortName}
                                      </AvatarFallback>
                                    </Avatar>
                                    <p>{athlete.athlete.shortName}</p>
                                    <span className="text-xs ml-2 text-muted-foreground">
                                      #{athlete.athlete.jersey}
                                    </span>
                                  </div>
                                </TableCell>
                                {athlete.stats.map((stat, index) => (
                                  <TableCell key={index}>
                                    {" "}
                                    <p className="text-nowrap">{stat}</p>
                                  </TableCell>
                                ))}
                              </TableRow>
                            );
                          })}
                          <TableRow>
                            <TableCell>Totals</TableCell>
                            {statGroup.totals.map((total, index) => (
                              <TableCell key={index}>
                                <p className="font-semibold text-nowrap">
                                  {total}
                                </p>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={`team-1`}>
          <Card>
            <CardHeader>
              <CardTitle>{homeTeam.displayName} Player Stats</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Player stats content for the other team */}
              {homeTeamStats.map(
                (
                  statGroup: {
                    name: string;
                    text: string;
                    labels: string[];
                    values: string[];
                    descriptions: string[];
                    athletes: [
                      {
                        active: boolean;
                        athlete: {
                          id: string;
                          firstName: string;
                          lastName: string;
                          jersey: string;
                          shortName: string;
                          headshot: {
                            href: string;
                          };
                          links: [
                            {
                              href: string;
                              text: string;
                            },
                          ];
                          displayName: string;
                        };
                        stats: string[];
                      },
                    ];
                    totals: string[];
                  },
                  index: React.Key | null | undefined
                ) => (
                  <Card key={index} className="mb-4">
                    <CardHeader>
                      <CardTitle>{statGroup.text}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Player</TableHead>
                            {statGroup.labels.map((label, index) => (
                              <TableHead key={index}>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span>{label}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {statGroup.descriptions[index]}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {statGroup.athletes.map((athlete) => {
                            if (athlete.active === false) {
                              return null;
                            }
                            return (
                              <TableRow key={athlete.athlete.id}>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Avatar className="h-10 w-10 mr-2">
                                      <AvatarImage
                                        src={
                                          athlete.athlete.headshot?.href || ""
                                        }
                                        alt={athlete.athlete.displayName}
                                      />
                                      <AvatarFallback>
                                        {athlete.athlete.shortName}
                                      </AvatarFallback>
                                    </Avatar>
                                    <p>{athlete.athlete.shortName}</p>
                                    <span className="text-xs ml-2 text-muted-foreground">
                                      #{athlete.athlete.jersey}
                                    </span>
                                  </div>
                                </TableCell>
                                {athlete.stats.map((stat, index) => (
                                  <TableCell key={index}>
                                    {" "}
                                    <p className="text-nowrap">{stat}</p>
                                  </TableCell>
                                ))}
                              </TableRow>
                            );
                          })}
                          <TableRow>
                            <TableCell>Totals</TableCell>
                            {statGroup.totals.map((total, index) => (
                              <TableCell key={index}>
                                <p className="font-semibold text-nowrap">
                                  {total}
                                </p>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const VenueAndWeather = ({ venue, weather }: any) => (
  <Card className="w-full">
    <CardContent className="flex justify-between items-center p-4">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center space-x-4">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">{venue.fullName}</p>
            <p className="text-xs text-muted-foreground">
              {venue.address.city}, {venue.address.state}
            </p>
          </div>
        </div>
        {weather && (
          <div className="flex items-center space-x-4">
            <Cloud className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-sm">Weather</h3>
              <p className="text-sm text-muted-foreground">
                {weather.temperature}°F
              </p>
              <p className="text-xs text-muted-foreground">
                Wind: {weather.gust} mph
              </p>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const TeamLogo = ({ team }: any) => (
  <Avatar className="h-24 w-24">
    <AvatarImage src={team.logo} alt={team.displayName} />
    <AvatarFallback>{team.abbreviation}</AvatarFallback>
  </Avatar>
);

const TeamStats = ({ data }: any) => {
  const homeTeam = data.boxscore.teams[1];
  const awayTeam = data.boxscore.teams[0];
  const homeTeamStats = homeTeam.statistics;
  const awayTeamStats = awayTeam.statistics;

  if (!homeTeamStats || !awayTeamStats) {
    return null;
  }

  const embeddedStatsPresent = homeTeamStats.some((stat: any) =>
    Array.isArray(stat.stats)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {embeddedStatsPresent ? (
          <Tabs defaultValue={homeTeamStats[0].name} className="w-full mb-4">
            <TabsList className="grid w-full grid-cols-4">
              {homeTeamStats.map(
                (category: any, index: number) =>
                  category.stats.length > 0 && (
                    <TabsTrigger key={category.name} value={category.name}>
                      {category.displayName}
                    </TabsTrigger>
                  )
              )}
            </TabsList>
            {homeTeamStats.map(
              (category: any, index: number) =>
                category.stats.length > 0 && (
                  <TabsContent key={category.name} value={category.name}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Statistic</TableHead>
                          <TableHead>{homeTeam.team.displayName}</TableHead>
                          <TableHead>{awayTeam.team.displayName}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.stats.map((stat: any, statIndex: number) => (
                          <TableRow key={stat.name}>
                            <TableCell>{stat.displayName}</TableCell>
                            <TableCell>{stat.displayValue}</TableCell>
                            <TableCell>
                              {
                                awayTeamStats[index].stats[statIndex]
                                  .displayValue
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                )
            )}
          </Tabs>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Statistic</TableHead>
                <TableHead>{homeTeam.team.displayName}</TableHead>
                <TableHead>{awayTeam.team.displayName}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {homeTeamStats.map((stat: any, index: number) => (
                <TableRow key={stat.name}>
                  <TableCell>{stat.label}</TableCell>
                  <TableCell>{stat.displayValue}</TableCell>
                  <TableCell>{awayTeamStats[index].displayValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

const LastGames = ({
  lastFiveGames,
}: {
  lastFiveGames: Array<{ events: Array<any> }>;
}) => (
  <Card>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Opponent</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lastFiveGames[0].events.slice(0, 5).map(
            (
              game: {
                gameDate: string | number | Date;
                opponent: {
                  displayName: string;
                };
                gameResult: string;

                score: string;
              },
              index: React.Key | null | undefined
            ) => (
              <TableRow key={index}>
                <TableCell>
                  {new Date(game.gameDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{game.opponent.displayName}</TableCell>
                <TableCell>{game.gameResult}</TableCell>
                <TableCell>{game.score}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const News = ({ news }: { news: { articles: any[] } }) => (
  <Card className="pt-4">
    <CardContent className="space-y-4">
      {news.articles.slice(0, 5).map(
        (
          article: {
            headline:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | Promise<React.AwaitedReactNode>
              | null
              | undefined;
            description:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | Promise<React.AwaitedReactNode>
              | null
              | undefined;
            links: { web: { href: string | undefined } };
          },
          index: React.Key | null | undefined
        ) => (
          <Card key={index} className="mb-4 shadow-md">
            <CardHeader>
              <CardTitle>{article.headline}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{article.description}</p>
              <a
                href={article.links.web.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Read more
              </a>
            </CardContent>
          </Card>
        )
      )}
    </CardContent>
  </Card>
);

export default MatchupView;
