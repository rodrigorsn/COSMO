# Engineering Baseline Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow, including the per-task cycle, adequacy review, Verifier and discrimination sensor.

**If the skill cannot be activated, STOP and tell the user.**

---

**Design**: `.specs/features/engineering-baseline/design.md`
**Status**: In Progress

---

## Test Coverage Matrix

> Generated from the codebase, approved spec and project guidelines. Guidelines found: `AGENTS.md`, `.specs/features/engineering-baseline/spec.md` and `.specs/features/engineering-baseline/design.md`. The repository has no existing automated tests, so the user-approved unit/integration strategy and strong TLC defaults apply.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Toolchain and manifests | none | Deterministic install, supported engines, one lockfile, zero moderate+ production audit findings | `package.json`, `.npmrc`, `.nvmrc`, `package-lock.json` | Foundation or Build gate |
| Calculation/domain utilities | unit | Every decision branch in all seven exported functions; exact boundary and incomplete-state results | `src/utils/*.test.ts` | `npm test -- src/utils/calculations.test.ts` |
| Route utilities | unit | Every builder and matcher; valid, encoded, missing, extra-segment and unrelated paths | `src/navigation/*.test.ts` | `npm test -- src/navigation/routeMap.test.ts` |
| Radar state provider | integration | Pending, reviewed, discarded and reset transitions mapped 1:1 to BASE-13 through BASE-16 | `src/context/*.test.tsx` | `npm test -- src/context/RadarContext.test.tsx` |
| Application router/shell | integration | Dashboard boot and unknown-route fallback with real provider and route tree | `src/*.test.tsx` | `npm test -- src/router.test.tsx` |
| Legacy React consumer contracts | none | Every diagnosed consumer conforms to existing canonical types without casts or changes to `src/types/radar.ts`; build gate only | `src/components/{modals,views}/*.tsx` | Bootstrap or Foundation gate |
| CI and documentation | none | Workflow syntax plus full local gate; commands and inventory match the repository | `.github/workflows/*.yml`, `README.md`, `docs/*.md` | Build gate |

## Gate Check Commands

> Generated from the approved design and commands to be created in `package.json`. No pre-existing test commands were available.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Bootstrap | While T1 introduces React typings and T15–T22 remove file-scoped latent diagnostics | `npm run build` |
| Foundation | Before the lockfile and first test suite exist | `npm run typecheck && npm run build` |
| Quick | While authoring one isolated suite | `npm test -- <test-file>` |
| Full | After any test suite is added | `npm test` |
| Build | After phase completion and for CI/docs | `npm run check` |

---

## Execution Plan

Phases execute sequentially. Every task completes its gate and atomic commit before the next task starts.

### Phase 1: Typed Bootstrap

```
T1
```

### Phase 2: Canonical Write and Input Contracts

```
T15 → T16 → T17 → T18 → T19
```

### Phase 3: Canonical Read and Derived Contracts

```
T20 → T21 → T22 → T23
```

### Phase 4: Reproducible Toolchain

```
T2 → T3 → T4 → T5
```

### Phase 5: Behavioral Safety Net

```
T6 → T7 → T8 → T9 → T10 → T11
```

### Phase 6: Automation and Handoff

```
T12 → T13 → T14
```

---

## Task Breakdown

### T1: Modernize the package manifest

**What**: Declare the approved Node/npm engines, scripts, Vite 8 toolchain, test dependencies and minimal runtime dependency set.
**Where**: `package.json`
**Depends on**: None
**Reuses**: Existing `dev`, `build` and `preview` scripts
**Requirement**: BASE-01, BASE-05, BASE-06, BASE-08, BASE-09
**Status**: Complete

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [x] `packageManager` declares the npm 11 version used to resolve the lockfile.
- [x] `engines` restricts Node to major 24 and npm to major 11.
- [x] `typecheck`, `test`, `test:watch`, `audit:prod` and `check` scripts match the approved design.
- [x] Vite 8, plugin React 6, Vitest 5, jsdom 29.1 and Testing Library dependencies are declared as dev dependencies.
- [x] All packages named by BASE-05 and BASE-06 are absent; Vite exists only in dev dependencies.
- [x] Bootstrap build introduces the React typings and records the resulting 49 latent TypeScript diagnostics across 10 consumer files for T15–T23.
- [x] Bootstrap gate passes: `npm run build`.

**Tests**: none — manifest/config layer
**Gate**: Bootstrap — `npm run build`
**Commit**: `build(deps): modernize package manifest`

---

### T15: Align NewFindingModal with the Finding contract

**What**: Replace legacy origin values with the canonical `Finding.origem` union and keep submission type-safe without casts.
**Where**: `src/components/modals/NewFindingModal.tsx`
**Depends on**: T1
**Reuses**: `Finding.origem` and `RadarContext.addFinding`
**Requirement**: BASE-35
**Status**: Complete

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [x] Origin state and every select option use only `Entrevista`, `Processo`, `Fonte externa` or `Observação direta`.
- [x] The change handler narrows input to the canonical union without `as`, `any` or another cast.
- [x] Bootstrap gate passes: `npm run build`.
- [x] The complete `npm run typecheck` output contains no diagnostic for `src/components/modals/NewFindingModal.tsx`; unrelated diagnostics remain visible for subsequent tasks.

**Tests**: none — legacy React consumer contract layer
**Gate**: Bootstrap — `npm run build`
**Commit**: `fix(types): align finding origin contract`

---

### T16: Build a canonical Organization payload

**What**: Complete the organization payload and its nested records with the existing canonical field names, unions and ownership IDs.
**Where**: `src/components/modals/NewOrganizationModal.tsx`
**Depends on**: T15
**Reuses**: `Organization`, `TechStackItem`, `ProcessMap`, `Interviewee` and `INITIAL_ORGANIZACOES` shapes
**Requirement**: BASE-36

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] The submitted organization includes canonical `id`, `dataInclusao`, `quantidadeUnidades`, a valid `statusPesquisa` and a complete `operationsGapScore`.
- [ ] The stack item includes `finalidade`; the process includes `organizacaoId`, `inicioProcesso`, `resultadoEsperado`, `volumeEstimado`, `clientesAfetados`, `ferramentas`, `dependenciasExternas` and `observacoes`.
- [ ] The interviewee includes the same `organizacaoId`, a valid `HierarchyProfile` and `tempoFuncao`.
- [ ] Payload construction introduces no `as`, `any` or other cast and does not change `src/types/radar.ts`.
- [ ] Bootstrap gate passes: `npm run build`.
- [ ] The complete `npm run typecheck` output contains no diagnostic for `src/components/modals/NewOrganizationModal.tsx`; unrelated diagnostics remain visible for subsequent tasks.

**Tests**: none — legacy React consumer contract layer
**Gate**: Bootstrap — `npm run build`
**Commit**: `fix(types): complete organization payload`

---

### T17: Align market-source inputs with canonical unions

**What**: Use the existing market-source category and reliability values in both source-creation surfaces.
**Where**: `src/components/views/{FontesEMercadoView,SourcesView}.tsx`
**Depends on**: T16
**Reuses**: `MarketSource.categoria`, `MarketSource.confiabilidade` and `RadarContext.addSource`
**Requirement**: BASE-37

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] Both views submit only categories declared by `MarketSource`, using `regulação` instead of the legacy `regulamentacao` and canonical values instead of `mercado` or `censo`.
- [ ] Both views submit title-cased reliability, including `Alta` instead of `alta`.
- [ ] State and handlers use canonical unions without `as`, `any` or another cast.
- [ ] Bootstrap gate passes: `npm run build`.
- [ ] The complete `npm run typecheck` output contains no diagnostic for `src/components/views/FontesEMercadoView.tsx` or `src/components/views/SourcesView.tsx`; T18 retains ownership of the canonical competitor contract across both competitor surfaces.

**Tests**: none — legacy React consumer contract layer
**Gate**: Bootstrap — `npm run build`
**Commit**: `fix(types): align market source contracts`

---

### T18: Align competitor inputs and rendering

**What**: Complete competitor payloads and replace the legacy `pontosFracos` alias with canonical `limitacoes` in both competitor surfaces.
**Where**: `src/components/views/{CompetitorsView,FontesEMercadoView}.tsx`
**Depends on**: T17
**Reuses**: `Competitor`, `INITIAL_CONCORRENTES` and `RadarContext.addCompetitor`
**Requirement**: BASE-38

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] Model state and submitted values use only `SaaS`, `Sob consulta`, `Por usuário` or `Freemium`.
- [ ] Both payloads include canonical `site`, `publico`, `funcionalidadesPrincipais`, `integracoes`, `iaPresente`, `pontosFortes`, `limitacoes` and `operationsGapObservado` fields.
- [ ] Both lists render `limitacoes`; no consumer reads or writes `pontosFracos`.
- [ ] State and handlers introduce no `as`, `any` or another cast and do not change `src/types/radar.ts`.
- [ ] Bootstrap gate passes: `npm run build`.
- [ ] The complete `npm run typecheck` output contains no diagnostic for `src/components/views/CompetitorsView.tsx` or `src/components/views/FontesEMercadoView.tsx`; unrelated diagnostics remain visible for subsequent tasks.

**Tests**: none — legacy React consumer contract layer
**Gate**: Bootstrap — `npm run build`
**Commit**: `fix(types): align competitor contracts`

---

### T19: Restore interview scope and nullability contracts

**What**: Use the canonical interview scope and prevent review-modal dereferences when no active interview exists.
**Where**: `src/components/views/InterviewsView.tsx`
**Depends on**: T18
**Reuses**: `QuestionScope`, `QuestionTargetScope`, `activeInterview` and `promoteQuestion`
**Requirement**: BASE-39

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] Interview-local emergent questions use the canonical `entrevista` scope.
- [ ] `promoteQuestion` is called only for `organizacao`, `subvertical`, `vertical` or `global` targets.
- [ ] The review modal renders only with a non-null active interview, and every dereference is protected by that narrowing.
- [ ] Scope handling introduces no `as`, `any` or another cast and does not change `src/types/radar.ts`.
- [ ] Bootstrap gate passes: `npm run build`.
- [ ] The complete `npm run typecheck` output contains no diagnostic for `src/components/views/InterviewsView.tsx`; unrelated diagnostics remain visible for subsequent tasks.

**Tests**: none — legacy React consumer contract layer
**Gate**: Bootstrap — `npm run build`
**Commit**: `fix(types): restore interview contracts`

---

### T20: Read canonical opportunity fields

**What**: Replace every legacy opportunity alias with the existing canonical fields and remove the unsupported creation-date display.
**Where**: `src/components/views/OpportunityDetailView.tsx`
**Depends on**: T19
**Reuses**: `Opportunity`, `OpportunityScoreBreakdown`, `AILeverageBreakdown`, `KillCriterion`, `Experiment` and `INITIAL_OPPORTUNITIES`
**Requirement**: BASE-40

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] The view reads `jobToBeDone`, `solucaoHipotetica`, `riscos` and `opportunityScore.operationsGap`; it does not read `dataCriacao`, `jtbd`, `hipoteseSolucao`, `riscosPrincipais` or `gap`.
- [ ] AI leverage reads `classificacao`, `extracao`, `comparacao`, `geracao` and `revisaoHumanaDisponivel` alongside `leituraNaoEstruturada`.
- [ ] Kill criteria render `observacao`; experiments render only canonical `tipo`, `hipotese`, `resultadoObservado`, `conclusao` and `data` content.
- [ ] The remediation introduces no fallback aliases, `as`, `any` or another cast and does not change `src/types/radar.ts`.
- [ ] Bootstrap gate passes: `npm run build`.
- [ ] The complete `npm run typecheck` output contains no diagnostic for `src/components/views/OpportunityDetailView.tsx`; unrelated diagnostics remain visible for subsequent tasks.

**Tests**: none — legacy React consumer contract layer
**Gate**: Bootstrap — `npm run build`
**Commit**: `fix(types): use canonical opportunity fields`

---

### T21: Handle unmeasured organization pain scores

**What**: Derive the organization maximum only from consciously measured pain occurrences.
**Where**: `src/components/views/OrganizationsView.tsx`
**Depends on**: T20
**Reuses**: `isPainScoreMeasured` and `PainOccurrence.painScore`
**Requirement**: BASE-41

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] Occurrences are narrowed with `isPainScoreMeasured` before `painScore.total` is read.
- [ ] An organization with no measured occurrence receives maximum Pain Score zero.
- [ ] Nullability handling introduces no non-null assertion, `as`, `any` or another cast.
- [ ] Bootstrap gate passes: `npm run build`.
- [ ] The complete `npm run typecheck` output contains no diagnostic for `src/components/views/OrganizationsView.tsx`; unrelated diagnostics remain visible for subsequent tasks.

**Tests**: none — legacy React consumer contract layer
**Gate**: Bootstrap — `npm run build`
**Commit**: `fix(types): handle unmeasured pain scores`

---

### T22: Respect the EvidenceLevelBadge prop contract

**What**: Remove the unsupported badge prop while preserving the evidence level rendered in the pain detail.
**Where**: `src/components/views/PainDetailView.tsx`
**Depends on**: T21
**Reuses**: `EvidenceLevelBadge` public props
**Requirement**: BASE-42

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] `EvidenceLevelBadge` receives only its declared `level` and optional `tooltip` props.
- [ ] The derived `evidenceLevel` remains displayed in the evidence-gap summary.
- [ ] The remediation introduces no `as`, `any` or another cast and does not change the badge component contract.
- [ ] Bootstrap gate passes: `npm run build`.
- [ ] The complete `npm run typecheck` output contains no diagnostic for `src/components/views/PainDetailView.tsx`; Ranking diagnostics remain visible for T23.

**Tests**: none — legacy React consumer contract layer
**Gate**: Bootstrap — `npm run build`
**Commit**: `fix(types): respect evidence badge props`

---

### T23: Derive canonical pain ranking metrics

**What**: Build the pain ranking from canonical consolidation and evidence derivations instead of undeclared `PainConsolidated` properties.
**Where**: `src/components/views/RankingView.tsx`
**Depends on**: T22
**Reuses**: `calculatePainConsolidation`, `evaluateEvidenceLevel`, `PainDetailView` evidence derivation and RadarContext collections
**Requirement**: BASE-43

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] Each pain is paired with `calculatePainConsolidation` output using its vertical organizations, occurrences, findings and interviews.
- [ ] Each row derives Evidence Level from reviewed findings using the same organization, external-source, economic-spending and commercial-commitment signals as `PainDetailView`.
- [ ] Rows sort by `incidenciaPercent` descending and then `media` descending.
- [ ] The UI renders canonical `orgsComDor`, `totalAmostraInvestigada`, `amostraLimitada`, `media` and derived Evidence Level values; no undeclared `PainConsolidated` metric is read.
- [ ] The remediation introduces no `as`, `any` or another cast and does not change `src/types/radar.ts`.
- [ ] Foundation gate passes: `npm run typecheck && npm run build`.

**Tests**: none — legacy React consumer contract layer
**Gate**: Foundation — `npm run typecheck && npm run build`
**Commit**: `fix(types): derive canonical pain ranking`

---

### T2: Enforce supported engines

**What**: Configure npm to reject unsupported Node/npm engines.
**Where**: `.npmrc`
**Depends on**: T23
**Reuses**: `engines` declared by T1
**Requirement**: BASE-01, BASE-04

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] Project configuration sets `engine-strict=true` and contains no registry credentials.
- [ ] Foundation gate passes with the supported local runtime.

**Tests**: none — config layer
**Gate**: Foundation — `npm run typecheck && npm run build`
**Commit**: `build(npm): enforce supported engines`

---

### T3: Pin the developer Node major

**What**: Declare Node 24 for version managers and local onboarding.
**Where**: `.nvmrc`
**Depends on**: T2
**Reuses**: Node major from `package.json`
**Requirement**: BASE-01

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] File contains only the approved Node major, `24`.
- [ ] Foundation gate passes.

**Tests**: none — config layer
**Gate**: Foundation — `npm run typecheck && npm run build`
**Commit**: `build(node): pin supported major`

---

### T4: Generate the canonical npm lockfile

**What**: Resolve the approved manifest into npm's committed deterministic dependency graph.
**Where**: `package-lock.json`
**Depends on**: T3
**Reuses**: `package.json` and `.npmrc`
**Requirement**: BASE-02, BASE-03, BASE-04, BASE-07, BASE-30

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] `npm install --package-lock-only` creates a synchronized lockfile without override flags.
- [ ] `npm ci` succeeds from the committed manifest and generated lockfile.
- [ ] A second `npm ci` leaves `package.json` and `package-lock.json` unchanged.
- [ ] Production audit exits zero at moderate severity.
- [ ] Foundation gate passes after the clean install.

**Tests**: none — lockfile/config layer
**Gate**: Foundation — `npm run typecheck && npm run build`
**Commit**: `build(deps): add canonical npm lockfile`

---

### T5: Remove the obsolete Bun lockfile

**What**: Remove the incompatible secondary lockfile so npm is the only dependency authority.
**Where**: `bun.lock`
**Depends on**: T4
**Reuses**: Canonical `package-lock.json` from T4
**Requirement**: BASE-02

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] `bun.lock` is absent and `package-lock.json` is the only tracked top-level dependency lockfile.
- [ ] `npm ci` remains successful.
- [ ] Foundation gate passes.

**Tests**: none — lockfile/config layer
**Gate**: Foundation — `npm run typecheck && npm run build`
**Commit**: `build(deps): remove obsolete bun lockfile`

---

### T6: Configure Vitest

**What**: Add the isolated Vitest 5 configuration defined by the approved design.
**Where**: `vitest.config.ts`
**Depends on**: T5
**Reuses**: Vite TypeScript transform and project source layout
**Requirement**: BASE-09, BASE-10

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] Environment is jsdom and setup points to `src/test/setup.ts`.
- [ ] Mocks are cleared and restored between tests.
- [ ] Focused tests are rejected when `CI` is set.
- [ ] Foundation gate passes before any suite is introduced.

**Tests**: none — test config layer
**Gate**: Foundation — `npm run typecheck && npm run build`
**Commit**: `test(config): configure vitest environment`

---

### T7: Establish global test isolation

**What**: Add deterministic teardown for React, timers, localStorage and browser history.
**Where**: `src/test/setup.ts`
**Depends on**: T6
**Reuses**: jsdom globals and Testing Library cleanup
**Requirement**: BASE-19, BASE-32

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] jest-dom matchers are registered for Vitest.
- [ ] Every test teardown cleans the React tree, restores real timers and clears mocks.
- [ ] Every test teardown clears localStorage and restores history to `/`.
- [ ] Foundation gate passes.

**Tests**: none — test infrastructure layer
**Gate**: Foundation — `npm run typecheck && npm run build`
**Commit**: `test(config): isolate browser test state`

---

### T8: Protect calculation contracts

**What**: Add exact branch and boundary tests for every exported calculation/evidence function.
**Where**: `src/utils/calculations.test.ts`
**Depends on**: T7
**Reuses**: `calculations.ts`, domain types and minimal typed fixtures
**Requirement**: BASE-11, BASE-34

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] Score functions prove nominal totals and lower/upper clamps.
- [ ] Pain measurement proves explicit false, missing score, valid score and legacy measured behavior.
- [ ] Consolidation proves empty, fallback denominator, investigated sample, evidence filtering, unique organizations, even/odd median and sufficiency branches.
- [ ] Organization maturity proves not-started, partial and complete thresholds.
- [ ] Evidence level proves exact H0 through H5 precedence.
- [ ] Exactly 30 calculation tests pass.

**Tests**: unit — 30 tests
**Gate**: Quick — `npm test -- src/utils/calculations.test.ts`
**Commit**: `test(domain): protect calculation contracts`

---

### T9: Protect route contracts

**What**: Add parameterized tests for every exported detail-route builder and matcher.
**Where**: `src/navigation/routeMap.test.ts`
**Depends on**: T8
**Reuses**: `ROUTES` and route helpers
**Requirement**: BASE-12, BASE-33

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] Five builders prove canonical paths and URI encoding.
- [ ] Five matchers prove valid paths, missing IDs, extra segments and unrelated paths.
- [ ] Exactly 25 route tests pass and 55 total tests pass.

**Tests**: unit — 25 new tests, 55 cumulative
**Gate**: Full — `npm test`
**Commit**: `test(routes): protect canonical paths`

---

### T10: Protect RadarContext transitions

**What**: Add black-box integration tests for pending, reviewed, discarded and reset transitions.
**Where**: `src/context/RadarContext.test.tsx`
**Depends on**: T9
**Reuses**: `RadarProvider`, `useRadar`, domain types and canonical demo data
**Requirement**: BASE-13, BASE-14, BASE-15, BASE-16

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] A pending finding changes neither existing occurrences nor consolidated evidence references.
- [ ] Promoting that finding creates or updates one matching occurrence and never duplicates its ID.
- [ ] Discarding reviewed evidence removes only its contribution from occurrences and consolidated evidence arrays.
- [ ] Reset calls `removeItem` for all ten COSMO keys, restores canonical arrays and permits effects to persist canonical state.
- [ ] Fixed system time makes generated IDs and dates deterministic.
- [ ] Exactly 4 context tests pass and 59 total tests pass.

**Tests**: integration — 4 new tests, 59 cumulative
**Gate**: Full — `npm test`
**Commit**: `test(state): protect finding lifecycle`

---

### T11: Add application smoke coverage

**What**: Render the real router/provider composition for the dashboard and unknown-route fallback.
**Where**: `src/router.test.tsx`
**Depends on**: T10
**Reuses**: `AppRouter`, real route tree and existing headings
**Requirement**: BASE-17, BASE-18, BASE-19

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] `/` renders `Painel Executivo de Investigação B2B` without an uncaught error.
- [ ] An unknown path renders `Rota não reconhecida` without an uncaught error.
- [ ] Router history does not leak between the two cases.
- [ ] Exactly 2 smoke tests pass and 61 total tests pass.

**Tests**: integration — 2 new tests, 61 cumulative
**Gate**: Build — `npm run check`
**Commit**: `test(app): add router smoke coverage`

---

### T12: Add the GitHub Actions quality gate

**What**: Add the least-privilege CI workflow for pull requests and pushes to main.
**Where**: `.github/workflows/ci.yml`
**Depends on**: T11
**Reuses**: Approved npm scripts and canonical lockfile
**Requirement**: BASE-20, BASE-21, BASE-22, BASE-23, BASE-24, BASE-31

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] Workflow triggers on pull requests targeting `main` and pushes to `main`.
- [ ] Workflow uses Node 24, npm cache, `npm ci` and separately named typecheck, test, production audit and build steps.
- [ ] Workflow declares `contents: read`, a 10-minute timeout and PR-safe concurrency cancellation.
- [ ] YAML parses and every command matches a script or valid npm command.
- [ ] Build gate passes locally.

**Tests**: none — automation config layer
**Gate**: Build — `npm run check`
**Commit**: `ci: add engineering baseline gates`

---

### T13: Rewrite onboarding documentation

**What**: Replace the AI Studio template README with accurate COSMO setup, test and readiness instructions.
**Where**: `README.md`
**Depends on**: T12
**Reuses**: Approved package scripts and local port 3000
**Requirement**: BASE-25, BASE-26, BASE-28

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] README names COSMO and the supported Node/npm majors.
- [ ] README documents `npm ci`, dev URL, typecheck, test, build and full check commands.
- [ ] README contains no unused Gemini key or environment-secret instruction.
- [ ] README labels the build ready for exploratory testing and not production-ready.
- [ ] Build gate passes.

**Tests**: none — documentation layer
**Gate**: Build — `npm run check`
**Commit**: `docs: document reproducible local workflow`

---

### T14: Correct the factual project status

**What**: Align the status report with the actual React version, routes, views and post-baseline risks.
**Where**: `docs/STATUS.md`
**Depends on**: T13
**Reuses**: Source-tree inventory, README commands and current build output
**Requirement**: BASE-27, BASE-28, BASE-29

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] Status reports React 19 and only committed route/view pairs.
- [ ] Nonexistent Evidence Matrix and Guided Journey views/routes are removed from the inventory.
- [ ] Status declares exploratory-test readiness after green gates, not production readiness.
- [ ] Bundle-size warning and absence of backend/auth remain explicit risks.
- [ ] Build gate passes with exactly 61 tests.

**Tests**: none — documentation layer
**Gate**: Build — `npm run check`
**Commit**: `docs(status): align report with codebase`

---

## Phase Execution Map

```text
T1 → T15 → T16 → T17 → T18 → T19 → T20 → T21 → T22 → T23 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → T10 → T11 → T12 → T13 → T14
```

Execution is strictly sequential. Dependencies cross phase boundaries from T1 to T15, T19 to T20, T23 to T2, T5 to T6 and T11 to T12.

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1 | One manifest file | ✅ Granular |
| T15 | One finding modal | ✅ Granular |
| T16 | One organization modal | ✅ Granular |
| T17 | One cohesive market-source contract across two equivalent creation surfaces | ✅ Granular |
| T18 | One cohesive competitor contract across two equivalent creation/rendering surfaces | ✅ Granular |
| T19 | One interview view | ✅ Granular |
| T20 | One opportunity detail view | ✅ Granular |
| T21 | One organizations view | ✅ Granular |
| T22 | One pain detail view | ✅ Granular |
| T23 | One ranking view | ✅ Granular |
| T2 | One npm config file | ✅ Granular |
| T3 | One runtime pin file | ✅ Granular |
| T4 | One generated lockfile | ✅ Granular |
| T5 | One obsolete lockfile deletion | ✅ Granular |
| T6 | One test config file | ✅ Granular |
| T7 | One test setup file | ✅ Granular |
| T8 | One calculation test file | ✅ Granular |
| T9 | One route test file | ✅ Granular |
| T10 | One context test file | ✅ Granular |
| T11 | One router test file | ✅ Granular |
| T12 | One workflow file | ✅ Granular |
| T13 | One README file | ✅ Granular |
| T14 | One status file | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On | Diagram Shows | Status |
| ---- | ---------- | ------------- | ------ |
| T1 | None | Chain start | ✅ Match |
| T15 | T1 | T1 → T15 | ✅ Match |
| T16 | T15 | T15 → T16 | ✅ Match |
| T17 | T16 | T16 → T17 | ✅ Match |
| T18 | T17 | T17 → T18 | ✅ Match |
| T19 | T18 | T18 → T19 | ✅ Match |
| T20 | T19 | T19 → T20 | ✅ Match |
| T21 | T20 | T20 → T21 | ✅ Match |
| T22 | T21 | T21 → T22 | ✅ Match |
| T23 | T22 | T22 → T23 | ✅ Match |
| T2 | T23 | T23 → T2 | ✅ Match |
| T3 | T2 | T2 → T3 | ✅ Match |
| T4 | T3 | T3 → T4 | ✅ Match |
| T5 | T4 | T4 → T5 | ✅ Match |
| T6 | T5 | T5 → T6 | ✅ Match |
| T7 | T6 | T6 → T7 | ✅ Match |
| T8 | T7 | T7 → T8 | ✅ Match |
| T9 | T8 | T8 → T9 | ✅ Match |
| T10 | T9 | T9 → T10 | ✅ Match |
| T11 | T10 | T10 → T11 | ✅ Match |
| T12 | T11 | T11 → T12 | ✅ Match |
| T13 | T12 | T12 → T13 | ✅ Match |
| T14 | T13 | T13 → T14 | ✅ Match |

---

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1 | Manifest | none | none | ✅ OK |
| T15 | Legacy finding modal contract | none | none | ✅ OK |
| T16 | Legacy organization modal contract | none | none | ✅ OK |
| T17 | Legacy market-source view contracts | none | none | ✅ OK |
| T18 | Legacy competitor view contracts | none | none | ✅ OK |
| T19 | Legacy interview view contract | none | none | ✅ OK |
| T20 | Legacy opportunity detail contract | none | none | ✅ OK |
| T21 | Legacy organization-list nullability | none | none | ✅ OK |
| T22 | Legacy pain-detail prop contract | none | none | ✅ OK |
| T23 | Legacy pain-ranking derivation | none | none | ✅ OK |
| T2 | npm config | none | none | ✅ OK |
| T3 | Runtime config | none | none | ✅ OK |
| T4 | Lockfile | none | none | ✅ OK |
| T5 | Lockfile | none | none | ✅ OK |
| T6 | Test config | none | none | ✅ OK |
| T7 | Test infrastructure | none | none | ✅ OK |
| T8 | Calculation contract tests | unit | unit, co-located | ✅ OK |
| T9 | Route contract tests | unit | unit, co-located | ✅ OK |
| T10 | Provider contract tests | integration | integration, co-located | ✅ OK |
| T11 | Router/shell contract tests | integration | integration, co-located | ✅ OK |
| T12 | CI config | none | none | ✅ OK |
| T13 | Documentation | none | none | ✅ OK |
| T14 | Documentation | none | none | ✅ OK |

---

## Requirement Coverage

| Requirement Range | Tasks | Status |
| ----------------- | ----- | ------ |
| BASE-01–BASE-04 | T1–T4 | Mapped |
| BASE-05–BASE-08 | T1, T4 | Mapped |
| BASE-09–BASE-10 | T1, T6 | Mapped |
| BASE-11, BASE-34 | T8 | Mapped |
| BASE-12, BASE-33 | T9 | Mapped |
| BASE-13–BASE-16 | T10 | Mapped |
| BASE-17–BASE-19 | T7, T11 | Mapped |
| BASE-20–BASE-24, BASE-31 | T12 | Mapped |
| BASE-25–BASE-26 | T13 | Mapped |
| BASE-27–BASE-29 | T13, T14 | Mapped |
| BASE-30, BASE-32 | T4, T7 | Mapped |
| BASE-35 | T15 | Mapped |
| BASE-36 | T16 | Mapped |
| BASE-37 | T17 | Mapped |
| BASE-38 | T18 | Mapped |
| BASE-39 | T19 | Mapped |
| BASE-40 | T20 | Mapped |
| BASE-41 | T21 | Mapped |
| BASE-42 | T22 | Mapped |
| BASE-43 | T23 | Mapped |

**Coverage:** 43 total, 43 mapped, 0 unmapped.
