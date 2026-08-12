# Reservas Front

Landing, web application, and installable PWA for the UMG laboratory reservation
platform. The client uses Next.js App Router, JavaScript, and Bulma; TypeScript is
intentionally not part of this repository.

## Product surfaces

- Public landing and laboratory overview.
- Secure teacher workflows for availability, reservations, notifications, and
  sessions.
- Administrative views for global reservations, laboratories, users, audit, and
  reports.
- Installable PWA shell with read-only offline behavior.

The API URL is public configuration and is read from `NEXT_PUBLIC_API_BASE_URL`.
Credentials, access tokens, cookies, push endpoints, and environment secrets must
never be committed. Access tokens remain in memory; the API owns the HttpOnly refresh
cookie and CSRF controls.

## Development

```bash
npm install
npm run dev
```

The API and Kong normally run at <http://localhost:8000>. This web client runs at
<http://localhost:3000>.

## Quality gates

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

The product and acceptance specifications live under `specs/`. Shared web/mobile
visual tokens live under `packages/design-tokens/`.

