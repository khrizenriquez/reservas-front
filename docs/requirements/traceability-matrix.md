# Release Traceability Matrix

| Scenario | Contract / constraint | Implementation | Automated evidence | Release status |
|---|---|---|---|---|
| HU-018-S01 | CST-006, CST-012 | `src/app/page.js` | `src/app/page.test.js` | Code evidence ready; needs Vercel preview review. |
| HU-018-S02 | `POST /api/auth/login/`; CST-001, CST-003, CST-004, CST-010 | `src/app/acceso/page.js`, `SessionProvider.js` | `src/app/acceso/page.test.js`, API client tests and `cors:check` | Render v1 anonymous CORS validated; requires an authorized test account for end-to-end login. |
| HU-018-S03 | `GET /api/labs/disponibles/`; CST-001, CST-002, CST-011 | `src/app/portal/disponibilidad/page.js` | `src/app/portal/disponibilidad/page.test.js` | Code evidence ready; needs deployed API validation. |
| HU-018-S04 | `POST /api/reservas/`; CST-001, CST-002, CST-011 | `src/app/portal/reservas/page.js` | `src/app/portal/reservas/page.test.js` | Partial: Render does not publish idempotency-key support. |
| HU-018-S05 | `GET/PATCH /api/reservas/`; CST-001, CST-011 | `src/app/portal/reservas/page.js` | `src/app/portal/reservas/page.test.js` | Partial: cancellation is covered; modification/ownership and future-state enforcement require Render response support. |
| HU-018-S06 | Render labs, conditions, users and logs operations; CST-001 | `src/app/portal/administracion/page.js` | `src/app/portal/administracion/page.test.js` | Partial: server-side role enforcement must be validated in deployed session. |
| HU-018-S07 | CST-006, CST-011 | service worker, `OfflineNotice`, reservations page | `ServiceWorker.test.js`, `OfflineNotice.test.js`, reservation tests | Code evidence ready; needs installed-PWA preview walkthrough. |
| HU-018-S08 | CST-011, CST-012 | shared status, language and focus styles | `ui-foundation.test.js` and route tests | Partial: automated component evidence exists; keyboard/screen-reader walkthrough remains required. |

## Closure rule

The checked runtime gates and configuration evidence are recorded in
`docs/harness/release-evidence-vercel.md`. No row marked blocked or partial may
be presented as production-accepted.
