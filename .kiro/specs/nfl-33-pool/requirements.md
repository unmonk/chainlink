# Requirements Document

## Introduction

The NFL 33 Pool feature allows administrators to create and manage NFL 33-point pool campaigns where users are assigned NFL teams and win when their team scores exactly 33 points (or closest to 33, depending on pool settings). This format provides a casual, low-maintenance way for users to participate in NFL season excitement without requiring weekly pick research or tight deadlines.

## Requirements

### Requirement 1

**User Story:** As an administrator, I want to create NFL 33 Pool campaigns with different scoring rules and team assignment methods, so that I can offer flexible pool formats for different user preferences.

#### Acceptance Criteria

1. WHEN an admin creates a 33 pool campaign THEN the system SHALL allow selection of scoring method (exact 33 points or closest to target)
2. WHEN creating a campaign THEN the system SHALL allow setting a custom target score (default 33 points)
3. WHEN configuring team assignment THEN the system SHALL offer options for random weekly assignment or season-long assignment
4. WHEN setting up weekly assignment THEN the system SHALL ensure each member gets exactly one bye week
5. IF a campaign is created THEN the system SHALL store campaign metadata including name, rules, target score, and assignment method

### Requirement 2

**User Story:** As a user, I want to join NFL 33 Pool campaigns and be automatically assigned an NFL team, so that I can participate without having to make weekly picks.

#### Acceptance Criteria

1. WHEN a user joins a 33 pool campaign THEN the system SHALL automatically assign them an available NFL team
2. WHEN team assignment is weekly THEN the system SHALL assign a different team each week ensuring no duplicates within the week
3. WHEN team assignment is seasonal THEN the system SHALL assign one team for the entire season
4. WHEN displaying team assignment THEN the system SHALL show the user their current team and upcoming assignments
5. IF maximum participants (32) is reached THEN the system SHALL prevent additional users from joining

### Requirement 3

**User Story:** As a user, I want to automatically win when my assigned team scores the target points, so that I can enjoy the excitement without active participation requirements.

#### Acceptance Criteria

1. WHEN a user's assigned team scores exactly the target points THEN the system SHALL declare them a winner for that week
2. WHEN using "closest to target" rules AND no team hits exact target THEN the system SHALL award the win to the user whose team was closest
3. WHEN multiple teams tie for closest score THEN the system SHALL split the winnings among tied users
4. WHEN a user wins THEN the system SHALL update their Links/coins balance with the appropriate award
5. IF no team scores the target in "exact score" mode THEN the system SHALL roll over the prize to the following week

### Requirement 4

**User Story:** As a system administrator, I want the pool to automatically process NFL game results and determine winners, so that the system operates without manual intervention.

#### Acceptance Criteria

1. WHEN NFL games complete THEN the system SHALL automatically retrieve final scores via cron job
2. WHEN processing scores THEN the system SHALL identify which teams scored the target points or came closest
3. WHEN winners are determined THEN the system SHALL calculate and distribute appropriate awards
4. WHEN using rollover rules THEN the system SHALL accumulate unclaimed prizes for future weeks
5. IF score processing fails THEN the system SHALL log errors and attempt retry mechanisms

### Requirement 5

**User Story:** As a user, I want to view current standings and my win history, so that I can track my performance and see how I compare to other participants.

#### Acceptance Criteria

1. WHEN a user accesses pool standings THEN the system SHALL display all participants with their win counts and total earnings
2. WHEN displaying weekly results THEN the system SHALL show which teams scored what points and who won
3. WHEN showing user history THEN the system SHALL display their assigned teams, scores, and win/loss results for each week
4. WHEN calculating seasonal standings THEN the system SHALL show total wins and cumulative earnings
5. IF using seasonal differential scoring THEN the system SHALL display running average of how close each user's teams came to target

### Requirement 6

**User Story:** As an administrator, I want to configure different winner declaration methods, so that I can customize the pool experience for different user preferences.

#### Acceptance Criteria

1. WHEN setting up traditional rules THEN the system SHALL only declare winners when teams score exactly the target points
2. WHEN using guaranteed weekly winner rules THEN the system SHALL always award the closest team each week
3. WHEN implementing seasonal winner tracking THEN the system SHALL calculate running differential totals for each participant
4. WHEN configuring rollover rules THEN the system SHALL accumulate prizes across weeks with no exact winners
5. IF multiple winner methods are enabled THEN the system SHALL clearly display which method applies to each award

### Requirement 7

**User Story:** As a user, I want to receive notifications when my team plays and when I win, so that I stay engaged with the pool without having to constantly check.

#### Acceptance Criteria

1. WHEN a user's assigned team has an upcoming game THEN the system SHALL send a notification before game time
2. WHEN a user's team scores the target points THEN the system SHALL immediately notify them of their win
3. WHEN weekly results are finalized THEN the system SHALL send a summary notification to all participants
4. WHEN a user wins multiple consecutive weeks due to rollover THEN the system SHALL notify them of the accumulated prize
5. IF notification delivery fails THEN the system SHALL retry and log delivery status

### Requirement 8

**User Story:** As an administrator, I want to monitor pool participation and manage settings throughout the season, so that I can ensure smooth operation and user engagement.

#### Acceptance Criteria

1. WHEN an admin accesses pool management THEN the system SHALL display participant counts, weekly winners, and prize distributions
2. WHEN viewing pool analytics THEN the system SHALL show engagement metrics, score distributions, and winner frequency
3. WHEN modifying pool settings mid-season THEN the system SHALL validate changes and apply them to future weeks only
4. WHEN managing team assignments THEN the system SHALL allow admin override for special circumstances
5. IF issues arise with scoring or assignments THEN the system SHALL provide admin tools for corrections and manual adjustments