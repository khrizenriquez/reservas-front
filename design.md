# Design Direction

## Purpose

Define the visual and interaction direction for the frontend implementation while preserving legal and technical constraints.

## Visual references

- Dashboard and forms direction inspired by Vuexy-style enterprise UI:
  - https://demos.pixinvent.com/vuexy-html-admin-template/html/horizontal-menu-template-dark/index.html
- Landing page direction inspired by Crafto-style premium commerce layout rhythm:
  - https://craftohtml.themezaa.com/demo-clothing-store.html

These references are style targets, not source code assets to copy.

## Mandatory implementation rule

- Build original UI components in Next.js + React + Bulma.
- Do not copy proprietary template source code, markup, or bundled assets.
- Recreate interaction patterns with project-owned implementation.

## Dashboard and form style requirements

- Dense-but-readable admin layout.
- Clear hierarchy: top metrics, action panels, tables/lists, details.
- Soft depth with controlled shadows and border system.
- Animated transitions for route changes, panel reveals, toasts, and loading states.
- Form interactions include:
  - focus transition
  - input validation feedback
  - disabled/loading submit states
  - success/error inline status

## Landing style requirements

- Hero section with institutional imagery, layered overlays, and call-to-action.
- Scroll-based reveal animations for sections and cards.
- Mobile-first responsive behavior with readable typography and spacing.
- Visual language aligned with product palette from product design spec.

## Approved image sources

Use these image URLs as baseline content assets (subject to usage rights approval):

- https://umg.edu.gt/img/admisiones/guatemala.webp
- https://umg.edu.gt/img/admisiones/Edificio_medicina-odontologia.webp
- https://umg.edu.gt/img/cu/centros-universitarios-t.webp

## Error UX requirements

- API 4xx/5xx errors must render friendly messages at visual level.
- Error states must be visible in forms, page-level alerts, and retry actions.
- Error copy must be localized and consistent across modules.

## Language and i18n requirements

- Default language: Spanish.
- Secondary selectable language: English.
- Language selector must be visible in public and authenticated layouts.
- UI labels, validation, empty states, and error messages must be translatable.

## Accessibility and motion

- Respect reduced-motion preferences.
- Keep keyboard and screen reader support for interactive controls.
- Never rely on color alone for status and validation.

## Traceability

This file must remain aligned with:

- specs/product-design.md
- specs/constraints-traceability.md
- specs/i18n-error-spec.md
- AGENTS.md
- stack.md
