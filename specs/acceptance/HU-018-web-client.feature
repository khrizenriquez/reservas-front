@HU-018 @RF-027 @RN-033
Feature: Use the public landing and accessible web PWA

  @HU-018-S01
  Scenario: Understand the service from the landing
    Given a visitor opens the public site
    Then the three laboratories and reservation process are explained
    And an institutional access action is visible

  @HU-018-S02 @HU-011
  Scenario: Sign in before entering the portal
    Given an active institutional user
    When the user signs in with the web client
    Then the client calls only the published Render login operation
    And the portal opens only after a normalized tab-scoped identity is available
    And no password, token, cookie, registration, recovery, or unpublished auth endpoint is used

  @HU-018-S03 @HU-003
  Scenario: Search availability accessibly
    Given an authenticated portal user provides a valid date and interval
    When availability is requested
    Then only free laboratories are presented with text and visual state

  @HU-018-S04 @HU-001
  Scenario: Create a reservation from an available laboratory
    Given an authenticated user, an available laboratory and valid reason
    When the teacher confirms the summary
    Then the reservation is sent only with documented Render fields
    And no idempotency key is invented because Render does not publish one

  @HU-018-S05 @HU-007 @HU-008
  Scenario: Manage a published future reservation
    Given a published future reservation
    Then an administrator can modify or cancel it
    And a professor can modify or cancel only a reservation with their own user ID
    And destructive cancellation requires confirmation

  @HU-018-S06 @HU-012 @HU-013 @HU-015 @HU-017
  Scenario: Use role-aware published administration
    Given an authenticated portal user
    Then administration and audit navigation is visible
    And an administrator can create users and inactivate another active user
    And a professor can read resources but cannot create, edit, reset, or inactivate them
    And the client reports any backend rejection with a friendly localized message

  @HU-018-S07
  Scenario: Keep offline behavior safe
    Given the installed PWA loses connectivity
    Then cached read-only content is marked as stale
    And reservation mutations are disabled and never queued

  @HU-018-S08
  Scenario: Complete core journeys with assistive technology
    Given a keyboard or screen-reader user
    Then landing login availability and reservation controls have logical focus
    And errors and state changes are announced without relying only on color
