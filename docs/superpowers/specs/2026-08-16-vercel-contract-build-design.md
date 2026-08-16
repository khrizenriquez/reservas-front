# Deterministic Vercel Contract Gate Design

## Context

The first Vercel Production build ran the configured release command and failed
inside `npm run contract`. The command made a live request to the Render schema
and its 30-second timeout elapsed. The checked-in Render v1 schema and manifest
were present, and a local request to that same schema subsequently returned HTTP
200 in about 0.6 seconds. The deployment therefore failed because a build gate
depended on transient external network availability, not because the Vercel
environment variables or frontend API integration were invalid.

## Decision

Separate deterministic contract verification from live Render reachability:

- `npm run contract` remains the mandatory merge and Vercel build gate. It will
  validate the manifest, the committed Render v1 snapshot hash, and the required
  published operations against that checked-in snapshot only.
- `npm run contract:live` will make the existing read-only request to Render and
  compare the returned schema against the same Render v1 manifest. It is a
  pre-merge/release validation, but is deliberately excluded from the Vercel
  build command.
- `npm run cors:check` remains required against the exact local, Preview, and
  Production origins. It continues to prove the only supported live integration:
  direct anonymous Render v1 requests with `credentials: "omit"`.

## Boundaries

- Render v1 remains the only API source. No proxy, fallback API, local server,
  token, cookie, or substitute endpoint is introduced.
- The committed snapshot remains immutable under its recorded SHA-256. A schema
  change requires an intentional snapshot/manifest update and review.
- A live-schema timeout is reported by `contract:live`; it must not make a
  frontend deployment unavailable when the checked-in contract is valid.

## Implementation and Tests

The verifier will expose separate snapshot and live-schema paths while sharing
the current manifest validation. Package scripts will make the distinction
explicit. Jest tests will cover that the deterministic gate validates the local
snapshot without calling `fetch`, while the live gate still validates a supplied
published schema and reports failures. Release documentation, traceability, and
the evidence checklist will record both gates and the Vercel build will retain
the deterministic one.

## Acceptance Criteria

1. `npm run contract` completes without outbound network access and rejects an
   invalid manifest, hash, or required operation in the snapshot.
2. `npm run contract:live` validates the current published Render schema and
   fails clearly on non-200, malformed, drifted, or timed-out responses.
3. The Vercel build command continues to run `npm run contract`, static checks,
   Jest coverage, release configuration verification, and `next build`.
4. Local and Vercel Preview/Production CORS checks continue to use only the
   Render v1 origin and anonymous credential policy.
