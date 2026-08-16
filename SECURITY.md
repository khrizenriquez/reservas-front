# Security Policy

## Trunk-Based Development & Quality Gates
We follow trunk-based development with rigorous security quality gates in our CI/CD pipeline:
- **Vulnerability Scanning:** Automated checks scan for vulnerabilities in external dependencies.
- **Secrets Detection:** Standard security scanning ensures no credentials or API keys enter the trunk.
- **Code Reviews:** Peer reviews of pull requests act as a gateway to prevent insecure patterns.
- **Feature Flags:** Large security improvements are toggled and rolled out of production safely.

## Hosting Security (Netlify and Free Services)

- **No secrets in source:** API tokens, keys, and credentials must be stored only in hosting environment variables.
- **Environment isolation:** Preview and production environments must use separate variable sets.
- **Header policy:** Enforce baseline security headers (for example: frame, content-type, and referrer protections) via hosting configuration.
- **Least privilege:** Do not expose admin-only UI paths without server-side authorization checks.
- **Artifact review:** Verify build logs and deployment artifacts do not leak sensitive values.

## API and CORS Security Controls

- **CORS allowlist only:** Allow only approved origins per environment.
- **No wildcard with credentials:** If credentials/cookies are enabled, `Access-Control-Allow-Origin` must never be `*`.
- **Credential policy:** `Access-Control-Allow-Credentials` must be enabled only for approved origins.
- **Method/header controls:** Restrict allowed methods/headers to those required by the REST contract.
- **Preflight integrity:** OPTIONS/preflight handling must be validated for protected routes.
- **Origin rejection:** Unknown origins must fail closed.

## Client Security Architecture

- Use native `fetch` + `async/await` for HTTP integration.
- Avoid unnecessary third-party transport/state dependencies unless justified and reviewed.

## Deployment Security Checks

- Secrets scan passes before merge.
- Dependency vulnerability scan passes before release.
- Deployment preview is validated before promoting to production.

## Current Render CORS Evidence

On 2026-08-15, a safe `OPTIONS /api/auth/login/` request from an unapproved test
origin received `Access-Control-Allow-Origin: *` and no
`Access-Control-Allow-Credentials: true`. That response is incompatible with this
client's credentialed `fetch` calls. The frontend cannot correct this server-side
policy. The Render owner must replace the wildcard with explicit Netlify preview
and production origins and enable credentials only for those origins. Validate each
deployed URL with `CORS_ORIGIN=https://<exact-url> npm run cors:check` before
release promotion.

## Reporting a Security Vulnerability
If you discover any security vulnerability, please do NOT create a public discussion or issue. Report it immediately by emailing the security team or raising a confidential advisory to ensure coordinated disclosure.
