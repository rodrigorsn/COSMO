# STATE

## Decisions

### AD-001
- **Decision**: TLC Spec-Driven Development governará a especificação, o design, a execução e a validação das features do COSMO.
- **Reason**: O projeto exige requisitos testáveis, rastreabilidade, commits atômicos e verificação independente antes de concluir cada feature.
- **Trade-off**: Mudanças não triviais exigirão artefatos e gates adicionais antes da implementação e da integração.
- **Scope**: Todas as features e mudanças de comportamento do COSMO.
- **Date**: 2026-09-12
- **Status**: active

### AD-002
- **Decision**: O COSMO usará npm 11 com `package-lock.json` como único gerenciador e lockfile, sobre Node.js 24.
- **Reason**: O fluxo existente já é documentado em npm, `npm ci` oferece instalação congelada e o lockfile Bun importado não é aceito pelo runtime local.
- **Trade-off**: O repositório deixa de suportar instalação reproduzível via Bun e exige Node/npm dentro dos majors declarados.
- **Scope**: Instalação, dependências, scripts, CI e futuras mudanças de toolchain do COSMO.
- **Date**: 2026-09-13
- **Status**: active

## Handoff

- **Estado**: MVP funcional avançado.
- **Foco atual**: `OpportunityDetailView`; `PainDetailView` encerrada para o MVP após auditoria final.
- **Concluído**: Etapas 5B.2, 5B.3, 5B.3.1, 5B.4 e 5B.4.1; Etapa 5B.5 concluída como auditoria somente leitura, sem alteração de código.
- **P1 atual**: Ordem de leitura da `OpportunityDetailView`.
- **Próxima microetapa**: 5B.6 — Reorganização da Hierarquia & Tese Estratégica; ainda não iniciada.
- **Invariantes metodológicas**: Opportunity Score atribuído/manual; Confidence Score atribuído/manual e não probabilístico; Evidence Level em H0–H5; Ranking ordenado por `opportunityScore.total` DESC e depois `confidenceScore` DESC.
- **Arquitetura operacional**: Persistência em `localStorage`; não existe backend operacional neste estágio.
- **Próximo grande marco**: Após fechar Opportunity/Ranking, executar auditoria end-to-end e congelar o domínio v1.
- **In-progress** (file:line): none
- **Blockers**: none
- **Uncommitted files**: `.specs/STATE.md` — atualização exclusiva deste handoff
- **Branch**: `chore/engineering-baseline-spec`
