# Opportunity Detail Hierarchy Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** The skill governs the per-task cycle, gates, atomic commits, adequacy review, independent Verifier and discrimination sensor.

**If the skill cannot be activated, STOP and tell the user.**

---

**Design**: `.specs/features/opportunity-detail-hierarchy/design.md`  
**Status**: Draft

---

## Scope Boundary

The only production implementation file authorized by default is:

```text
src/components/views/OpportunityDetailView.tsx
```

TLC bookkeeping may update this `tasks.md` and the requirement traceability in `spec.md` as tasks complete. No other source, test, domain, data, calculation, context, route, package or configuration file is authorized. If implementation or deterministic verification requires another file, STOP before editing it and report a scope divergence to the user.

The implementation must move existing JSX blocks. It must not rewrite domain logic, extract components, duplicate blocks, change values, alter calculations or introduce new state.

---

## Pre-Execution Gates

All gates below must be green before T1 starts. Record their output in the execution log or task handoff.

| Gate | Check | Pass condition |
| ---- | ----- | -------------- |
| Spec validated | `python .claude/skills/tlc-spec-driven/scripts/validate_spec.py .specs/features/opportunity-detail-hierarchy` | Exit zero; 28 requirements recognized with no error. |
| Design validated | Review `design.md` against `spec.md` and confirm its Requirement Mapping, six-zone composition, state/link inventory and validation strategy | ODH-01–ODH-28 mapped; no unresolved design decision. |
| Tasks validated | `python .claude/skills/tlc-spec-driven/scripts/validate_tasks.py .specs/features/opportunity-detail-hierarchy` | Exit zero; no structural, dependency, granularity or test-field error. |
| Working tree known | `git status --short --branch`, `git diff --name-only`, `git ls-files --others --exclude-standard` | Baseline captured before implementation. Existing user changes remain identifiable. |
| Scope clean | Compare the working-tree baseline with the implementation allowlist | No unexpected change outside the feature artifacts and `OpportunityDetailView.tsx`. |
| Technical baseline | `npm run typecheck && npm test && npm run build` | All commands exit zero; current passing test count recorded and never decreases. |

If any gate fails, do not start T1. Diagnose and report the blocker without modifying production code.

---

## Test Coverage Matrix

> Generated from `AGENTS.md`, `package.json`, `.github/workflows/ci.yml`, the feature spec/design and all four existing test files. The repository uses Vitest 5 and Testing Library. The current suite covers calculations, route helpers, `RadarContext` and application-shell smoke behavior, but has no dedicated `OpportunityDetailView` test. The user-authorized implementation allowlist excludes new or modified test files. Therefore each task combines targeted black-box UAT/static preservation checks with the complete existing automated regression suite. Any need to edit a test file is a scope divergence that must be approved before implementation.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Opportunity detail presentation and interaction | Black-box UAT plus static preservation checks | Every ODH criterion assigned to the task; DOM order, visible content, links, selection, fallback and responsive behavior as applicable | `src/components/views/OpportunityDetailView.tsx` | Targeted browser/UAT checklist plus Quick or Full gate |
| Existing application/router behavior | Integration regression, existing suite only | Existing dashboard/unknown-route smoke and route contracts remain green; no test removed, skipped or weakened | `src/router.test.tsx`, `src/navigation/routeMap.test.ts` | `npm test` |
| Existing state and calculation behavior | Unit and integration regression, existing suite only | All current context and calculation tests pass unchanged | `src/context/RadarContext.test.tsx`, `src/utils/calculations.test.ts` | `npm test` |
| Types, data, context, calculations, router, Ranking and Guided Journey | none, immutable scope | Zero diff in protected production files; behavior covered by unchanged build/regression suite | Protected files named by ODH-20 | Scope gate plus Build gate |
| Responsive layout | Black-box UAT | Identical six-zone DOM/visual order at mobile, tablet and desktop; no horizontal overflow, overlap or duplicated block | Running application | Responsive UAT checklist |

Empty-state UAT must use reversible runtime data, such as a controlled `localStorage` fixture, and restore the prior storage afterward. It must not edit `initialData.ts` or any other source file.

## Gate Check Commands

> Generated from `package.json` and the repository CI. There is no lint script. `npm run check` includes a network-dependent production audit, so the feature gates requested by the spec are listed explicitly and deterministically.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Scope | Before and after every task | `git status --short && git diff --name-only && git diff -- src/components/views/OpportunityDetailView.tsx` |
| Quick | After T1–T4 | `npm run typecheck && npm run build` |
| Full | After T5 and before Verifier | `npm test && npm run typecheck && npm run build` |
| TLC structure | Before Execute and whenever task definitions change | `python .claude/skills/tlc-spec-driven/scripts/validate_spec.py .specs/features/opportunity-detail-hierarchy && python .claude/skills/tlc-spec-driven/scripts/validate_tasks.py .specs/features/opportunity-detail-hierarchy` |

Every task also runs its targeted black-box/static validation before its automated gate. A task is not complete when only compilation passes.

---

## Execution Plan

Phases execute sequentially. Each task keeps the component compilable, completes its targeted validation and gate, updates TLC traceability, then receives one atomic commit before the next task starts.

### Phase 1: Establish the Decision Narrative

```text
T1 → T2 → T3
```

### Phase 2: Complete Validation and Traceability

```text
T4 → T5
```

---

## Task Breakdown

### T1: Place the complete Strategic Thesis after the Hero

**Objective**: Move the existing `Definição Estratégica do Opportunity Card` block exactly once so it becomes the second top-level zone immediately after the complete Hero.
**What**: Preserve the Hero as header plus Next Evidence callout, move the full thesis card out of the late two-column details grid, and establish stable semantic boundaries for Hero and Thesis without changing visible content.
**Where**: `src/components/views/OpportunityDetailView.tsx`
**Allowed files**: `src/components/views/OpportunityDetailView.tsx` only; TLC bookkeeping under this feature directory
**Depends on**: None
**Reuses**: Existing Top Header, Next Evidence callout and `Definição Estratégica do Opportunity Card` JSX
**Requirement**: ODH-02, ODH-03, ODH-04, ODH-05, ODH-06, ODH-07, ODH-08, ODH-20, ODH-21, ODH-25

**Preconditions**:

- [ ] All Pre-Execution Gates pass and their baseline outputs are recorded.
- [ ] The source boundaries for Hero, Thesis and the shared late details grid are identified.
- [ ] A search confirms one current occurrence of each thesis heading/sub-block and each empty-state message.

**Steps**:

1. Preserve the entire Hero, including its back link, score summaries, Evidence Level badge and Next Evidence callout.
2. Remove the thesis card from the late details grid and insert that same JSX immediately after Hero in the same edit.
3. Preserve ICP, problem, JTBD, current process/Operations Gap, solution, integrations, monetization, alternatives/competitors, differentiation and risks verbatim.
4. Preserve all thesis conditionals, `.map()` calls and empty-state messages.
5. Add only the minimum semantic section/label association required by the approved design; do not add visible copy or CSS ordering.

**Validation**:

- [ ] DOM/source inspection shows Hero first and Thesis second, with no conceptual block between them.
- [ ] Search finds exactly one occurrence of the thesis card and each of its ten content groups.
- [ ] `OP-CONT-001` thesis values match the pre-execution baseline.
- [ ] Empty-state branches for integrations, monetization, competitors and differentiation are textually unchanged.
- [ ] Scope and Quick gates pass; the existing test count has not changed.

**Completion criteria**:

- [ ] Thesis is rendered exactly once immediately after Hero.
- [ ] No hook, derivation, handler, link, value, calculation or domain file changed.
- [ ] Component compiles and production build succeeds.

**Tests**: Black-box UAT plus static preservation checks; unchanged automated suite count recorded
**Gate**: Quick — `npm run typecheck && npm run build`
**Commit**: `refactor(opportunity-detail): move strategic thesis after hero`

---

### T2: Group related pains before counterevidence

**Objective**: Form the third top-level zone from the two existing methodological cards, preserving Dores first and Contraprovas second.
**What**: Group the complete `Dores que Sustentam esta Oportunidade` and `Contraprovas & Limites da Hipótese` blocks in one semantic Sustentação zone without changing derivations or card internals.
**Where**: `src/components/views/OpportunityDetailView.tsx`
**Allowed files**: `src/components/views/OpportunityDetailView.tsx` only; TLC bookkeeping under this feature directory
**Depends on**: T1
**Reuses**: Existing pain/counterevidence cards, `calculatePainConsolidation`, `evaluateEvidenceLevel`, `isPainScoreMeasured`, `getIntervieweeInfo` and TanStack `Link` instances
**Requirement**: ODH-09, ODH-16, ODH-17, ODH-20, ODH-21, ODH-26

**Preconditions**:

- [ ] T1 is complete and its gates pass.
- [ ] Dores, Contraprovas and the ICP-limit sub-block remain contiguous and unique.
- [ ] Existing links to Dor, Organização and Entrevista are inventoried with their current `to` and `params` values.

**Steps**:

1. Wrap/group the two existing cards as one top-level Sustentação Empírica & Contraprovas zone.
2. Keep Dores before Contraprovas in source, DOM and visual order.
3. Keep `Evidências que Sustentam ou Limitam o ICP` inside and after the counterevidence content.
4. Preserve inline calculations, filters, helper calls, reviewed-evidence rules and Pain Score display logic exactly.
5. Preserve all Dor, Organização and Entrevista links and both empty-state branches.

**Validation**:

- [ ] The third zone contains Dores first, Contraprovas second and the ICP-limit sub-block last.
- [ ] Link inventory matches the baseline exactly.
- [ ] Static diff shows no edit to calculation expressions, filters, helper implementation or evidence text.
- [ ] Black-box checks cover normal Dores/Contraprovas and reversible no-pain/no-counterevidence runtime states.
- [ ] Scope and Quick gates pass; the existing test count has not changed.

**Completion criteria**:

- [ ] Sustentação is a single top-level zone with the approved internal order.
- [ ] Existing evidence content, impartial counterevidence treatment, links and empty states remain functional.
- [ ] No derivation or protected file changed.

**Tests**: Black-box UAT plus static preservation checks; unchanged automated suite count recorded
**Gate**: Quick — `npm run typecheck && npm run build`
**Commit**: `refactor(opportunity-detail): group empirical support and counterevidence`

---

### T3: Place Scores and Viability after empirical support

**Objective**: Make the current score stack the fourth top-level zone immediately after Sustentação.
**What**: Move the existing Opportunity Score, Confidence and AI Leverage cards as one ordered stack, then remove only the obsolete shared details-grid wrapper.
**Where**: `src/components/views/OpportunityDetailView.tsx`
**Allowed files**: `src/components/views/OpportunityDetailView.tsx` only; TLC bookkeeping under this feature directory
**Depends on**: T2
**Reuses**: Existing score cards, `EvidenceLevelBadge`, `opp.opportunityScore`, `opp.confidenceScore`, `opp.evidenceLevel` and `opp.aiLeverage`
**Requirement**: ODH-10, ODH-13, ODH-14, ODH-15, ODH-16, ODH-20, ODH-21

**Preconditions**:

- [ ] T2 is complete and its gates pass.
- [ ] Opportunity Score, Confidence and AI Leverage cards are unique and still grouped in their existing order.
- [ ] Baseline values and methodological labels for `OP-CONT-001` are recorded.

**Steps**:

1. Move the complete score stack to immediately after the Sustentação zone.
2. Preserve the internal order: Opportunity Score, Confidence, AI Leverage.
3. Remove only the parent grid/wrapper made obsolete by separating Thesis and Scores.
4. Preserve all score expressions, denominators, progress-bar widths and methodological copy verbatim.
5. Preserve the score stack's responsive internal grids; do not add CSS `order` or breakpoint-specific duplicate markup.

**Validation**:

- [ ] Scores & Viabilidade is fourth in the DOM and follows Sustentação directly.
- [ ] `OP-CONT-001` still shows `88/100`, `78%` and `H4` with assigned/manual and non-probabilistic meanings intact.
- [ ] Opportunity Score denominators remain `/20`, `/25`, `/25`, `/20`, `/10`; AI Leverage remains unchanged.
- [ ] Search confirms each score card appears exactly once.
- [ ] Scope and Quick gates pass; the existing test count has not changed.

**Completion criteria**:

- [ ] Score cards form one unique fourth zone in the approved order.
- [ ] No value, calculation, label, model or data source changed.
- [ ] Component compiles and production build succeeds.

**Tests**: Black-box UAT plus static preservation checks; unchanged automated suite count recorded
**Gate**: Quick — `npm run typecheck && npm run build`
**Commit**: `refactor(opportunity-detail): position scores and viability after evidence`

---

### T4: Define the Validation zone without changing its internals

**Objective**: Make Kill Criteria and Histórico de Experimentos one explicit fifth-zone unit while preserving their existing DOM order and responsive grid.
**What**: Establish the semantic Validation boundary around the existing two-card grid; do not yet copy, split or rewrite either card.
**Where**: `src/components/views/OpportunityDetailView.tsx`
**Allowed files**: `src/components/views/OpportunityDetailView.tsx` only; TLC bookkeeping under this feature directory
**Depends on**: T3
**Reuses**: Existing `Kill Criteria & Experimentos` grid and `opp.killCriteria`/`opp.experimentos` mappings
**Requirement**: ODH-11, ODH-16, ODH-20, ODH-21, ODH-28

**Preconditions**:

- [ ] T3 is complete and its gates pass.
- [ ] Kill Criteria and experiment cards are unique and preserve Kill Criteria first in the DOM.
- [ ] The current `grid-cols-1 lg:grid-cols-2` responsive contract is recorded.

**Steps**:

1. Convert or wrap the existing validation grid with the minimum semantic boundary defined by the design.
2. Preserve Kill Criteria before Histórico de Experimentos in the DOM.
3. Preserve every `.map()`, key, status branch, value and label.
4. Preserve `grid-cols-1 lg:grid-cols-2` and all internal responsive classes.
5. Do not introduce event handlers, state or new validation rules.

**Validation**:

- [ ] The Validation landmark contains both cards exactly once and in the approved internal order.
- [ ] Kill Criteria and experiment content for `OP-CONT-001` matches the baseline.
- [ ] Mobile/tablet/desktop inspection shows stacking/two-column behavior unchanged and no overflow.
- [ ] Static diff shows no edit to domain expressions or status branches.
- [ ] Scope and Quick gates pass; the existing test count has not changed.

**Completion criteria**:

- [ ] Validation is one cohesive zone ready to precede the chain.
- [ ] Its content and responsive behavior are unchanged.
- [ ] Component compiles and production build succeeds.

**Tests**: Black-box responsive UAT plus static preservation checks; unchanged automated suite count recorded
**Gate**: Quick — `npm run typecheck && npm run build`
**Commit**: `refactor(opportunity-detail): define validation zone`

---

### T5: Move Evidence Chain last and close the regression gate

**Objective**: Move the complete Evidence Chain after Validation, finalize the six-zone DOM order and prove all requirements without expanding scope.
**What**: Relocate the chain as one indivisible block, preserve its local selection behavior and links, then execute full structural, navigation, responsive and automated regression validation.
**Where**: `src/components/views/OpportunityDetailView.tsx`
**Allowed files**: `src/components/views/OpportunityDetailView.tsx` only; TLC bookkeeping under this feature directory
**Depends on**: T4
**Reuses**: Existing Evidence Chain JSX, `selectedChainFindingId`, `setSelectedChainFindingId`, related/inspection derivations and TanStack links
**Requirement**: ODH-01, ODH-12, ODH-16, ODH-17, ODH-18, ODH-19, ODH-20, ODH-21, ODH-22, ODH-23, ODH-24, ODH-27, ODH-28

**Preconditions**:

- [ ] T4 is complete and its gates pass.
- [ ] The complete chain boundary includes linked pains, selectable findings and atomic-inspection panel.
- [ ] `selectedChainFindingId`, its setter, derived inspection records and every chain link are recorded before movement.

**Steps**:

1. Remove the complete Evidence Chain from its earlier position and insert that same block once after Validation.
2. Preserve `onClick={() => setSelectedChainFindingId(f.id)}`, selection styling, keys and the fallback to `relatedFindings[0]` exactly.
3. Preserve linked Dor and Entrevista targets/params and every traceability field.
4. Confirm the final first-level DOM order: Hero, Thesis, Sustentação, Scores, Validation, Evidence Chain.
5. Run full black-box checks for direct route, refresh, Back/Forward, internal links, invalid ID fallback, selected findings, empty states and supported breakpoints.
6. Run scope checks and the Full gate. Confirm protected files have no diff and the existing test count does not decrease.

**Validation**:

- [ ] The six landmarks/headings occur once and in the exact ODH-01 order; Thesis directly follows Hero and Chain is last.
- [ ] Selecting at least two findings updates the atomic panel to the corresponding finding each time.
- [ ] Back link, Dor, Organização and Entrevista links retain their canonical destinations.
- [ ] Direct access and refresh of `/oportunidades/OP-CONT-001` restore the same view; Back/Forward preserves URL-driven navigation.
- [ ] An unknown opportunity ID preserves the current fallback and return link.
- [ ] Thesis and Sustentação empty states pass with reversible runtime data and storage is restored afterward.
- [ ] Mobile, tablet and desktop preserve the same DOM/visual order with no duplicated or inaccessible content.
- [ ] `OP-CONT-001` remains `88/100`, `78%`, `H4`; AI Leverage, pains, counterevidence, validation and traceability content remain intact.
- [ ] `npm test`, `npm run typecheck` and `npm run build` all exit zero; no test was removed, skipped or weakened.
- [ ] Git diff contains no unexpected source file and no protected ODH-20 file.

**Completion criteria**:

- [ ] ODH-01–ODH-28 have implementation or regression evidence.
- [ ] Evidence Chain is functional and is the final conceptual zone.
- [ ] Only the authorized production file and TLC bookkeeping differ from the recorded baseline.
- [ ] Full gate passes and the feature is ready for the independent TLC Verifier.

**Tests**: Full black-box UAT plus unchanged unit/integration regression suite
**Gate**: Full — `npm test && npm run typecheck && npm run build`
**Commit**: `refactor(opportunity-detail): finalize hierarchy and evidence chain`

---

## Phase Execution Map

```text
Phase 1 → Phase 2

Phase 1: T1 → T2 → T3
Phase 2: T4 → T5

Full chain: T1 → T2 → T3 → T4 → T5
```

Execution is strictly sequential. T4 depends on the completed Phase 1 chain; T5 closes Phase 2 and the full feature gate.

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1 | One JSX block move plus its two semantic boundaries in one component | ✅ Granular and compilable |
| T2 | One cohesive two-card evidence zone in one component | ✅ Granular and compilable |
| T3 | One existing three-card score stack move in one component | ✅ Granular and compilable |
| T4 | One existing two-card validation boundary in one component | ✅ Granular and compilable |
| T5 | One Evidence Chain block move plus final feature gate in one component | ✅ Granular and compilable |

No task creates a component, function, route, model, calculation, data fixture or persistence behavior.

---

## Diagram-Definition Cross-Check

| Task | Depends On | Diagram Shows | Status |
| ---- | ---------- | ------------- | ------ |
| T1 | None | Chain start | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T2 | T2 → T3 | ✅ Match |
| T4 | T3 | T3 → T4 | ✅ Match |
| T5 | T4 | T4 → T5 | ✅ Match |

No dependency points to a later phase. Every arrow has one matching `Depends on` declaration.

---

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1 | Opportunity detail presentation | Black-box UAT + static preservation + regression gate | Same; no test-file edit authorized | ✅ Conforms to explicit scope |
| T2 | Opportunity detail presentation/navigation | Black-box UAT + static preservation + regression gate | Same; no test-file edit authorized | ✅ Conforms to explicit scope |
| T3 | Opportunity score presentation | Black-box UAT + static preservation + regression gate | Same; no test-file edit authorized | ✅ Conforms to explicit scope |
| T4 | Opportunity validation presentation/responsiveness | Black-box UAT + static preservation + regression gate | Same; no test-file edit authorized | ✅ Conforms to explicit scope |
| T5 | Opportunity chain interaction and final integration | Full black-box UAT + complete existing automated suite | Same; no test-file edit authorized | ✅ Conforms to explicit scope |

The matrix does not defer an authorized test change. It records that no test file is inside the approved implementation boundary. A future need for dedicated automated view coverage triggers the required scope-divergence report before any edit.

---

## Requirement Coverage

| Requirement | Tasks | Verification focus |
| ----------- | ----- | ------------------ |
| ODH-01 | T5 | Exact six-zone first-level DOM order |
| ODH-02 | T1, T5 | Thesis immediately after complete Hero |
| ODH-03 | T1 | ICP text preserved |
| ODH-04 | T1 | Problem text preserved |
| ODH-05 | T1 | JTBD text preserved |
| ODH-06 | T1 | Current process/Operations Gap preserved |
| ODH-07 | T1 | Solution hypothesis preserved |
| ODH-08 | T1 | Integrations, monetization, competitors, differentiation and risks preserved |
| ODH-09 | T2, T5 | Dores before Contraprovas inside Sustentação |
| ODH-10 | T3, T5 | Scores follows Sustentação |
| ODH-11 | T4, T5 | Kill Criteria and Experiments before Chain |
| ODH-12 | T5 | Evidence Chain is last |
| ODH-13 | T3, T5 | `88/100`, assigned/manual |
| ODH-14 | T3, T5 | `78%`, assigned/manual/non-probabilistic |
| ODH-15 | T3, T5 | `H4`, canonical H0–H5 |
| ODH-16 | T2, T3, T4, T5 | All preserved content and chain selection |
| ODH-17 | T2, T5 | Opportunity-list, Dor, Organização and Entrevista links |
| ODH-18 | T5 | Direct route and refresh |
| ODH-19 | T5 | Invalid-ID fallback and return link |
| ODH-20 | T1–T5 | Protected architecture/domain files remain unchanged |
| ODH-21 | T1–T5 | No new data, mutation, calculation, model, route or persistence rule |
| ODH-22 | T5 | `npm run typecheck` exits zero |
| ODH-23 | T5 | `npm run build` exits zero |
| ODH-24 | T5 | Existing test suite passes unchanged |
| ODH-25 | T1, T5 | Thesis empty states preserved |
| ODH-26 | T2, T5 | No-pain/no-counterevidence states preserved |
| ODH-27 | T5 | Multiple chain selections update atomic panel |
| ODH-28 | T3, T4, T5 | Same zone order across supported breakpoints |

**Coverage:** 28 total, 28 mapped, 0 unmapped.

---

## Execute Readiness

- Five tasks fit one TLC task-budgeted batch, so Execute runs sequentially in the main session unless the user requests delegation.
- Approval of these tasks authorizes only local implementation and TLC-required local commits. It does not authorize push, deploy or any remote action.
- Before Execute, ask the user which tools to use per task. Available project skill: `tlc-spec-driven`. No MCP is required for this in-place React/Tailwind change.
