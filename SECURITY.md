# Security Policy

## Trunk-Based Development & Quality Gates
We follow trunk-based development with rigorous security quality gates in our CI/CD pipeline:
- **Vulnerability Scanning:** Automated checks scan for vulnerabilities in external dependencies.
- **Secrets Detection:** Standard security scanning ensures no credentials or API keys enter the trunk.
- **Code Reviews:** Peer reviews of pull requests act as a gateway to prevent insecure patterns.
- **Feature Flags:** Large security improvements are toggled and rolled out of production safely.

## Reporting a Security Vulnerability
If you discover any security vulnerability, please do NOT create a public discussion or issue. Report it immediately by emailing the security team or raising a confidential advisory to ensure coordinated disclosure.
