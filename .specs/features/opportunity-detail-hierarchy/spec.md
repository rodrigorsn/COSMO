# Opportunity Detail Hierarchy Specification

## Problem Statement

A `OpportunityDetailView` apresenta todos os elementos necessários para avaliar uma oportunidade, mas a tese estratégica aparece somente depois das dores, contraprovas e da Evidence Chain. Essa ordem obriga o pesquisador a interpretar a sustentação empírica antes de compreender claramente qual hipótese está sendo sustentada. A Etapa 5B.6 reorganiza apenas a hierarquia visual existente para estabelecer uma leitura progressiva da tese até sua rastreabilidade.

## Goals

- [ ] Posicionar a Tese Estratégica imediatamente após o Hero, sem outro bloco conceitual entre eles.
- [ ] Organizar a leitura em seis zonas consecutivas: Hero, Tese Estratégica, Sustentação Empírica & Contraprovas, Scores & Viabilidade, Validação e Evidence Chain.
- [ ] Preservar integralmente conteúdo, valores, regras metodológicas, navegação e persistência existentes.
- [ ] Manter a tela funcional em acesso direto, refresh e navegação interna.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Novos dados ou reescrita dos dados existentes | A 5B.6 altera hierarquia visual, não conteúdo da oportunidade. |
| Novas regras de produto ou metodologia COSMO | Opportunity Score, Confidence Score e Evidence Level mantêm suas definições atuais. |
| Alterações em scores, cálculos ou ordenação do Ranking | A reorganização não muda avaliação nem priorização. |
| Alterações em tipos, modelos ou dados canônicos | Os contratos e fixtures atuais permanecem como fonte dos valores renderizados. |
| Alterações em rotas ou navegação global | A rota dinâmica e os destinos internos existentes já são canônicos. |
| Alterações em `RadarContext` ou `localStorage` | A feature não muda estado nem persistência. |
| Criação ou expansão da Guided Journey | A navegação guiada existente fora deste escopo deve apenas permanecer intacta. |
| Redesign visual, novo design system ou novos componentes de domínio | A entrega prioriza reordenação e agrupamento do conteúdo existente. |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Limite do Hero | O header atual, incluindo o callout de Próxima Melhor Evidência, permanece como uma única primeira zona | Preserva o Hero aprovado e evita redefinir conteúdo nesta etapa. | y |
| Composição da Tese Estratégica | Um único bloco reúne ICP, problema, JTBD, processo atual/Operations Gap, hipótese de solução, integrações, monetização, concorrentes/alternativas, diferenciação e riscos | É o conteúdo existente especificado para subir na hierarquia. | y |
| Composição de Sustentação Empírica & Contraprovas | Dores relacionadas aparecem antes das contraprovas, dentro da mesma zona conceitual | Mantém a progressão evidência favorável → limites da hipótese já presente na tela. | y |
| Composição de Scores & Viabilidade | Opportunity Score, Confidence Score e AI Leverage permanecem juntos depois da sustentação empírica | Esses blocos avaliam prioridade, confiança e viabilidade sem alterar seus valores. | y |
| Composição de Validação | Kill Criteria e Histórico de Experimentos formam a zona de Validação | Ambos registram como a hipótese é testada ou descartada. | y |
| Posição da Evidence Chain | A Evidence Chain passa a ser a última zona conceitual da página | A rastreabilidade encerra a leitura depois que tese, sustentação, avaliação e validação foram compreendidas. | y |
| Significado de Guided Journey | Refere-se ao comportamento de navegação guiada já existente fora desta view; nenhuma rota `/jornada` será criada | `docs/STATUS.md` declara que essa rota não existe no código comitado. | y |
| Estratégia responsiva | A ordem conceitual é idêntica em todos os breakpoints; apenas o layout interno responsivo atual é preservado | A hierarquia não pode depender da largura da tela. | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Ler a tese antes de avaliar sua sustentação ⭐ MVP

**User Story**: As a pesquisador de oportunidades, I want compreender a tese estratégica imediatamente após identificar a oportunidade so that dores, contraprovas, scores e evidências sejam interpretados contra uma hipótese explícita.

**Why P1**: A ordem atual inverte a lógica de decisão: apresenta evidências e rastreabilidade antes de explicar integralmente a tese que elas sustentam.

**Acceptance Criteria**:

1. WHEN uma oportunidade válida for renderizada THEN a view SHALL apresentar as zonas de primeiro nível nesta ordem exata: Hero, Tese Estratégica, Sustentação Empírica & Contraprovas, Scores & Viabilidade, Validação e Evidence Chain. `[ODH-01]`
2. WHEN o Hero terminar THEN a Tese Estratégica SHALL ser a próxima zona de primeiro nível, sem Dores, Contraprovas, scores, validação ou Evidence Chain entre elas. `[ODH-02]`
3. The Tese Estratégica SHALL exibir o ICP hipotético existente sem alterar seu texto. `[ODH-03]`
4. The Tese Estratégica SHALL exibir o problema resolvido existente sem alterar seu texto. `[ODH-04]`
5. The Tese Estratégica SHALL exibir o JTBD existente sem alterar seu texto. `[ODH-05]`
6. The Tese Estratégica SHALL exibir o processo atual e seu contexto de Customer Operations Gap sem alterar seu texto. `[ODH-06]`
7. The Tese Estratégica SHALL exibir a hipótese de solução existente sem alterar seu texto. `[ODH-07]`
8. The Tese Estratégica SHALL preservar integrações necessárias, monetização hipotética, concorrentes/alternativas, diferenciação e riscos principais com os mesmos valores e estados vazios atuais. `[ODH-08]`
9. WHEN a Tese Estratégica terminar THEN a zona Sustentação Empírica & Contraprovas SHALL apresentar primeiro as Dores relacionadas e depois as Contraprovas & Limites da Hipótese. `[ODH-09]`
10. WHEN a zona Sustentação Empírica & Contraprovas terminar THEN Scores & Viabilidade SHALL ser a próxima zona de primeiro nível. `[ODH-10]`
11. WHEN Scores & Viabilidade terminar THEN Validação SHALL apresentar Kill Criteria e Histórico de Experimentos antes da Evidence Chain. `[ODH-11]`
12. WHEN Validação terminar THEN a Evidence Chain SHALL ser a última zona conceitual da oportunidade. `[ODH-12]`

**Independent Test**: Abrir `OP-CONT-001`, identificar os seis headings/landmarks de primeiro nível e comprovar sua ordem no DOM, verificando também que os dez conteúdos da tese correspondem aos valores atuais.

---

### P1: Preservar comportamento e metodologia ⭐ MVP

**User Story**: As a responsável pelo framework COSMO, I want a reorganização visual sem mudança semântica so that a melhoria de leitura não altere decisões, evidências ou rastreabilidade.

**Why P1**: Uma mudança de hierarquia não pode modificar silenciosamente o domínio validado nas etapas anteriores.

**Acceptance Criteria**:

1. WHEN `OP-CONT-001` for renderizada THEN o Opportunity Score SHALL continuar exibindo `88/100` como avaliação atribuída e manual. `[ODH-13]`
2. WHEN `OP-CONT-001` for renderizada THEN o Confidence Score SHALL continuar exibindo `78%` como confiança atribuída, manual e não probabilística. `[ODH-14]`
3. WHEN `OP-CONT-001` for renderizada THEN o Evidence Level SHALL continuar exibindo `H4` dentro da escala canônica H0–H5. `[ODH-15]`
4. The view SHALL preservar Dores relacionadas, contraprovas, AI Leverage, Kill Criteria, experimentos e Evidence Chain sem perda de conteúdo ou capacidade de seleção. `[ODH-16]`
5. WHEN um link existente para lista de oportunidades, Dor, Organização ou Entrevista for acionado THEN a aplicação SHALL navegar para o mesmo destino canônico anterior à reorganização. `[ODH-17]`
6. WHEN a rota dinâmica de uma oportunidade válida for aberta diretamente ou recarregada THEN a aplicação SHALL restaurar a mesma oportunidade e a nova hierarquia sem erro não tratado. `[ODH-18]`
7. IF o ID da rota não corresponder a uma oportunidade THEN a view SHALL preservar o fallback atual de oportunidade não encontrada e o link de retorno. `[ODH-19]`
8. The implementation SHALL preserve `src/types/radar.ts`, `src/data/initialData.ts`, `src/context/RadarContext.tsx`, `src/utils/calculations.ts`, `src/router.tsx`, `RankingView`, Guided Journey e o contrato de persistência em `localStorage` sem alterações. `[ODH-20]`
9. The implementation SHALL introduce no new domain data, score mutation, calculation, model, route or persistence rule. `[ODH-21]`
10. WHEN a futura implementação for validada THEN `npm run typecheck` SHALL exit with status zero. `[ODH-22]`
11. WHEN a futura implementação for validada THEN `npm run build` SHALL exit with status zero. `[ODH-23]`
12. WHEN a futura implementação for validada THEN a suíte automatizada existente SHALL passar sem teste removido, ignorado ou enfraquecido. `[ODH-24]`

**Independent Test**: Comparar os valores e links observáveis de `OP-CONT-001` antes e depois da reorganização, recarregar sua rota direta e executar typecheck, testes e build.

---

## Edge Cases

- WHEN uma oportunidade não possuir integrações, monetização, concorrentes ou diferenciação THEN a Tese Estratégica SHALL preservar o estado vazio correspondente no novo posicionamento. `[ODH-25]`
- WHEN uma oportunidade não possuir Dores relacionadas ou contraprovas revisadas THEN a zona Sustentação Empírica & Contraprovas SHALL preservar as mensagens vazias atuais sem alterar a ordem das zonas. `[ODH-26]`
- WHEN a Evidence Chain possuir múltiplos achados THEN a seleção de um achado SHALL continuar atualizando o painel de rastreabilidade atômica correspondente. `[ODH-27]`
- WHILE a view estiver em qualquer breakpoint suportado, a ordem das seis zonas SHALL permanecer idêntica. `[ODH-28]`

---

## Implicit-Requirement Dimensions

| Dimension | Resolution |
| --------- | ---------- |
| Input validation & bounds | ODH-19 cobre ID de oportunidade inválido; nenhum novo input é criado. |
| Failure / partial-failure states | ODH-19, ODH-25 e ODH-26 preservam fallback e estados vazios. |
| Idempotency / retry / duplicate handling | N/A porque a feature não cria escrita, retry ou operação duplicável. |
| Auth boundaries & rate limits | N/A porque não existe backend operacional ou operação autenticada neste escopo. |
| Concurrency / ordering | ODH-01, ODH-02 e ODH-09–ODH-12 definem a ordem determinística das zonas; concorrência de dados é N/A. |
| Data lifecycle / expiry | ODH-20 preserva `localStorage`; a feature não altera criação, expiração ou exclusão de dados. |
| Observability | N/A porque a feature não introduz serviço, evento operacional ou novo failure mode de produção. |
| External-dependency failure | N/A porque a reorganização não adiciona integração ou dependência externa. |
| State-transition integrity | ODH-16 e ODH-27 preservam a única interação local em escopo, a seleção de achados da Evidence Chain. |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| ODH-01 | P1: Ler a tese antes de avaliar sua sustentação | Design | Pending |
| ODH-02 | P1: Ler a tese antes de avaliar sua sustentação | Design | Pending |
| ODH-03 | P1: Ler a tese antes de avaliar sua sustentação | Design | Pending |
| ODH-04 | P1: Ler a tese antes de avaliar sua sustentação | Design | Pending |
| ODH-05 | P1: Ler a tese antes de avaliar sua sustentação | Design | Pending |
| ODH-06 | P1: Ler a tese antes de avaliar sua sustentação | Design | Pending |
| ODH-07 | P1: Ler a tese antes de avaliar sua sustentação | Design | Pending |
| ODH-08 | P1: Ler a tese antes de avaliar sua sustentação | Design | Pending |
| ODH-09 | P1: Ler a tese antes de avaliar sua sustentação | Design | Pending |
| ODH-10 | P1: Ler a tese antes de avaliar sua sustentação | Design | Pending |
| ODH-11 | P1: Ler a tese antes de avaliar sua sustentação | Design | Pending |
| ODH-12 | P1: Ler a tese antes de avaliar sua sustentação | Design | Pending |
| ODH-13 | P1: Preservar comportamento e metodologia | Design | Pending |
| ODH-14 | P1: Preservar comportamento e metodologia | Design | Pending |
| ODH-15 | P1: Preservar comportamento e metodologia | Design | Pending |
| ODH-16 | P1: Preservar comportamento e metodologia | Design | Pending |
| ODH-17 | P1: Preservar comportamento e metodologia | Design | Pending |
| ODH-18 | P1: Preservar comportamento e metodologia | Design | Pending |
| ODH-19 | P1: Preservar comportamento e metodologia | Design | Pending |
| ODH-20 | P1: Preservar comportamento e metodologia | Design | Pending |
| ODH-21 | P1: Preservar comportamento e metodologia | Design | Pending |
| ODH-22 | P1: Preservar comportamento e metodologia | Design | Pending |
| ODH-23 | P1: Preservar comportamento e metodologia | Design | Pending |
| ODH-24 | P1: Preservar comportamento e metodologia | Design | Pending |
| ODH-25 | Edge cases | Design | Pending |
| ODH-26 | Edge cases | Design | Pending |
| ODH-27 | Edge cases | Design | Pending |
| ODH-28 | Edge cases | Design | Pending |

**Coverage:** 28 total, 0 mapped to tasks, 28 pending design/task mapping.

---

## Success Criteria

- [ ] As seis zonas aparecem na ordem conceitual aprovada em todos os breakpoints.
- [ ] A Tese Estratégica aparece imediatamente após o Hero e reúne os dez grupos de conteúdo existentes.
- [ ] `OP-CONT-001` continua exibindo Opportunity Score `88/100`, Confidence `78%` e Evidence Level `H4`.
- [ ] Dores, contraprovas, links internos, validação e Evidence Chain permanecem funcionais.
- [ ] Nenhum arquivo de dados, modelo, cálculo, rota, contexto, Ranking, Guided Journey ou persistência é alterado.
- [ ] Refresh e acesso direto à rota dinâmica continuam funcionando.
- [ ] TypeScript, suíte automatizada existente e build permanecem verdes.
