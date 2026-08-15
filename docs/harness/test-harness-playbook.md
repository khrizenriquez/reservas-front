# Test Harness Playbook

## Objetivo

Ejecutar validaciones de forma repetible para proteger contrato, comportamiento y calidad.

## Capas sugeridas

1. Contrato API
2. Unit/integration
3. E2E mock
4. E2E real (cuando aplique)
5. Checks de accesibilidad y offline (si aplica al producto)

## Secuencia minima

1. Validar contrato: `npm run contract`.
2. Ejecutar gate base: `npm run check`.
3. Ejecutar E2E mock: `npm run test:e2e:mock` cuando aplique.
4. Ejecutar PWA: `npm run test:pwa` cuando aplique.
5. Ejecutar seeded/cross-client solo con credenciales y stack real (`test:e2e:seeded`, `test:e2e:cross-client`).
6. Guardar reportes y enlazarlos al commit/PR.

## Politica de fallo

- Si falla una capa requerida, el gate falla.
- No se permite merge con escenarios omitidos que sean obligatorios.
- Para gate real, ausencia de credenciales debe abortar la ejecucion; no debe marcarse como aprobado con skips.

## Evidencias

Registrar: comando, fecha, commit, entorno, resumen pass/fail y ruta de artefactos.
