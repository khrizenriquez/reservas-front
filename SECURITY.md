# Security Policy

## Trunk-Based Development & Quality Gates
We follow trunk-based development with rigorous security quality gates in our CI/CD pipeline:
- **Vulnerability Scanning:** Automated checks scan for vulnerabilities in external dependencies.
- **Secrets Detection:** Standard security scanning ensures no credentials or API keys enter the trunk.
- **Code Reviews:** Peer reviews of pull requests act as a gateway to prevent insecure patterns.
- **Feature Flags:** Large security improvements are toggled and rolled out of production safely.

## Hosting Security (Vercel and Free Services)

- **No secrets in source:** API tokens, keys, and credentials must be stored only in hosting environment variables.
- **Environment isolation:** Preview and production environments must use separate variable sets.
- **Header policy:** Enforce baseline security headers (for example: frame, content-type, and referrer protections) through `next.config.mjs` on Vercel.
- **Least privilege:** Do not expose admin-only UI paths without server-side authorization checks.
- **Artifact review:** Verify build logs and deployment artifacts do not leak sensitive values.

## API and CORS Security Controls

- **Published Render mode:** Render v1 permits anonymous requests, so the client
  explicitly uses `credentials: "omit"` and does not send cookies or tokens.
- **Wildcard safety:** `Access-Control-Allow-Origin: *` is acceptable only while
  browser credentials are omitted. A future credentialed contract must use exact
  origins and `Access-Control-Allow-Credentials: true`.
- **Method/header controls:** Restrict client methods/headers to those published by
  the REST contract.
- **Preflight integrity:** OPTIONS/preflight handling is validated for JSON POST.

## Client Security Architecture

- Use native `fetch` + `async/await` for HTTP integration.
- Avoid unnecessary third-party transport/state dependencies unless justified and reviewed.

## Deployment Security Checks

- Secrets scan passes before merge.
- Dependency vulnerability scan passes before release.
- Deployment preview is validated before promoting to production.

## Current Render CORS Evidence

On 2026-08-15, a safe `OPTIONS /api/auth/login/` request returned
`Access-Control-Allow-Origin: *`, allowed `POST`, and allowed `Content-Type`.
Because the published contract permits anonymous access and the client omits
credentials, that response supports local, preview and production requests.
Validate each application URL with `CORS_ORIGIN=<exact-url> npm run cors:check`
before release promotion.

## Reporting a Security Vulnerability
If you discover any security vulnerability, please do NOT create a public discussion or issue. Report it immediately by emailing the security team or raising a confidential advisory to ensure coordinated disclosure.
