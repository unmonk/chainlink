# Requirements Document

## Introduction

This document outlines the requirements for a parlay-style betting feature in ChainLink where players can select 4 games in a single bet. All selections must be correct to win, with any single loss resulting in the entire parlay losing. The feature offers a 5x multiplier payout with an upfront cost of 40 Links, creating high-risk, high-reward gameplay that enhances the existing sports prediction experience.

## Requirements

### Requirement 1

**User Story:** As a player, I want to create a parlay bet by selecting 4 different games, so that I can potentially win a higher payout by risking more Links on multiple predictions.

#### Acceptance Criteria

1. WHEN a player accesses the parlay betting interface THEN the system SHALL display available games for selection
2. WHEN a player selects games for their parlay THEN the system SHALL allow exactly 4 game selections
3. WHEN a player attempts to select more than 4 games THEN the system SHALL prevent additional selections and display a message indicating the 4-game limit
4. WHEN a player attempts to select the same game twice THEN the system SHALL prevent duplicate selections
5. IF a player has insufficient Links (less than 40) THEN the system SHALL disable the parlay creation and display their current Link balance

### Requirement 2

**User Story:** As a player, I want to pay 40 Links upfront for my parlay bet, so that I understand the cost and can manage my Link budget accordingly.

#### Acceptance Criteria

1. WHEN a player creates a parlay with 4 selected games THEN the system SHALL require exactly 40 Links as payment
2. WHEN a player confirms their parlay bet THEN the system SHALL deduct 40 Links from their account immediately
3. WHEN the payment is processed THEN the system SHALL create a parlay record with "pending" status
4. IF the payment fails due to insufficient funds THEN the system SHALL display an error message and not create the parlay
5. WHEN a parlay is created THEN the system SHALL display a confirmation showing the 40 Link cost and selected games

### Requirement 3

**User Story:** As a player, I want my parlay to win only if all 4 of my selected games are correct, so that I understand the all-or-nothing nature of parlay betting.

#### Acceptance Criteria

1. WHEN all 4 games in a parlay are resolved as wins THEN the system SHALL mark the parlay as "won"
2. WHEN any single game in a parlay is resolved as a loss THEN the system SHALL mark the parlay as "lost"
3. WHEN a parlay is marked as "won" THEN the system SHALL calculate the payout as 40 Links × 5 = 200 Links
4. WHEN a parlay is marked as "lost" THEN the system SHALL record zero payout
5. WHEN games are still pending THEN the system SHALL maintain the parlay status as "pending"

### Requirement 4

**User Story:** As a player, I want to receive 200 Links (5x my 40 Link bet) when my parlay wins, so that I'm rewarded for the increased risk of the all-or-nothing bet structure.

#### Acceptance Criteria

1. WHEN a parlay is resolved as "won" THEN the system SHALL add 200 Links to the player's account
2. WHEN the payout is processed THEN the system SHALL update the player's Link balance immediately
3. WHEN a payout occurs THEN the system SHALL create a transaction record showing the 200 Link credit
4. WHEN a parlay is resolved as "lost" THEN the system SHALL NOT add any Links to the player's account
5. WHEN a payout is processed THEN the system SHALL display a notification to the player about their winnings

### Requirement 5

**User Story:** As a player, I want to view my active and completed parlay bets, so that I can track my betting history and current pending bets.

#### Acceptance Criteria

1. WHEN a player accesses their betting history THEN the system SHALL display all parlay bets (active and completed)
2. WHEN displaying parlay bets THEN the system SHALL show the 4 selected games, bet amount, status, and potential/actual payout
3. WHEN a parlay is pending THEN the system SHALL display real-time updates on game results
4. WHEN displaying completed parlays THEN the system SHALL show the final outcome and payout amount
5. WHEN a player views their active parlays THEN the system SHALL highlight which games are completed and their results

### Requirement 6

**User Story:** As a player, I want to see clear odds and payout information before placing my parlay bet, so that I can make informed betting decisions.

#### Acceptance Criteria

1. WHEN a player is creating a parlay THEN the system SHALL display the 40 Link cost prominently
2. WHEN a player is creating a parlay THEN the system SHALL display the potential 200 Link payout
3. WHEN a player is creating a parlay THEN the system SHALL show the 5x multiplier clearly
4. WHEN a player reviews their parlay before confirmation THEN the system SHALL display all selected games with their individual details
5. WHEN a player confirms their parlay THEN the system SHALL require explicit confirmation of the bet terms