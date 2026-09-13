# Engineering Baseline Design

**Spec**: `.specs/features/engineering-baseline/spec.md`
**Status**: Draft

---

## Architecture Overview

A baseline será uma camada de qualidade ao redor do produto existente. O código de produção do `RadarContext`, dos cálculos e das rotas permanecerá estruturalmente intacto. Vitest executará testes unitários e de integração em jsdom; um probe React definido apenas no teste consumirá `useRadar()` e exporá a API pública para cenários de estado. O mesmo conjunto de comandos será usado localmente e no GitHub Actions.

```mermaid
flowchart LR
    Manifest[package.json + package-lock.json] --> Install[npm ci]
    Install --> Typecheck[npm run typecheck]
    Install --> Unit[Vitest: cálculos e rotas]
    Install --> Integration[Vitest + RTL + jsdom]
    Integration --> Provider[RadarProvider / useRadar]
    Integration --> Router[AppRouter]
    Typecheck --> Build[npm run build]
    Unit --> Gate[Baseline gate]
    Integration --> Gate
    Build --> Gate
    Audit[npm audit --omit=dev] --> Gate
    Gate --> CI[GitHub Actions]
```

### Chosen Approach

**Baseline moderna com testes caixa-preta.** O toolchain migra para Vite 8 e Vitest 5. Os testes de estado usam somente `RadarProvider` e `useRadar`; não extraem reducer, storage adapter ou serviço de domínio nesta entrega.

### Rejected Alternatives

| Alternative | Why Rejected |
| ----------- | ------------ |
| Vite 6.4 mínimo com os mesmos testes | Reduz a mudança imediata, mas cria a baseline sobre uma major antiga e antecipa outra migração de toolchain. |
| Extração de reducer/domínio antes dos testes | Melhoraria a testabilidade interna, mas mistura refatoração comportamental com a criação da rede de segurança que deveria precedê-la. |

### Research Findings

- Vitest 5 exige Vite 6.4 ou superior e Node 22.12 ou superior. O Vite 6.2.3 atual não é compatível.
- Vite 8.3 e `@vitejs/plugin-react` 6 são compatíveis com Node 24 e formam o par atual do toolchain.
- jsdom 30 exige Node 24.15 ou superior, acima do Node 24.14 instalado localmente. A baseline usará jsdom 29.1, compatível com Node 24 desde a primeira release, sem bloquear a execução local.
- `npm ci` exige lockfile sincronizado e não modifica manifests. Isso sustenta o gate de reprodutibilidade.
- O GitHub recomenda `actions/setup-node` e `npm ci` para workflows Node reproduzíveis.

Fontes: documentação oficial do [Vitest](https://vitest.dev/guide/), [Vite](https://vite.dev/guide/), [npm ci](https://docs.npmjs.com/cli/commands/npm-ci/) e [GitHub Actions para Node.js](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs).

---

## Code Reuse Analysis

### Existing Components to Leverage

| Component | Location | How to Use |
| --------- | -------- | ---------- |
| API pública do radar | `src/context/RadarContext.tsx` | Montar `RadarProvider` e consumir `useRadar()` por um probe exclusivo dos testes. |
| Dados demo canônicos | `src/data/initialData.ts` | Usar IDs e valores reais como oráculo para transições e reset. |
| Tipos de domínio | `src/types/radar.ts` | Construir fixtures tipadas sem duplicar contratos. |
| Funções de cálculo | `src/utils/calculations.ts` | Testar exports diretamente com tabelas de casos de decisão e limites. |
| Mapa de rotas | `src/navigation/routeMap.ts` | Testar builders e matchers diretamente sem reproduzir padrões de URL. |
| Router real | `src/router.tsx` | Renderizar `AppRouter` nos dois smoke tests, usando as rotas reais. |
| Fallback existente | `src/components/common/UnknownRouteFallback.tsx` | Confirmar o heading observável definido na spec. |

### Integration Points

| System | Integration Method |
| ------ | ------------------ |
| npm registry | `package-lock.json`, `npm ci` e `npm audit --omit=dev --audit-level=moderate`. |
| GitHub Actions | Workflow único em `.github/workflows/ci.yml`, acionado em PRs e pushes para `main`. |
| Browser storage | jsdom `localStorage`, limpo antes e depois de cada teste. |
| Browser history | `window.history.replaceState` e navegação do router, restaurados entre smoke tests. |

---

## Components

### Canonical Toolchain Manifest

- **Purpose**: Declarar o runtime, o gerenciador, scripts e dependências diretas da baseline.
- **Location**: `package.json`, `.npmrc`, `.nvmrc`, `package-lock.json`
- **Interfaces**:
  - `npm ci` — instalação congelada.
  - `npm run typecheck` — TypeScript sem emissão.
  - `npm test` — Vitest em modo run.
  - `npm run test:watch` — execução local interativa.
  - `npm run build` — build de produção Vite.
  - `npm run check` — gate local composto por typecheck, testes, auditoria de produção e build.
- **Dependencies**: Node.js 24, npm 11, Vite 8, Vitest 5, jsdom 29.1, React Testing Library.
- **Reuses**: Scripts `dev`, `build` e `preview` existentes.

`package.json` manterá como dependências de runtime apenas bibliotecas importadas pelo produto. Vite, seus plugins, Tailwind e ferramentas de teste ficarão em `devDependencies`. `packageManager` registrará a versão npm usada para gerar o lockfile; `engines` limitará Node e npm aos majors aprovados; `.npmrc` ativará `engine-strict=true`.

### Vitest Configuration

- **Purpose**: Definir um ambiente determinístico sem acoplar a configuração de produção ao runner de testes.
- **Location**: `vitest.config.ts`
- **Interfaces**:
  - `test.environment = 'jsdom'`
  - `test.setupFiles = ['./src/test/setup.ts']`
  - `test.restoreMocks = true`
  - `test.clearMocks = true`
  - `test.allowOnly = !process.env.CI`
- **Dependencies**: Vitest 5 e jsdom 29.1.
- **Reuses**: Resolução TypeScript e transformação TSX fornecidas pelo Vite.

### Global Test Setup

- **Purpose**: Garantir isolamento de DOM, mocks, storage, relógio e history.
- **Location**: `src/test/setup.ts`
- **Interfaces**:
  - `afterEach()` — executa cleanup da Testing Library, restaura timers reais, limpa `localStorage` e retorna o history para `/`.
- **Dependencies**: `@testing-library/react`, `@testing-library/jest-dom/vitest`, Vitest.
- **Reuses**: jsdom global fornecido pelo Vitest.

### Calculation Contract Suite

- **Purpose**: Proteger todas as decisões públicas dos sete exports de cálculo/evidência.
- **Location**: `src/utils/calculations.test.ts`
- **Interfaces**: tabelas de casos com entradas tipadas e resultados exatos definidos pelo comportamento metodológico atual.
- **Dependencies**: Vitest e tipos de domínio.
- **Reuses**: `src/utils/calculations.ts`, `src/types/radar.ts` e fixtures mínimas locais.

### Route Contract Suite

- **Purpose**: Proteger builders, encoding de IDs e matchers contra paths incompletos ou semelhantes.
- **Location**: `src/navigation/routeMap.test.ts`
- **Interfaces**: casos parametrizados para as cinco famílias de detalhe.
- **Dependencies**: Vitest.
- **Reuses**: `ROUTES` e todos os helpers exportados por `routeMap.ts`.

### RadarContext Black-Box Suite

- **Purpose**: Proteger transições de achado e reset por meio da API pública do provider.
- **Location**: `src/context/RadarContext.test.tsx`
- **Interfaces**:
  - `RadarProbe` — componente de teste que chama `useRadar()` e entrega o contexto corrente ao harness.
  - `renderRadar()` — monta `RadarProvider`, aguarda effects iniciais e retorna acesso ao contexto observado.
- **Dependencies**: React Testing Library, `act`, Vitest e jsdom.
- **Reuses**: `RadarProvider`, `useRadar`, tipos e dados canônicos.

O relógio será fixado por teste para IDs e datas determinísticos. As asserções observarão arrays expostos pelo contexto, chamadas a `localStorage.removeItem` e o estado persistido depois dos effects. Nenhum símbolo de produção será exportado apenas para facilitar testes.

### Application Smoke Suite

- **Purpose**: Confirmar boot real no dashboard e fallback real de rota desconhecida.
- **Location**: `src/router.test.tsx`
- **Interfaces**:
  - Render de `AppRouter` com history em `/`.
  - Navegação para um path desconhecido e busca dos headings especificados.
- **Dependencies**: TanStack Router real, React Testing Library e jsdom.
- **Reuses**: `AppRouter`, route tree, views e provider reais.

### Continuous Integration Workflow

- **Purpose**: Repetir o gate local em ambiente limpo e tornar falhas identificáveis.
- **Location**: `.github/workflows/ci.yml`
- **Interfaces**:
  - Eventos `pull_request` para `main` e `push` em `main`.
  - Steps nomeados: install, typecheck, test, production audit e build.
- **Dependencies**: `actions/checkout@v6`, `actions/setup-node@v7`, Node.js 24 e cache npm baseado em `package-lock.json`.
- **Reuses**: Scripts do `package.json`.

O workflow terá `permissions: contents: read`, `timeout-minutes: 10` e concorrência por workflow/ref com cancelamento de execuções antigas em PRs.

### Factual Project Documentation

- **Purpose**: Permitir execução e avaliação sem conhecimento implícito.
- **Location**: `README.md`, `docs/STATUS.md`
- **Interfaces**: pré-requisitos, instalação, comandos, URL local, escopo de testabilidade e riscos remanescentes.
- **Dependencies**: Estado real do manifest, das rotas e das views.
- **Reuses**: Inventário do source tree e comandos do gate.

---

## Data Models

Nenhum modelo de produção será criado ou alterado. Fixtures de teste usarão os tipos existentes de `src/types/radar.ts` e os dados canônicos de `src/data/initialData.ts`.

---

## Error Handling Strategy

| Error Scenario | Handling | User Impact |
| -------------- | -------- | ----------- |
| Node/npm fora do major suportado | `engine-strict=true` interrompe instalação. | Mensagem explícita antes de uma árvore inconsistente. |
| Manifest e lockfile divergentes | `npm ci` encerra com status não zero. | CI bloqueia a mudança antes dos testes. |
| Dependência removida era necessária | Typecheck, testes, smoke ou build falham; a remoção é revertida e o uso é documentado. | Nenhuma regressão chega ao PR pronto. |
| Teste falha ou existe `.only` na CI | Vitest encerra com status não zero. | Step `Test` fica vermelho e identifica o gate. |
| npm audit indisponível ou encontra vulnerabilidade moderada+ de produção | O comando retorna não zero sem fallback permissivo. | Step `Production dependency audit` bloqueia o workflow. |
| Build Vite 8 quebra o plugin local de mídia | Gate de build e smoke manual do dev server falham. | A baseline não é declarada testável até correção. |

---

## Risks & Concerns

| Concern | Location (file:line) | Impact | Mitigation |
| ------- | -------------------- | ------ | ---------- |
| Provider concentra dez estados persistidos e várias transições acopladas. | `src/context/RadarContext.tsx:71` | Refatorar junto da baseline aumenta o risco de mudar regras metodológicas. | Testar a API pública sem refatoração; abrir feature própria se os testes revelarem necessidade estrutural. |
| `JSON.parse` de storage não trata conteúdo inválido. | `src/context/RadarContext.tsx:73` | Storage corrompido pode impedir o boot. | Manter fora desta baseline e registrar hardening de storage como follow-up; testes começam com storage limpo. |
| IDs usam os quatro últimos dígitos de `Date.now()`. | `src/context/RadarContext.tsx:168` | Operações no mesmo milissegundo podem colidir. | Fixar o tempo por cenário para determinismo; não alterar a regra sem uma spec de identidade. |
| Reset remove chaves e os effects persistem novamente o estado demo. | `src/context/RadarContext.tsx:414` | Uma asserção de storage vazio produziria falso negativo. | Verificar as dez remoções, o estado exposto restaurado e a persistência canônica posterior. |
| Router é singleton. | `src/router.tsx:151` | History pode vazar entre smoke tests. | Restaurar history em cada teardown e executar navegação dentro de `act`. |
| Vite aparece em dependencies e devDependencies com a mesma faixa. | `package.json:24` | Resolução e ownership do toolchain ficam ambíguos. | Manter uma única declaração em `devDependencies`. |
| O plugin de mídia veio do template AI Studio. | `vite.config.ts:8` | Uma major de Vite pode alterar tipos ou hooks usados pelo plugin. | Preservar o plugin, usar imports type-only e validar build + servidor local após a migração. |
| Não há nenhum teste ou workflow hoje. | `package.json:6` | Regressões não são detectadas fora da máquina do autor. | Introduzir as quatro suítes e o workflow definidos neste design. |
| Bundle principal excede 500 kB. | build atual | Tempo de carregamento pode degradar conforme o produto cresce. | Registrar no status e tratar code splitting em feature de performance separada. |

---

## Tech Decisions

| Decision | Choice | Rationale |
| -------- | ------ | --------- |
| Arquitetura de testes de estado | Caixa-preta via `RadarProvider` + `useRadar` | Protege comportamento real sem redesenhar o domínio durante uma entrega de baseline. |
| Build tool | Vite 8 com plugin React 6 | É a linha estável atual e evita começar a baseline sobre uma major antiga. |
| Runner | Vitest 5 em configuração separada | Mantém integração com Vite sem misturar opções de teste na configuração de produção. |
| DOM simulado | jsdom 29.1 | É compatível com Node 24.14 local; jsdom 30 exige Node 24.15+. |
| Test location | Co-locada ao módulo testado | Reduz distância entre contrato e implementação e facilita ownership futuro. |
| App smoke | Router e provider reais em jsdom | Confirma composição sem adicionar browser automation e binários nesta baseline. |
| Cobertura | Sem percentual global inicial | Um número global sobre views legadas produziria um sinal enganoso; a cobertura obrigatória é definida por AC e camada. |

---

## Requirement Mapping

| Design Element | Requirements |
| -------------- | ------------ |
| Canonical Toolchain Manifest | BASE-01–BASE-08, BASE-30 |
| Vitest Configuration + Global Test Setup | BASE-09, BASE-10, BASE-19, BASE-32 |
| Calculation Contract Suite | BASE-11, BASE-34 |
| Route Contract Suite | BASE-12, BASE-33 |
| RadarContext Black-Box Suite | BASE-13–BASE-16 |
| Application Smoke Suite | BASE-17, BASE-18 |
| Continuous Integration Workflow | BASE-20–BASE-24, BASE-31 |
| Factual Project Documentation | BASE-25–BASE-29 |
