# FocoScore

ROUTE_B_E2E_CLEAN_01  
ROUTE_B_E2E_EXPORT_READY_01

MiniApp nativa, mobile-first y en español para decidir si una idea o tarea vale la pena según **Impacto** y **Esfuerzo**.

## Producto

- Inputs enteros 1–10: Impacto y Esfuerzo
- CTA **Calcular**
- Fórmula: `score = Impacto − Esfuerzo`
- Veredicto:
  - `score >= 3` → **HACER**
  - `score` entre −2 y 2 inclusive → **REVISAR**
  - `score <= -3` → **DESCARTAR**
- Botón **Limpiar** (resetea inputs, score y resultado)
- Validación: vacíos, no numéricos o fuera de 1–10 no producen NaN ni un resultado falso

Auth: off. Base de datos: off. Sin dependencias pagadas.

## Publicación

- URL grok.me: **PENDIENTE_OWNER_PUBLISH** (Publish requiere acción del propietario)
- Repo: [https://github.com/NanoCarriez/route-b-e2e-clean-01](https://github.com/NanoCarriez/route-b-e2e-clean-01)
- Rama: `main`
- Conversación Build: no hay ID/URL fiable en esta superficie (no inventado)
- Project ID (plataforma): `01a096a0-1e8b-7931-8a33-f5d50aae4a79`

## Tests

| Gate | Resultado |
| --- | --- |
| typecheck (`tsc --noEmit`) | PASS |
| build (`vite` + nitro vercel) | PASS |
| Product tests `src/lib/foco-score.test.ts` | PASS (10/10) |
| Casos requeridos UI 390×844 | PASS |
| 8 / 3 → score 5 → HACER | PASS |
| 6 / 5 → score 1 → REVISAR | PASS |
| 2 / 8 → score −6 → DESCARTAR | PASS |
| Validación vacíos / no numérico / fuera de rango / decimal | PASS (mensaje claro, sin NaN, sin resultado falso) |
| Limpiar | PASS |
| Smoke desktop + mobile, sin overflow horizontal | PASS |
| Production build vs baseline | PASS (`divergesFromBaseline: false`) |
| `npm test` (suite completa del workspace) | 6 FAIL en `scripts/grok-pwa-plugin.test.mjs` — el injector lee el título real `FocoScore` desde `src/lib/og/site.json`; no es un defecto del producto |

## Limitaciones reales

- Publish a `*.grok.me` exige el botón **Publish** del propietario en Grok Build. No hay API de publicación desde el agente.
- App utility: usa el placeholder `og.grok.me` (sin `public/og.jpg` custom).
- Sin cuentas, sin persistencia, sin backend propio.
- ID/URL de esta conversación Build no está expuesto de forma fiable.

ROUTE_B_E2E_CLEAN_01  
ROUTE_B_E2E_EXPORT_READY_01
