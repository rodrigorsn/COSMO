# Documento de Requisitos de Produto (PRD) — Radar de Oportunidades & Validação Empírica (Framework COSMO)

---

## Sumário Executivo e Princípios Metodológicos

O **Radar de Oportunidades & Validação Empírica (VOR)** é uma plataforma voltada à descoberta, validação de campo e priorização rigorosa de oportunidades B2B SaaS a partir da coleta empírica de evidências de dores em organizações de mercado.

### Princípios Invioláveis do Framework COSMO
1. **Separabilidade dos 3 Pilares**:
   * **Opportunity Score (0–100)**: Avaliação atribuída estruturada da tese (Mercado 20, Dor 25, Customer Operations Gap 25, Economia 20, GTM 10). Não é uma fórmula automática nem recalculada dinamicamente pelas evidências.
   * **Confidence Score (%)**: Avaliação atribuída de confiança na hipótese de solução. Não é probabilidade estatística.
   * **Evidence Level (H0–H5)**: Nível de maturidade e tipo de prova empírica coletada no campo.
2. **Consistência Factual Absoluta**:
   * Dados da relação `Mesma Organização + Mesma Dor` obrigatoriamente idênticos em todas as visões (`PainDetailView`, `OpportunityDetailView`, `OrganizationsView`).
   * A `PainDetailView` é a fonte canônica para dados de ocorrências, Pain Score e mitigações.
3. **Preservação da Fala Original Imutável**:
   * As citações literais dos entrevistados são imutáveis e separadas visualmente das interpretações analíticas do pesquisador.
4. **Imparcialidade com Contraprovas**:
   * Evidências contrárias ou atenuantes (ex: `ACH-005`) têm destaque visual equivalente às favoráveis e servem para delimitar o ICP hipotético sem esconder ou descartar indevidamente.

---

## Mapeamento de Seções do PRD Referenciadas no Código

### Módulo A — Captura Rápida e Condução de Entrevistas
* **Seção 4 & 7**: Captura rápida de evidências sem carga cognitiva (ações dominantes, atalhos de seleção).
* **Seção 6**: Fallback de captura rápida a partir do texto selecionado no transcrito da entrevista.
* **Seção 8**: Sistema de notificações (toast de feedback) e rotas de fallback da aplicação.
* **Seção 15 & 16**: Cadastro e vinculação de entrevistados por organização e registro das sessões de entrevista.
* **Seção 17–23**: Motor de Roteiro e Biblioteca de Perguntas:
  * Perguntas Globais, Setoriais (Subvertical) e de Perfil da Organização.
  * Perguntas Emergentes promovidas da entrevista para a biblioteca global (Seção 23 e 50).
  * Painel de Perguntas de Aprofundamento (*Follow-ups*, Seção 22).
* **Seção 24**: Captura de variáveis estruturadas durante a entrevista.
* **Seção 25 & 26**: Extração de Achados e **Preservação da Fala Original Imutável** separada da **Interpretação Analítica**.
* **Seção 59 & 60**: Condução principal de entrevistas em 2 colunas e modal de revisão/finalização da sessão.

### Módulo B — Organizações & Mapeamento Operacional
* **Seção 9 & 10**: Cadastro de Organizações, isolamento factual e perfil do estabelecimento.
* **Seção 11**: Nível de maturidade de onboarding e progresso operacional da organização.
* **Seção 12**: Mapeamento de tecnologia, stack de software e identificação do que continua sendo feito manualmente fora do ERP/software principal.
* **Seção 13 & 14**: Mapeamento visual de processos e fluxo de etapas conectadas.
* **Seção 56, 57 & 58**: Tabela de Organizações, filtros avançados, abas do Dossiê da Organização e Resumo Executivo.
* **Seção 66**: Detalhamento do *Customer Operations Gap Observado* (OGS).

### Módulo C — Dores Consolidadas & Pain Score
* **Seção 28**: Ocorrências de Dores segregadas por organização e distinção visual entre Ocorrência Local e Dor Consolidada na Vertical.
* **Seção 29**: Cálculo do **Pain Score (0–25)** sobre ocorrências mensuradas (gravidade x frequência) com suporte explícito a estados não mensurados (`null`).
* **Seção 35**: Escala de maturidade de evidência empírica **Evidence Level (H0–H5)**:
  * `H0`: Hipótese Inicial
  * `H1`: Evidência Anedótica
  * `H2`: Incidência Qualitativa
  * `H3`: Recorrência Quantitativa
  * `H4`: Evidência Econômica do Problema
  * `H5`: Compromisso Comercial

### Módulo D — Oportunidades & Dossiês
* **Seção 39 & 40**: Oportunidades nascidas de dores comprovadas e Cards de Oportunidades.
* **Seção 43 (Dossiê da Oportunidade / 5B)**:
  * Identidade e metadados.
  * Resgate de dados de hipótese (Subvertical, Monetização Hipotética, Concorrentes Mapeados, Diferenciação e Integrações Necessárias).
  * Conexão com Dores Consolidadas, Evidence Levels e Contraprovas/Atributos Limites.
  * Transparência metodológica do Opportunity Score (0–100) e Confidence Score (%).
  * Bloco de *Próxima Melhor Evidência*.
* **Seção 44**: Histórico de Experimentos de campo e aprendizados.
* **Seção 45**: Critérios de Descarte (*Kill Criteria*).
* **Seção 67**: Validação de willingness-to-pay e tratamento de evidências contrárias.

### Módulo E — Visões Executivas, Matrizes e Navegação
* **Seção 46**: Ranking Comparativo de Oportunidades e Dores.
* **Seção 51 & 52**: Dashboard Executivo com KPIs globais e painel de recomendações de próximas investigações.
* **Seção 63 & 64**: Matriz de Evidências, Biblioteca de Perguntas e filtros de escopo.
* **Seção 81**: **Jornada Guiada em 18 Passos** (*Guided Journey Navigation*), mapeando o fluxo ponta a ponta do pesquisador desde o mapeamento da vertical até o teste da oportunidade.

---

## Matriz de Transparência Metodológica (Etapas 5B.4 & 5B.4.1)

1. **Opportunity Score (88/100 em OP-CONT-001)**:
   * **Mercado**: 17/20
   * **Dor**: 23/25
   * **Customer Operations Gap**: 24/25
   * **Economia**: 16/20
   * **GTM**: 8/10
   * *Status*: Avaliação atribuída registrada. Não é automatizada por código nem recalculada no frontend.
2. **Confidence Score (78% em OP-CONT-001)**:
   * *Status*: Avaliação de confiança atribuída à hipótese. Não é probabilidade estatística.
3. **Evidence Level (H4 em OP-CONT-001)**:
   * *Status*: Contexto de maturidade da prova empírica. Não altera automaticamente a nota nem a ordenação do Ranking.
