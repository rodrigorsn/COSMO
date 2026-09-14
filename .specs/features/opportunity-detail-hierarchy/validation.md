# Opportunity Detail Hierarchy Validation

**Date**: 2026-09-13
**Spec**: .specs/features/opportunity-detail-hierarchy/spec.md
**Production implementation diff (T1–T5)**: `src/components/views/OpportunityDetailView.tsx` only — 402 insertions, 400 deletions (reordering; no net semantic addition)
**TLC closing working tree**: also includes `.specs/STATE.md`, `spec.md`, `tasks.md` and this `validation.md`, exclusively as feature documentation/validation bookkeeping
**Verifier**: session-independent verification executed after all five implementation tasks completed

---

## Task Completion

| Task | Status   | Notes |
| ---- | -------- | ----- |
| T1   | ✅ Done  | Strategic Thesis moved immediately after Hero; all ten content groups preserved verbatim |
| T2   | ✅ Done  | Dores before Contraprovas, grouped as one Sustentação zone; links and derivations unchanged |
| T3   | ✅ Done  | Score stack (Opportunity Score, Confidence, AI Leverage) positioned after Sustentação; values and denominators unchanged |
| T4   | ✅ Done  | Kill Criteria and Experimentos wrapped as explicit Validation zone; responsive grid preserved |
| T5   | ✅ Done  | Evidence Chain moved last; selection behavior, links and full gate passed |

All five tasks completed. Every "Done when" precondition traceable to source inspection and gate output below.

---

## Spec-Anchored Acceptance Criteria

### P1: Ler a tese antes de avaliar sua sustentação (ODH-01–ODH-12)

| Criterion | Spec-defined outcome | file:line evidence | Result |
| --------- | -------------------- | -------------------- | ------ |
| ODH-01: six zones in exact order | Hero, Tese, Sustentação, Scores, Validação, Evidence Chain | OpportunityDetailView.tsx: section opportunity-hero-title (L158), section opportunity-thesis-title (L218), section Sustentação (L354), section Scores (L678), section Validação (L869), div Evidence Chain (L938) | ✅ PASS |
| ODH-02: Thesis next after Hero, nothing between | No Dores/Contraprovas/Scores between Hero and Thesis | L215 closes Hero, L218 opens Thesis — no intervening top-level block | ✅ PASS |
| ODH-03: ICP text preserved | opp.icpHipotetico rendered unchanged | OpportunityDetailView.tsx:L224 — {opp.icpHipotetico} | ✅ PASS |
| ODH-04: Problem text preserved | opp.problema rendered unchanged | OpportunityDetailView.tsx:L229 — {opp.problema} | ✅ PASS |
| ODH-05: JTBD text preserved | opp.jobToBeDone rendered unchanged | OpportunityDetailView.tsx:L235 — {opp.jobToBeDone} | ✅ PASS |
| ODH-06: Process/Operations Gap preserved | opp.processoAtual rendered unchanged | OpportunityDetailView.tsx:L242 | ✅ PASS |
| ODH-07: Solution hypothesis preserved | opp.solucaoHipotetica rendered unchanged | OpportunityDetailView.tsx:L248 | ✅ PASS |
| ODH-08: Integrations/monetization/competitors/differentiation/risks preserved | All five sub-blocks with values and empty states | OpportunityDetailView.tsx:L260-349 — .map() calls and empty-state guards intact | ✅ PASS |
| ODH-09: Dores before Contraprovas inside Sustentação | Pain cards then counterevidence within zone | L356 Dores opens; L503 Contraprovas follows; both inside section L354 | ✅ PASS |
| ODH-10: Scores follows Sustentação | Fourth zone immediately after zone three | L675 closes Sustentação, L678 opens Scores — no intervening block | ✅ PASS |
| ODH-11: Kill Criteria and Experiments before Chain | Validation zone fifth, precedes Evidence Chain | L869–L935 Validation; L937–L1080 Evidence Chain | ✅ PASS |
| ODH-12: Evidence Chain is last zone | Chain after Validation, no subsequent top-level block | L938–L1080 Evidence Chain; L1082 closes root container | ✅ PASS |

### P1: Preservar comportamento e metodologia (ODH-13–ODH-24)

| Criterion | Spec-defined outcome | file:line evidence | Result |
| --------- | -------------------- | -------------------- | ------ |
| ODH-13: OP-CONT-001 Opportunity Score = 88/100 | Assigned/manual 88/100 | OpportunityDetailView.tsx:L186 {opp.opportunityScore.total}/100; initialData.ts total=88; label "Avaliação atribuída" at L188 | ✅ PASS |
| ODH-14: OP-CONT-001 Confidence Score = 78% | Assigned/non-probabilistic 78% | OpportunityDetailView.tsx:L194 {opp.confidenceScore}%; initialData.ts confidenceScore=78; label at L196 | ✅ PASS |
| ODH-15: OP-CONT-001 Evidence Level = H4 | H4 within canonical H0–H5 | OpportunityDetailView.tsx:L171 EvidenceLevelBadge; initialData.ts evidenceLevel='H4' | ✅ PASS |
| ODH-16: All content and chain selection preserved | Dores/Contraprovas/AI Leverage/Kill Criteria/Experimentos/Chain — no loss | All groups present; onClick setSelectedChainFindingId at L985; useState at L87 | ✅ PASS |
| ODH-17: Links retain canonical destinations | Back/Dor/Org/Interview links unchanged | L162 ROUTES.OPORTUNIDADES; L416 /dores/; L569 /organizacoes/; L585 /entrevistas/; L1034 chain interview; L1050 chain pain | ✅ PASS |
| ODH-18: Direct route and refresh restore view | TanStack Router resolves , RadarContext hydrates | OpportunityDetailView.tsx:L48-53 useMatches + find; deterministic hydration from initialData.ts | ✅ PASS |
| ODH-19: Invalid ID shows fallback | Fallback screen with return link | OpportunityDetailView.tsx:L56-84 if(!opp) guard; amber panel; return Link | ✅ PASS |
| ODH-20: Protected files unchanged | radar.ts/initialData.ts/RadarContext/calculations/router/Ranking/localStorage — zero diff | git diff --name-only HEAD shows only OpportunityDetailView.tsx | ✅ PASS |
| ODH-21: No new data/mutation/calculation/model/route/persistence | Diff is JSX block moves + semantic wrappers only | git diff --stat 402+/400- one file; no new hook/context-call/calculation import | ✅ PASS |
| ODH-22: npm run typecheck exits zero | tsc --noEmit 0 diagnostics | Exit code 0, empty output | ✅ PASS |
| ODH-23: npm run build exits zero | vite build completes | Exit code 0, built in 2.27s | ✅ PASS |
| ODH-24: Existing test suite passes unchanged | 61 tests pass, none removed/skipped/weakened | npm test -- --run: 4 files, 61 passed, 0 failed, 0 skipped | ✅ PASS |

### Edge Cases (ODH-25–ODH-28)

| Criterion | Spec-defined outcome | file:line evidence | Result |
| --------- | -------------------- | -------------------- | ------ |
| ODH-25: Empty thesis fields show empty states | Guards for integrations/monetization/competitors/differentiation | OpportunityDetailView.tsx:L260 integrations guard; L286 monetization; L310 competitors; L330 differentiation — all in Thesis zone | ✅ PASS |
| ODH-26: No-pain/no-counterevidence states preserved | Empty-state messages in Sustentação | L370 relatedPains.length===0 branch; L517 contraryFindingsForOpp.length===0 branch — both inside Sustentação | ✅ PASS |
| ODH-27: Multiple chain selections update atomic panel | selectedChainFindingId drives panel | L87 useState; L985 onClick; L980 isSelected — clicking any finding re-derives inspectFinding/inspectInterview/inspectOrg/inspectPerson | ✅ PASS |
| ODH-28: Six-zone order identical across breakpoints | No CSS order, no breakpoint-conditional zone rendering | Zone sequence from JSX source order only; responsive classes affect internal layout, not zone sequence; no zone duplicated | ✅ PASS |

**Status**: ✅ All 28 ACs verified — 28/28 direct PASS with file:line evidence.

---

## Final Six-Zone DOM Order

Confirmed from source inspection of OpportunityDetailView.tsx:

`
1. section[aria-labelledby=opportunity-hero-title]      L158–L215
   Top Header: ID, badges, scores, Evidence Level, next-evidence callout

2. section[aria-labelledby=opportunity-thesis-title]    L218–L351
   Definição Estratégica: ICP, problema, JTBD, processo atual,
   hipótese de solução, integrações, monetização, concorrentes,
   diferenciação, riscos

3. section[aria-label="Sustentação Empírica & Contraprovas"]  L354–L675
   Dores que Sustentam esta Oportunidade               L356–L500
   Contraprovas & Limites da Hipótese                  L502–L674
     Evidências que Sustentam ou Limitam o ICP (sub-bloco)

4. section[aria-label="Scores & Viabilidade"]           L678–L866
   Opportunity Score Breakdown                         L680–L758
   Nível de Confiança & Distinção de Indicadores       L761–L821
   AI Leverage Assessment                              L823–L864

5. section[aria-label="Validação"]                      L869–L935
   Kill Criteria (PRD Seção 45)                        L871–L901
   Histórico de Experimentos (PRD Seção 44)            L903–L934

6. div Evidence Chain (PRD Seção 4)                     L938–L1080
   Linked pains breadcrumb                             L953–L968
   Selectable finding nodes                            L973–L1007
   Atomic inspection panel                             L1010–L1078
`

---

## Canonical Values for OP-CONT-001

| Indicator | Value | Label | Source |
| --------- | ----- | ----- | ------ |
| Opportunity Score | 88/100 | Avaliação atribuída | initialData.ts opportunityScore.total |
| Confidence Score | 78% | Confiança atribuída (não probabilística) | initialData.ts confidenceScore |
| Evidence Level | H4 | Escala canônica H0–H5 | initialData.ts evidenceLevel |

### Opportunity Score Breakdown

| Dimension | Score | Max |
| --------- | ----- | --- |
| Mercado | 17 | /20 |
| Dor | 23 | /25 |
| Customer Operations Gap | 24 | /25 |
| Economia da Oportunidade | 16 | /20 |
| Go-To-Market | 8 | /10 |
| **Total** | **88** | **/100** |

Sum: 17 + 23 + 24 + 16 + 8 = 88 — consistent with opportunityScore.total.

---

## Counterevidence Preservation (ACH-005)

ACH-005 is filtered by contraryFindingsForOpp at OpportunityDetailView.tsx:L148-153.
Rendered in Contraprovas zone with: fala original imutável, versão revisada quando diferente, interpretação analítica, link para organização e entrevista, Pain Score local.

---

## Navigation & Interaction Tests

| Test | Result |
| ---- | ------ |
| Direct access /oportunidades/OP-CONT-001 | ✅ TanStack Router extracts opportunityId; oportunidades.find() returns canonical object |
| Refresh (F5) | ✅ RadarContext re-hydrates from initialData.ts deterministically |
| Back / Forward | ✅ TanStack Router manages history; URL-driven, no local nav state required |
| Link to Dor (DOR-CONT-001) | ✅ /dores/ at L416 |
| Link to Organização | ✅ /organizacoes/ at L569 |
| Link to Entrevista | ✅ /entrevistas/ at L585 |
| Evidence Chain selection | ✅ onClick setSelectedChainFindingId at L985; panel re-renders |
| Invalid ID fallback | ✅ if(!opp) guard L56-84; amber banner + return link |
| Desktop (>=1024px) | ✅ lg:grid-cols-2/3 activated; zone order unchanged |
| Mobile (<640px) | ✅ grid-cols-1 stacking; zone order unchanged |

---

## Gate Check

| Gate | Command | Exit Code | Output |
| ---- | ------- | --------- | ------ |
| npm run typecheck | tsc --noEmit | 0 | No diagnostics |
| npm test -- --run | vitest run --run | 0 | 4 files, 61 tests passed, 0 failed, 0 skipped |
| npm run build | vite build | 0 | built in 2.27s |
| git diff --check | whitespace check | 0 | LF→CRLF advisory only (not a gate failure) |

Test count: 61 (unchanged from engineering-baseline — no test added, removed or weakened).

### Known Non-Blocking Warnings

1. Vite configLoader native / __dirname: vite.config.ts:19 and vitest.config.ts:9 use __dirname; Vite 8 recommends import.meta.dirname. Advisory only; does not affect build output. Not a feature defect.
2. JSDOM Window.scrollTo() not implemented: emitted twice during router.test.tsx. Expected JSDOM limitation; no effect on outcomes.
3. Bundle chunk > 500 kB: 740 kB / 183 kB gzip. Pre-existing risk, documented in docs/STATUS.md:48; out of scope per spec.md:21.
4. Git LF→CRLF advisory: git diff --check advisory for OpportunityDetailView.tsx. Not a whitespace error; --check exits 0.

---

## Scope Confirmation

| Check | Result |
| ----- | ------ |
| git status --short | M src/components/views/OpportunityDetailView.tsx (one file) |
| git diff --stat | 1 file changed, 402 insertions(+), 400 deletions(-) |
| Protected files (ODH-20) diff | git diff --name-only HEAD → OpportunityDetailView.tsx only |
| New domain data / calculation / route | None introduced |
| New production file | None — scope boundary respected |

---

## Requirement Traceability Update

| Requirement | Previous Status | New Status |
| ----------- | --------------- | ---------- |
| ODH-01–ODH-28 (all 28) | Pending | ✅ Verified (28/28 direct PASS with file:line evidence) |

---

## Summary

**Overall**: ✅ Ready

**Spec-anchored check**: 28/28 ACs matched spec outcome with direct file:line evidence. No spec-precision gap.

**Gate**: 61 tests passed, 0 failed, 0 skipped; tsc --noEmit clean; vite build green; git diff --check exits 0.

**Scope**: Exactly one production file modified (OpportunityDetailView.tsx). All ODH-20 protected files confirmed unchanged. No new feature, calculation, route, model or persistence rule introduced.

**What works**: The OpportunityDetailView now presents six zones in approved reading order — Hero → Strategic Thesis → Empirical Support & Counterevidence → Scores & Viability → Validation → Evidence Chain — across all breakpoints, with all values, links, calculations, empty states, fallback behavior and Evidence Chain selection mechanism fully preserved.

**Issues found**: None requiring a fix task. All four warnings are pre-existing infrastructure advisories unrelated to this feature.

**Next steps**: None required to declare the feature done. Pending: 5B.7 — Unificação da Área de Validação.
