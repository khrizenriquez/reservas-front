# i18n and Error Handling Specification

## Scope

Define localization and visual error handling requirements for all user-facing routes.

## Language requirements

1. Default language is Spanish.
2. English must be selectable by users.
3. Language selection must persist during the active session.
4. Public and authenticated portal surfaces must use the selected language consistently.

## Error handling requirements

1. API 4xx and 5xx responses must map to friendly user messages.
2. Errors must be shown at relevant visual layers:
   - field-level for validation
   - section-level for workflow errors
   - global alerts for blocking failures
3. Error states must provide actionable next steps when possible (retry, back, support hint).
4. Technical/internal messages must not be exposed directly to end users.

## UX consistency requirements

1. Error tone must be clear, brief, and non-technical.
2. Error colors must include textual/icon reinforcement.
3. Loading, empty, success, and error states must be defined per critical screen.

## Acceptance mapping

- `HU-018-S02`: required session/login errors and security feedback
- `HU-018-S03`: availability validation and API errors
- `HU-018-S04`: reservation create errors with idempotency context
- `HU-018-S05`: update/cancel errors and confirmations
- `HU-018-S08`: accessible announcement of status and errors

## Verification

- Localization keys exist for ES and EN.
- Error dictionary maps contract/system failures to friendly messages.
- Accessibility checks validate announcement behavior and focus handling.
