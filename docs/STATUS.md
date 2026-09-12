# Relatório de Status do Projeto — Radar de Oportunidades & Framework COSMO

---

## 1. Visão Geral do Status Atual

O **Radar de Oportunidades & Validação Empírica** está com sua arquitetura frontend totalmente funcional e alinhada às regras metodológicas do **Framework COSMO**.

A aplicação roda em **React 18 + Vite + TypeScript + Tailwind CSS v4**, utilizando `@tanstack/react-router` para roteamento e `RadarContext` para gerenciamento de estado persistente via `localStorage`.

---

## 2. Etapas de Desenvolvimento Concluídas (Marco 5B)

* **Etapa 5B.2 — Resgate de Dados Omitidos na OpportunityDetailView**:
  * Resgatados e exibidos no Dossiê da Oportunidade: `subverticalId`, `monetizacaoHipotetica`, `concorrentesMapeados`, `diferenciacao` e `integracoesNecessarias`.

* **Etapa 5B.3 — Conexão com Dores Consolidadas, Evidence Levels e Contraprovas**:
  * Integração direta com as dores que sustentam a oportunidade (`DOR-CONT-001`, `DOR-CONT-002`).
  * Exibição de amostras investigadas, percentuais de sustentação e intensidade observada.
  * Painel de Contraprovas & Limites da Hipótese (`ACH-005`), exibindo fala original imutável, fala revisada e interpretação analítica.

* **Etapa 5B.3.1 — Auditoria e Harmonização Factual entre Telas**:
  * Harmonização dos dados de organizações (`ORG-CONT-001`, `ORG-CONT-002`, `ORG-CONT-003`).
  * Garantida a regra: `Mesma Organização + Mesma Dor` gera exatamente os mesmos dados na `PainDetailView` e na `OpportunityDetailView`.

* **Etapa 5B.4 — Transparência Metodológica do Opportunity Score e Confidence Score**:
  * Adição de rótulos explícitos `Avaliação atribuída` e `Confiança atribuída`.
  * Inclusão de caixas metodológicas esclarecendo que o Opportunity Score (0–100) é uma avaliação registrada e não um cálculo automático em tempo real, e que o Nível de Confiança (%) não é uma probabilidade estatística.

* **Etapa 5B.4.1 — Consistência Metodológica e Transparência no Ranking**:
  * Correção textual da escala de Evidence Level para `H0–H5`.
  * Atualização da nota do topo da `RankingView` esclarecendo o critério real de ordenação (`Opportunity Score` DESC, `Confidence Score` DESC) e que o Evidence Level serve como contexto de maturidade sem alterar matematicamente a posição.

* **Etapa 5B.5 — Auditoria Final de UX, Hierarquia e Coerência**:
  * Mapeamento completo dos 11 blocos do Dossiê da Oportunidade.
  * Proposta de arquitetura visual refinada em 6 macroblocos para fases futuras.

---

## 3. Inventário de Componentes e Visões Principais

| Visão | Rota / Arquivo | Função Principal |
| :--- | :--- | :--- |
| **Dossiê da Oportunidade** | `/oportunidades/$opportunityId`<br>`src/components/views/OpportunityDetailView.tsx` | Tese estratégica, conexão com dores, contraprovas, scores e validações. |
| **Dossiê da Dor** | `/dores/$painId`<br>`src/components/views/PainDetailView.tsx` | Fonte canônica para Pain Score, ocorrências por organização e mitigação. |
| **Ranking Comparativo** | `/ranking`<br>`src/components/views/RankingView.tsx` | Ordenação de oportunidades e dores consolidadas com transparência. |
| **Matriz de Evidências** | `/evidencias`<br>`src/components/views/EvidenceMatrixView.tsx` | Cruzamento de dores x organizações e rastreabilidade atômica. |
| **Dashboard Executivo** | `/`<br>`src/components/views/DashboardView.tsx` | Resumo executivo, KPIs do radar e recomendações de investigações. |
| **Dossiê da Organização** | `/organizacoes/$organizationId`<br>`src/components/views/OrganizationDetailView.tsx` | Perfil da empresa, stack, processos e ocorrências locais. |
| **Condução de Entrevistas** | `/entrevistas/conduzir`<br>`src/components/views/InterviewsView.tsx` | Roteiro de perguntas, captura rápida e extração de achados. |
| **Jornada Guiada** | `/jornada`<br>`src/components/views/GuidedJourneyView.tsx` | Navegação estruturada nos 18 passos metodológicos do PRD. |

---

## 4. Estado Factual do Benchmark Demo (`OP-CONT-001`)

* **Opportunity Score Total**: `88/100` (Mercado 17/20, Dor 23/25, Operations Gap 24/25, Economia 16/20, GTM 8/10).
* **Confidence Score**: `78%` (Confiança atribuída).
* **Evidence Level da Oportunidade**: `H4` (Evidência econômica do problema comprovada nas organizações 001 e 003).
* **Dores Vinculadas**:
  * `DOR-CONT-001`: Pain Score Mediano `23/25`, Amostra `3 orgs`, 100% favorável, Evidence Level `H3`.
  * `DOR-CONT-002`: Pain Score Mediano `0/25` (não mensurada), Amostra `3 orgs`, 33% contrária/atenuante (`ACH-005`), Evidence Level `H2`.

---

## 5. Próximos Passos de Refinamento do Frontend

1. **Reorganização do Dossiê da Oportunidade em 6 Macroblocos**:
   * Posicionar a Tese Estratégica & Hipótese de Produto logo abaixo do Hero para leitura fluida antes das evidências de campo.
2. **Unificação da Área de Validação**:
   * Agrupar Próxima Evidência, Kill Criteria e Experimentos em uma seção dedicada de governança de testes.
3. **Condensação da Evidence Chain**:
   * Compactar o explorador atômico de achados no final do dossiê.
