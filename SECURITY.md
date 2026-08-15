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

## Deployment Security Checks

- Secrets scan passes before merge.
- Dependency vulnerability scan passes before release.
- Deployment preview is validated before promoting to production.

## Reporting a Security Vulnerability
If you discover any security vulnerability, please do NOT create a public discussion or issue. Report it immediately by emailing the security team or raising a confidential advisory to ensure coordinated disclosure.
