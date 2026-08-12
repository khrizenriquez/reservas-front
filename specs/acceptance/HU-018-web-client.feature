@HU-018 @RF-027 @RN-033
Feature: Use the public landing and accessible web PWA

  @HU-018-S01
  Scenario: Understand the service from the landing
    Given a visitor opens the public site
    Then the three laboratories and reservation process are explained
    And an institutional access action is visible

  @HU-018-S02 @HU-011
  Scenario: Start a secure web session
    Given an active institutional user
    When the user signs in with the web client
    Then the refresh credential remains in an HttpOnly API cookie
    And the access token is kept only in memory

  @HU-018-S03 @HU-003
  Scenario: Search availability accessibly
    Given an authenticated user provides a valid date and interval
    When availability is requested
    Then only free laboratories are presented with text and visual state

  @HU-018-S04 @HU-001
  Scenario: Create a reservation from an available laboratory
    Given an available laboratory and valid reason
    When the teacher confirms the summary
    Then the reservation is created once with an idempotency key

  @HU-018-S05 @HU-007 @HU-008
  Scenario: Manage an owned future reservation
    Given an active future reservation owned by the teacher
    Then modification and cancellation actions are available
    And destructive cancellation requires confirmation

  @HU-018-S06 @HU-012 @HU-013 @HU-015 @HU-017
  Scenario: Use role-aware administration
    Given an administrator is authenticated
    Then reports administration and audit navigation is visible
    And a teacher cannot reveal those surfaces through navigation

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

