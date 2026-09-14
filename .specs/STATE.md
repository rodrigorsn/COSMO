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
- **Concluído**: Etapas 5B.2, 5B.3, 5B.3.1, 5B.4, 5B.4.1 (auditoria) e 5B.5 (somente leitura); **5B.6 concluída** — `OpportunityDetailView` reorganizada em seis zonas (Hero → Tese Estratégica → Sustentação Empírica & Contraprovas → Scores & Viabilidade → Validação → Evidence Chain). TLC fechado: `validation.md` produzido, 28/28 ODH verificados, todos os gates verdes.
- **Próxima microetapa**: 5B.7 — Unificação da Área de Validação.
- **Invariantes metodológicas**: Opportunity Score atribuído/manual; Confidence Score atribuído/manual e não probabilístico; Evidence Level em H0–H5; Ranking ordenado por `opportunityScore.total` DESC e depois `confidenceScore` DESC.
- **Arquitetura operacional**: Persistência em `localStorage`; não existe backend operacional neste estágio.
- **Próximo grande marco**: Após fechar Opportunity/Ranking, executar auditoria end-to-end e congelar o domínio v1.
- **In-progress** (file:line): none
- **Blockers**: none
- **Uncommitted files**: `src/components/views/OpportunityDetailView.tsx` (implementação da 5B.6 — não commitada); `.specs/features/opportunity-detail-hierarchy/` (validation.md, spec.md, tasks.md atualizados — não commitados); `.specs/STATE.md`
- **Branch**: `chore/engineering-baseline-spec`
- **Warnings conhecidos (não relacionados à feature)**: Vite `__dirname` advisory; JSDOM `scrollTo` em testes; bundle JS > 500 kB (débito técnico pré-existente).
