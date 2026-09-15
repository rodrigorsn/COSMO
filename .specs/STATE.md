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

- **Estado**: MVP funcional avançado; 5B.6 fechada, validada e enviada ao remoto.
- **Feature TLC**: `opportunity-detail-hierarchy`; ODH-01–ODH-28 = 28/28 PASS.
- **Commits publicados**: `3131f68` (spec), `63fdebb` (implementação), `240af90` (validação).
- **HEAD remoto**: `HEAD = origin/chore/engineering-baseline-spec = 240af9009917c6469804935b5b1bd6cd8271a323`; working tree limpa no fechamento.
- **Próxima microetapa**: 5B.7 — Unificação da Área de Validação; ainda não iniciada e sem spec TLC.
- **Invariantes metodológicas**: Opportunity Score atribuído/manual; Confidence Score atribuído/manual e não probabilístico; Evidence Level em H0–H5; Ranking ordenado por `opportunityScore.total` DESC e depois `confidenceScore` DESC.
- **Arquitetura operacional**: Persistência em `localStorage`; não existe backend operacional neste estágio.
- **Próximo grande marco**: Após fechar Opportunity/Ranking, executar auditoria end-to-end e congelar o domínio v1.
- **In-progress** (file:line): none
- **Blockers**: none
- **Débitos conhecidos**: bundle principal ~740 kB; `__dirname` em Vite/Vitest; warning `scrollTo()` no JSDOM; ausência de backend/autenticação; `JSON.parse` do `localStorage` sem recuperação de corrupção.
