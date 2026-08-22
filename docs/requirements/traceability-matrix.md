# Release Traceability Matrix

| Scenario | Contract / constraint | Implementation | Automated evidence | Release status |
|---|---|---|---|---|
| HU-018-S01 | CST-006, CST-012 | `src/app/page.js` | `src/app/page.test.js` | Code evidence ready; needs Vercel preview review. |
| HU-018-S02 | `POST /api/auth/login/`; CST-001, CST-003, CST-004, CST-010 | `src/app/acceso/page.js`, `src/components/AuthProvider.js`, `src/app/portal/layout.js` | `acceso/page.test.js`, `AuthProvider.test.js`, `portal/portal.test.js` | UI login is required and retains identity-only tab state; no password/token is persisted. Backend authorization remains a TODO. |
| HU-018-S03 | `GET /api/labs/disponibles/`; CST-001, CST-002, CST-011 | `src/app/portal/disponibilidad/page.js` | `src/app/portal/disponibilidad/page.test.js` | Code evidence ready; needs deployed API validation. |
| HU-018-S04 | `POST /api/reservas/`; CST-001, CST-002, CST-011 | `src/app/portal/reservas/page.js` | `src/app/portal/reservas/page.test.js` | Partial: Render does not publish idempotency-key support. |
| HU-018-S05 | `GET/PATCH /api/reservas/`; CST-001, CST-010, CST-011 | `src/app/portal/reservas/page.js` | `src/app/portal/reservas/page.test.js` | Administrators manage all future items; professor UI is limited to own future items. Backend ownership enforcement remains a security TODO. |
| HU-018-S06 | Render labs, conditions and user operations; CST-001, CST-010 | `src/app/portal/administracion/page.js`, `src/app/portal/usuarios/page.js`, `src/app/portal/layout.js` | administration, users and portal layout tests | User management is dedicated to Admin UI; professor navigation omission and direct-route redirect are covered. Backend authorization remains a security TODO. |
| HU-018-S07 | CST-006, CST-011 | service worker, `OfflineNotice`, reservations page | `ServiceWorker.test.js`, `OfflineNotice.test.js`, reservation tests | Code evidence ready; needs installed-PWA preview walkthrough. |
| HU-018-S08 | CST-011, CST-012 | shared status, language and focus styles | `ui-foundation.test.js` and route tests | Partial: automated component evidence exists; keyboard/screen-reader walkthrough remains required. |
| HU-018-S09 | `GET /api/logs/?UMG_User_ID=<value>`; CST-001, CST-011, CST-012 | `src/app/portal/logs/page.js`, `src/lib/audit-periods.js`, `src/components/AuditVisuals.js` | logs, audit-periods, and AuditVisuals tests | Weekly/default and local custom-range aggregation are derived only from returned Render records; no date analytics endpoint is invented. |
| HU-018-S10 | `GET /api/labs/`, `/api/condiciones/`, `/api/reservas/`, `/api/usuarios/`; CST-001, CST-011, CST-012 | `src/app/portal/logs/page.js`, `src/lib/operational-metrics.js`, `src/components/AuditVisuals.js` | Logs, operational-metrics, and AuditVisuals tests | Admin-only project indicators are independently loaded from real Render records. CPU/RAM/server telemetry is excluded because no published operation provides it. |

`/portal/logs` consumes the published `GET /api/logs/?UMG_User_ID=<value>`
operation through `listAuditLogs({ userId })`. It begins with the signed-in user ID,
keeps the published query editable, and presents local-only metrics, a full-width
weekly visual, validated local range filtering, original SVG/CSS visualizations and
10/20/50 pagination. No date analytics endpoint or server pagination is invented.
Raw API values are not translated.

## Closure rule

The checked runtime gates and configuration evidence are recorded in
`docs/harness/release-evidence-vercel.md`. No row marked blocked or partial may
be presented as production-accepted.
