# Diretrizes do Projeto — Radar de Oportunidades & Framework COSMO

Este arquivo contém as regras de arquitetura, metodologias, convenções de Frontend (FE) e o histórico de etapas executadas para orientar agentes e desenvolvedores no Antigravity / AI Studio.

---

## 1. Visão Geral e Arquitetura do Projeto

* **Nome do App**: Radar de Oportunidades & Validação Empírica (Framework COSMO).
* **Stack Tecnológica**:
  * **Framework**: React 19 + Vite 8 + TypeScript
  * **Runtime**: Node 24 / npm 11 (`.nvmrc`, `engines` em `package.json`, lockfile único `package-lock.json`)
  * **Testes**: Vitest 5 + Testing Library, 61 testes cobrindo cálculos, rotas, `RadarContext` e smoke da aplicação
  * **CI**: `.github/workflows/ci.yml` roda `npm run check` em PRs para `main` e pushes a `main`
  * **Roteamento**: `@tanstack/react-router`
  * **Estilização**: Tailwind CSS v4 (`@import "tailwindcss";` no `src/index.css`)
  * **Ícones**: Exclusivamente `lucide-react`
  * **Animações**: `motion/react`
* **Gerenciamento de Estado**: `RadarContext` (`src/context/RadarContext.tsx`) consumindo os dados canônicos de `src/data/initialData.ts`.

---

## 2. Metodologia COSMO e Regras de Negócio

### Escala Canônica de Evidence Level (H0–H5)
* **H0 — Hipótese Inicial**: Sem validação de campo.
* **H1 — Evidência Anedótica**: Citações isoladas ou percepção não estruturada.
* **H2 — Incidência Qualitativa**: Problema confirmado qualitativamente em entrevistas.
* **H3 — Recorrência Quantitativa**: Problema recorrente com métricas e amostra representativa.
* **H4 — Evidência Econômica do Problema**: Problema comprovado com gasto real de recursos (pessoal, horas extras, retrabalho).
* **H5 — Compromisso Comercial**: Prova de pagamento ou contrato firmado pela solução.

> **Regra Importante**: O Evidence Level indica a maturidade da prova empírica. Ele **NÃO** altera matematicamente o Opportunity Score nem a posição do Ranking de forma automática.

---

### Indicadores da Oportunidade (Separação Conceitual dos 3 Pilares)
1. **Opportunity Score (0–100)**: Avaliação atribuída estruturada segundo o framework COSMO, composta por 5 dimensões:
   * **Mercado** (/20)
   * **Dor** (/25)
   * **Customer Operations Gap / OGS** (/25)
   * **Economia da Oportunidade** (/20)
   * **Viabilidade de GTM** (/10)
   * *Aviso Metodológico*: É um score atribuído e registrado. Não é recalculado automaticamente em tempo real pelas evidências.
2. **Confidence Score (%)**: Nível atribuído de confiança na hipótese de solução. Não é uma probabilidade estatística.
3. **Evidence Level (H0–H5)**: Nível de maturidade e tipo de prova empírica coletada no campo.

---

### Dossiê da Dor & Consistência Factual
* A `PainDetailView` é a fonte canônica para dados consolidados da Dor (Pain Score, número de clientes/colaboradores por organização, ocorrências e mitigação).
* A relação `Mesma Organização + Mesma Dor` deve obrigatoriamente produzir exatamente os mesmos dados em todas as telas (ex: `ORG-CONT-001` com `320` clientes, `15` colaboradores e Pain Score `23/25`).
* As falas originais dos entrevistados devem permanecer **imutáveis**, exibidas junto com a versão revisada e a interpretação analítica.

---

## 3. Diretrizes de Frontend e Design System

1. **Estilização com Tailwind CSS**:
   * Usar utilitários Tailwind diretamente nos componentes.
   * Não criar arquivos `.css` adicionais (apenas `src/index.css`).
   * Manter esquema de cores de alto contraste, limpo e profissional (fundo claro com suporte a temas neutros e bordas suaves).
2. **Componentização Modular**:
   * Tipos globais centralizados em `src/types/radar.ts`.
   * Telas principais em `src/components/views/`.
   * Componentes reutilizáveis em `src/components/common/` e `src/components/radar/`.
3. **Clareza & Imparcialidade de UX**:
   * **Transparência Metodológica**: Exibir explicitamente quando um valor é uma "Avaliação atribuída" ou "Confiança atribuída".
   * **Tratamento de Contraprovas**: Tratar achados contrários ou atenuantes (ex: `ACH-005`) com destaque e imparcialidade (ex: cartões em tom rosé com contexto analítico), sem apresentá-los como erros ou ocultá-los.

---

## 4. Estrutura de Arquivos Principais

```
/src
├── components/
│   ├── common/             # Badges, Tags de Simulação, Contêineres
│   ├── radar/              # Componentes específicos do Radar (Evidence Chain, Score Breakdowns)
│   └── views/              # Visões principais da aplicação (ver inventário completo em docs/STATUS.md)
│       ├── OpportunityDetailView.tsx  # Dossiê da Oportunidade (PRD Seção 43, 5B)
│       ├── PainDetailView.tsx         # Dossiê da Dor
│       ├── RankingView.tsx            # Ranking Comparativo
│       └── DashboardView.tsx          # Visão Geral
├── context/
│   └── RadarContext.tsx    # Provedor de contexto global
├── data/
│   └── initialData.ts      # Dados da massa canônica (OP-CONT-001, DOR-CONT-001, etc.)
├── types/
│   └── radar.ts            # Interfaces TypeScript da aplicação
└── routes/                 # Definição de rotas TanStack Router
```

---

## 5. Histórico das Etapas Executadas

* **Etapa 5B.2**: Resgate de dados omitidos na `OpportunityDetailView` (`subverticalId`, `monetizacaoHipotetica`, `concorrentesMapeados`, `diferenciacao`, `integracoesNecessarias`).
* **Etapa 5B.3**: Conexão da Oportunidade com o Dossiê da Dor, Evidence Levels e Contraprovas na `OpportunityDetailView`.
* **Etapa 5B.3.1**: Auditoria e harmonização factual de dados de Organizações (`ORG-CONT-001`, `ORG-CONT-002`, `ORG-CONT-003`).
* **Etapa 5B.4**: Transparência metodológica do Opportunity Score e Confidence Score na `OpportunityDetailView`.
* **Etapa 5B.4.1**: Consistência metodológica da escala `H0–H5` e transparência do Ranking na `RankingView`.
* **Etapa 5B.5**: Auditoria final de UX, hierarquia e coerência do Dossiê da Oportunidade.
* **Feature `engineering-baseline`** (`.specs/features/engineering-baseline/`): migração para npm 11/Node 24 com lockfile único, remoção de ~10 violações de contrato de tipos em consumidores React legados, suíte Vitest (61 testes), gate de CI e documentação (`README.md`, `docs/STATUS.md`) alinhada ao código real. Verificado PASS pelo Verifier do `tlc-spec-driven` (`.specs/features/engineering-baseline/validation.md`).

---

## 6. Comandos de Desenvolvimento

```bash
# Instalar dependências (instalação congelada, respeita o lockfile)
npm ci

# Rodar servidor de desenvolvimento (http://localhost:3000)
npm run dev

# Checagem de tipos TypeScript
npm run typecheck

# Suíte de testes (Vitest)
npm test

# Compilação de produção
npm run build

# Gate completo (typecheck + test + auditoria de produção + build) — o mesmo que roda no CI
npm run check
```
