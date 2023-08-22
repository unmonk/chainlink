# ChainLink

An open source clone of a popular streak game. Currently in development.
The objective of the game is to either link together the longest win Chain in a month by selecting consecutive winners OR Win the most matchups in a month, regardless of the length of your Chain.

## Features

- Daily generated matchups from the NBA, WNBA, NHL, MLB, NFL, College Football, and College Basketball.
- Matchup picks are locked after the game starts.
- Score updates are provided every 2 minutes.
- Leaderboard to see how you stack up against the competition.
- Streaks are tracked and displayed on the leaderboard, and your profile.

[![Preview](/public/images/screenshot.png "Preview")](https://chainlink.st)

## Tech Stack

- Built using **Next.js**
- Authentication using **Clerk**
- ORM using **Drizzle**
- Database on **Planetscale**
- Caching using **Upstash Redis**
- UI Components built using **Radix UI** and **Shadcn/ui**
- Styled using **Tailwind CSS**
- Written in **TypeScript** ... mostly
- Deployed to **Vercel**
- Github Actions
- CRON Jobs
- Webhooks

### Roadmap

- [ ] Groups
- [ ] Group Leaderboards
- [ ] Notifications
- [ ] Pick Temperature Gauge
- [ ] Pick Confidence
- [ ] Admin Panel: Control Crons
- [ ] Admin Panel: CRUD Matchups
- [ ] Admin Panel: View Active Picks
- [ ] Groups: Create Custom Streak Campaign
