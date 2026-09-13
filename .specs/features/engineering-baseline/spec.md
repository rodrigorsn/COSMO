# Engineering Baseline Specification

## Problem Statement

O COSMO já funciona como protótipo exploratório, mas ainda não possui instalação reproduzível, testes automatizados ou integração contínua. O repositório também mantém dependências sem uso, um lockfile incompatível com o runtime instalado e documentação divergente do código. Ao introduzir `@types/react`, o bootstrap da baseline revelou 49 diagnósticos TypeScript latentes em 10 arquivos consumidores. A baseline transforma o protótipo atual em uma base de engenharia segura para evolução e em um produto testável por terceiros.

## Goals

- [ ] Tornar a instalação determinística em checkout limpo com um único gerenciador de pacotes.
- [ ] Proteger os cálculos, rotas e transições de estado críticas com testes automatizados executados sem modo interativo.
- [ ] Bloquear regressões em pull requests por meio de CI com typecheck, testes, build e auditoria de dependências.
- [ ] Eliminar dependências diretas comprovadamente sem uso e vulnerabilidades conhecidas de produção com severidade moderada ou superior.
- [ ] Documentar com precisão como instalar, executar, validar e testar o produto localmente.
- [ ] Restaurar os contratos tipados canônicos revelados pelo bootstrap sem ampliar `src/types/radar.ts`, criar aliases legados ou usar casts para silenciar incompatibilidades.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Backend, banco de dados e autenticação | Exigem decisões de produto e arquitetura próprias; a baseline preserva o protótipo local-first. |
| Deploy público e ambiente de staging | Será especificado após a baseline estar protegida por CI. |
| Reorganização visual do Dossiê da Oportunidade | É uma entrega de UX separada, posterior à baseline. |
| Code splitting e redução do bundle principal | O aviso atual será registrado como risco e tratado em uma feature de performance isolada. |
| Cobertura exaustiva de todas as 16 views | Esta entrega estabelece o harness e cobre invariantes críticos; expansão por feature será incremental. |
| Alteração das regras metodológicas COSMO ou dos dados demo | A baseline não muda comportamento de produto nem conteúdo canônico. |
| Ampliação de `src/types/radar.ts` para acomodar propriedades legadas das views | Os contratos globais e os dados canônicos já definem os nomes e unions corretos; os consumidores serão alinhados a eles. |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Gerenciador de pacotes canônico | npm 11 com `package-lock.json`; remover `bun.lock` | O README já usa npm, `npm ci` oferece instalação congelada e o `bun.lock` atual não é aceito pelo Bun instalado. | y |
| Runtime suportado | Node.js 24 LTS e npm 11, declarados no repositório e usados na CI | É uma linha LTS compatível com o stack moderno e com Vitest 5. | y |
| Framework de testes | Vitest 5, React Testing Library e jsdom | Integra-se nativamente ao Vite e testa componentes pelo comportamento observável. | y |
| Profundidade inicial dos testes | Unidade para cálculo/rotas; integração para `RadarContext`; smoke para shell e fallback de rota | Protege as invariantes de maior risco sem fingir cobertura total do frontend. | y |
| Política de auditoria | Zero vulnerabilidades de produção com severidade moderada, alta ou crítica | O risco conhecido está em dependência sem uso e deve ser removido, não mascarado. | y |
| Compatibilidade funcional | Nenhuma mudança intencional no comportamento visível ou nos dados demo | A entrega é infraestrutura de qualidade, não uma alteração de produto. | y |
| Ritmo de discussão | Decisões técnicas ficam a cargo do agente dentro do padrão world-class definido pelo projeto | O usuário autorizou seguir com TLC e delegou decisões técnicas evidentes. | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Instalação reproduzível ⭐ MVP

**User Story**: As a contributor, I want a single deterministic toolchain so that the same revision installs identically locally and in CI.

**Why P1**: Sem uma árvore de dependências reproduzível, qualquer resultado de teste ou build é contestável.

**Acceptance Criteria**:

1. The repository SHALL declare Node.js 24 and npm 11 as its supported toolchain. `[BASE-01]`
2. The repository SHALL contain exactly one top-level dependency lockfile, `package-lock.json`. `[BASE-02]`
3. WHEN dependencies are installed from a clean checkout THEN `npm ci` SHALL complete without changing `package.json` or `package-lock.json`. `[BASE-03]`
4. IF the manifest and lockfile diverge THEN `npm ci` SHALL exit with a non-zero status. `[BASE-04]`

**Independent Test**: Em um checkout limpo, executar `npm ci` e confirmar sucesso e ausência de diff nos dois manifests.

---

### P1: Dependências mínimas e auditáveis ⭐ MVP

**User Story**: As a maintainer, I want every direct dependency to have a demonstrated runtime or tooling purpose so that attack surface and maintenance cost remain bounded.

**Why P1**: O risco moderado conhecido entra por `express`, que não é importado pelo produto.

**Acceptance Criteria**:

1. The production manifest SHALL exclude `express`, `dotenv` and `@google/genai` while the application contains no imports or runtime usage of those packages. `[BASE-05]`
2. The development manifest SHALL exclude `@types/express`, `tsx`, direct `esbuild` and `autoprefixer` while no project command or configuration consumes them. `[BASE-06]`
3. WHEN `npm audit --omit=dev --audit-level=moderate` runs against the committed lockfile THEN it SHALL exit with status zero. `[BASE-07]`
4. IF removing a dependency causes typecheck, tests or build to fail THEN the dependency SHALL remain and its verified usage SHALL be documented in the pull request. `[BASE-08]`

**Independent Test**: Instalar do zero, executar auditoria, typecheck, testes e build, e verificar a ausência dos pacotes removidos na árvore direta.

---

### P1: Harness de testes confiável ⭐ MVP

**User Story**: As a product engineer, I want automated tests around the highest-risk invariants so that future changes fail before corrupting the methodology or navigation.

**Why P1**: Hoje nenhuma regressão comportamental é detectada automaticamente.

**Acceptance Criteria**:

1. WHEN `npm test` runs THEN Vitest SHALL execute once in non-interactive mode and exit non-zero if any test fails. `[BASE-09]`
2. The test configuration SHALL use jsdom for React tests, restore mocks between tests and reject focused tests in CI. `[BASE-10]`
3. The calculation test suite SHALL exercise every decision branch currently exposed by `calculatePainScore`, `calculateOGS`, `calculateOpportunityScore`, `isPainScoreMeasured`, `calculatePainConsolidation`, `calculateOrgMaturity` and `evaluateEvidenceLevel`. `[BASE-11]`
4. The route-map test suite SHALL cover every exported detail-route builder and matcher with valid IDs, unrelated paths and near-match paths. `[BASE-12]`
5. WHEN a finding remains `pendente` THEN the `RadarContext` integration suite SHALL prove it does not create or alter a pain occurrence. `[BASE-13]`
6. WHEN a pending finding becomes `revisado` with the required links THEN the `RadarContext` integration suite SHALL prove the corresponding occurrence is created or updated exactly once. `[BASE-14]`
7. WHEN a reviewed finding becomes `descartado` THEN the `RadarContext` integration suite SHALL prove its prior contribution is removed without deleting unrelated evidence. `[BASE-15]`
8. WHEN demo state is reset THEN the `RadarContext` integration suite SHALL prove all ten COSMO storage keys receive a remove operation and the exposed state returns to canonical demo data before persistence effects write the canonical state again. `[BASE-16]`
9. WHEN the application shell is rendered at `/` THEN the smoke suite SHALL expose the heading `Painel Executivo de Investigação B2B` without an uncaught error. `[BASE-17]`
10. WHEN an unknown path is rendered THEN the smoke suite SHALL expose the heading `Rota não reconhecida` without an uncaught error. `[BASE-18]`
11. WHILE tests execute, the test harness SHALL isolate `localStorage`, DOM state, mocks and router history between cases. `[BASE-19]`

**Independent Test**: Executar `npm test` duas vezes consecutivas e obter o mesmo conjunto de testes aprovados sem estado residual.

---

### P1: Contratos TypeScript canônicos ⭐ MVP

**User Story**: As a maintainer, I want every legacy view to consume the canonical domain contracts so that enabling React typings produces a trustworthy typecheck instead of hidden structural drift.

**Why P1**: `@types/react` exposed 49 latent diagnostics across 10 files. The baseline cannot establish a meaningful type gate while views submit invalid unions, omit required fields or read properties that do not exist.

**Acceptance Criteria**:

1. WHEN `NewFindingModal` submits a finding THEN its origin SHALL be one of `Entrevista`, `Processo`, `Fonte externa` or `Observação direta`, with no cast and no legacy origin label stored. `[BASE-35]`
2. WHEN `NewOrganizationModal` submits an organization THEN the object and its nested stack, process and interview records SHALL satisfy the existing `Organization`, `TechStackItem`, `ProcessMap` and `Interviewee` contracts with canonical statuses, field names and required ownership IDs, without changing `src/types/radar.ts` or using casts. `[BASE-36]`
3. WHEN `FontesEMercadoView` or `SourcesView` creates a market source THEN category and reliability SHALL use the existing `MarketSource` unions, including `regulação` and title-cased reliability, without casts. `[BASE-37]`
4. WHEN `CompetitorsView` or `FontesEMercadoView` creates or renders a competitor THEN it SHALL use the existing `Competitor` contract: canonical `modelo`, all required fields and `limitacoes` in place of the legacy `pontosFracos`, without casts. `[BASE-38]`
5. WHEN `InterviewsView` creates an interview-scoped emergent question THEN it SHALL use `entrevista`; promotion SHALL remain restricted to `QuestionTargetScope`; and the review modal SHALL dereference an interview only after a non-null guard, without casts. `[BASE-39]`
6. The opportunity detail SHALL read only canonical `Opportunity` fields: `jobToBeDone`, `solucaoHipotetica`, `riscos`, `opportunityScore.operationsGap`, the six declared `aiLeverage` dimensions, `KillCriterion.observacao`, and `Experiment` fields `tipo`, `hipotese`, `resultadoObservado` and `conclusao`; it SHALL not fabricate a creation date or read legacy aliases. `[BASE-40]`
7. WHEN `OrganizationsView` calculates the maximum Pain Score THEN it SHALL include only occurrences accepted by `isPainScoreMeasured` and SHALL return zero when no measured occurrence exists. `[BASE-41]`
8. WHEN `PainDetailView` renders `EvidenceLevelBadge` THEN it SHALL pass only props declared by the component contract and preserve the evidence level shown. `[BASE-42]`
9. WHEN `RankingView` ranks pains THEN it SHALL derive `PainConsolidationStats` with `calculatePainConsolidation`, derive the Evidence Level with `evaluateEvidenceLevel`, sort by canonical `incidenciaPercent` then `media`, and render canonical sample and occurrence counts without extending `PainConsolidated`. `[BASE-43]`

**Independent Test**: Após T1 introduzir as tipagens React, executar o bootstrap após cada reparo e confirmar que o output completo não contém diagnósticos do arquivo em escopo; ao final, `npm run typecheck && npm run build` deve passar sem casts novos e sem alteração de `src/types/radar.ts`.

---

### P1: Gates automáticos no GitHub ⭐ MVP

**User Story**: As a repository owner, I want every proposed change validated automatically so that `main` has an objective quality signal.

**Why P1**: A baseline só é efetiva quando seus checks são obrigatoriamente repetíveis fora da máquina local.

**Acceptance Criteria**:

1. WHEN a pull request targets `main` or a commit reaches `main` THEN GitHub Actions SHALL run the baseline workflow on Node.js 24. `[BASE-20]`
2. The CI workflow SHALL install with `npm ci` and run typecheck, tests, production dependency audit and build as explicit gates. `[BASE-21]`
3. IF any gate exits non-zero THEN the workflow SHALL fail and identify the failed gate by step name. `[BASE-22]`
4. The CI workflow SHALL use read-only repository contents permission and SHALL declare a maximum execution time of 10 minutes. `[BASE-23]`
5. WHEN dependency caching is enabled THEN the cache SHALL be keyed from the committed npm lockfile through the official Node setup action. `[BASE-24]`

**Independent Test**: Abrir o PR da baseline e observar todos os passos do workflow executarem; um teste mutante proposital deve tornar o job vermelho antes de ser revertido.

---

### P1: Documentação factual e marco testável ⭐ MVP

**User Story**: As a tester, I want accurate startup and validation instructions so that I can exercise the product without tribal knowledge.

**Why P1**: O README exige uma chave Gemini que o código não consome e o status lista versão, views e rotas inexistentes.

**Acceptance Criteria**:

1. The README SHALL document the supported toolchain, `npm ci`, `npm run dev`, `npm run typecheck`, `npm test`, `npm run build` and the local URL `http://localhost:3000`. `[BASE-25]`
2. The README SHALL not require secrets or environment variables that the current application does not consume. `[BASE-26]`
3. The project status document SHALL report React 19 and SHALL list only routes and views present in the committed source tree. `[BASE-27]`
4. WHEN all local baseline gates pass THEN the repository SHALL label the current build as ready for exploratory product testing, not production-ready. `[BASE-28]`
5. The status document SHALL record the remaining bundle-size warning and absence of backend/auth as explicit post-baseline risks. `[BASE-29]`

**Independent Test**: Um novo colaborador segue apenas o README, abre o dashboard em `http://localhost:3000` e executa todos os gates sem instruções externas.

---

## Edge Cases

- IF the dependency tree cannot be reproduced from the committed lockfile THEN the baseline SHALL fail before tests or build are trusted. `[BASE-30]`
- IF the audit service is unavailable in CI THEN the audit step SHALL fail visibly rather than report a false pass. `[BASE-31]`
- IF a test leaves COSMO keys in `localStorage` THEN the following test SHALL start from a cleared storage state. `[BASE-32]`
- IF a route differs only by an extra segment, missing ID or similar prefix THEN its matcher SHALL return false. `[BASE-33]`
- IF a calculation receives a documented unmeasured or incomplete domain state THEN its test SHALL assert the exact current fallback result. `[BASE-34]`

---

## Implicit-Requirement Dimensions

| Dimension | Resolution |
| --------- | ---------- |
| Input validation & bounds | Requirements BASE-11, BASE-12, BASE-33 through BASE-39 and BASE-41 cover calculation, route and typed-input boundaries in scope. |
| Failure / partial-failure states | Requirements BASE-04, BASE-08, BASE-22, BASE-30 and BASE-31 require explicit hard failures. |
| Idempotency / retry / duplicate handling | Requirements BASE-03, BASE-14 and the repeatability test require deterministic installs and exactly-once state contribution. |
| Auth boundaries & rate limits | N/A because this baseline adds no backend, authenticated operation or externally callable API. |
| Concurrency / ordering | CI gates may run as separate steps, but no shared mutable remote state is introduced; runtime concurrency is N/A for this scope. |
| Data lifecycle / expiry | Requirements BASE-16, BASE-19 and BASE-32 define cleanup for demo and test state; persistent business-data expiry is N/A because storage behavior is unchanged. |
| Observability | Requirements BASE-22 and BASE-31 require named, visible CI failures; production telemetry is N/A because no deployed runtime is introduced. |
| External-dependency failure | Requirements BASE-30 and BASE-31 cover npm registry/audit failure without false success. |
| State-transition integrity | Requirements BASE-13 through BASE-16 and BASE-39 protect pending, reviewed, discarded, reset and question-promotion transitions. |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| BASE-01 | P1: Instalação reproduzível | Execute | In Progress (T1, T2 complete) |
| BASE-02 | P1: Instalação reproduzível | Tasks | In Tasks |
| BASE-03 | P1: Instalação reproduzível | Tasks | In Tasks |
| BASE-04 | P1: Instalação reproduzível | Execute | In Progress (T2 complete; lockfile validation remains in T4) |
| BASE-05 | P1: Dependências mínimas | Execute | Implemented (T1) |
| BASE-06 | P1: Dependências mínimas | Execute | Implemented (T1) |
| BASE-07 | P1: Dependências mínimas | Tasks | In Tasks |
| BASE-08 | P1: Dependências mínimas | Execute | Implemented (T1, T15–T23) |
| BASE-09 | P1: Harness de testes | Execute | In Progress (T1 complete) |
| BASE-10 | P1: Harness de testes | Tasks | In Tasks |
| BASE-11 | P1: Harness de testes | Tasks | In Tasks |
| BASE-12 | P1: Harness de testes | Tasks | In Tasks |
| BASE-13 | P1: Harness de testes | Tasks | In Tasks |
| BASE-14 | P1: Harness de testes | Tasks | In Tasks |
| BASE-15 | P1: Harness de testes | Tasks | In Tasks |
| BASE-16 | P1: Harness de testes | Tasks | In Tasks |
| BASE-17 | P1: Harness de testes | Tasks | In Tasks |
| BASE-18 | P1: Harness de testes | Tasks | In Tasks |
| BASE-19 | P1: Harness de testes | Tasks | In Tasks |
| BASE-20 | P1: Gates no GitHub | Tasks | In Tasks |
| BASE-21 | P1: Gates no GitHub | Tasks | In Tasks |
| BASE-22 | P1: Gates no GitHub | Tasks | In Tasks |
| BASE-23 | P1: Gates no GitHub | Tasks | In Tasks |
| BASE-24 | P1: Gates no GitHub | Tasks | In Tasks |
| BASE-25 | P1: Documentação e marco | Tasks | In Tasks |
| BASE-26 | P1: Documentação e marco | Tasks | In Tasks |
| BASE-27 | P1: Documentação e marco | Tasks | In Tasks |
| BASE-28 | P1: Documentação e marco | Tasks | In Tasks |
| BASE-29 | P1: Documentação e marco | Tasks | In Tasks |
| BASE-30 | Edge cases transversais | Tasks | In Tasks |
| BASE-31 | Edge cases transversais | Tasks | In Tasks |
| BASE-32 | Edge cases transversais | Tasks | In Tasks |
| BASE-33 | Edge cases transversais | Tasks | In Tasks |
| BASE-34 | Edge cases transversais | Tasks | In Tasks |
| BASE-35 | P1: Contratos TypeScript canônicos | Execute | Implemented (T15) |
| BASE-36 | P1: Contratos TypeScript canônicos | Execute | Implemented (T16) |
| BASE-37 | P1: Contratos TypeScript canônicos | Execute | Implemented (T17) |
| BASE-38 | P1: Contratos TypeScript canônicos | Execute | Implemented (T18) |
| BASE-39 | P1: Contratos TypeScript canônicos | Execute | Implemented (T19) |
| BASE-40 | P1: Contratos TypeScript canônicos | Execute | Implemented (T20) |
| BASE-41 | P1: Contratos TypeScript canônicos | Execute | Implemented (T21) |
| BASE-42 | P1: Contratos TypeScript canônicos | Execute | Implemented (T22) |
| BASE-43 | P1: Contratos TypeScript canônicos | Execute | Implemented (T23) |

**Coverage:** 43 total, 43 mapped to tasks, 0 unmapped.

---

## Success Criteria

- [ ] Um checkout limpo conclui `npm ci` sem alterar manifests ou lockfile.
- [ ] `npm run typecheck`, `npm test`, `npm run build` e a auditoria de produção passam localmente.
- [ ] Os testes automatizados cobrem as transições `pendente → revisado → descartado`, reset, cálculos exportados, rotas e smoke do shell.
- [ ] O PR da baseline recebe sinal verde do GitHub Actions em Node.js 24.
- [ ] Um tester consegue abrir e explorar o produto em `http://localhost:3000` seguindo apenas o README.
- [ ] A entrega é declarada pronta para teste exploratório e explicitamente não pronta para produção.
- [ ] `npm run typecheck` encerra sem diagnósticos após os 49 erros latentes dos 10 arquivos consumidores serem corrigidos contra os contratos canônicos existentes.
- [ ] `src/types/radar.ts` permanece inalterado e nenhum cast é introduzido para contornar os contratos.
