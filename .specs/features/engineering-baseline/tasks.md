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
| CI and documentation | none | Workflow syntax plus full local gate; commands and inventory match the repository | `.github/workflows/*.yml`, `README.md`, `docs/*.md` | Build gate |

## Gate Check Commands

> Generated from the approved design and commands to be created in `package.json`. No pre-existing test commands were available.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Foundation | Before the lockfile and first test suite exist | `npm run typecheck && npm run build` |
| Quick | While authoring one isolated suite | `npm test -- <test-file>` |
| Full | After any test suite is added | `npm test` |
| Build | After phase completion and for CI/docs | `npm run check` |

---

## Execution Plan

Phases execute sequentially. Every task completes its gate and atomic commit before the next task starts.

### Phase 1: Reproducible Toolchain

```
T1 → T2 → T3 → T4 → T5
```

### Phase 2: Behavioral Safety Net

```
T6 → T7 → T8 → T9 → T10 → T11
```

### Phase 3: Automation and Handoff

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

**Tools**:

- MCP: NONE
- Skill: `tlc-spec-driven`

**Done when**:

- [ ] `packageManager` declares the npm 11 version used to resolve the lockfile.
- [ ] `engines` restricts Node to major 24 and npm to major 11.
- [ ] `typecheck`, `test`, `test:watch`, `audit:prod` and `check` scripts match the approved design.
- [ ] Vite 8, plugin React 6, Vitest 5, jsdom 29.1 and Testing Library dependencies are declared as dev dependencies.
- [ ] All packages named by BASE-05 and BASE-06 are absent; Vite exists only in dev dependencies.
- [ ] Foundation gate passes after installing the declared tree without generating a lockfile.

**Tests**: none — manifest/config layer
**Gate**: Foundation — `npm run typecheck && npm run build`
**Commit**: `build(deps): modernize package manifest`

---

### T2: Enforce supported engines

**What**: Configure npm to reject unsupported Node/npm engines.
**Where**: `.npmrc`
**Depends on**: T1
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
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → T10 → T11 → T12 → T13 → T14
```

Execution is strictly sequential. Dependencies cross phase boundaries only from T5 to T6 and from T11 to T12.

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1 | One manifest file | ✅ Granular |
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
| T2 | T1 | T1 → T2 | ✅ Match |
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

**Coverage:** 34 total, 34 mapped, 0 unmapped.
