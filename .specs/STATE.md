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

- **Feature**: engineering-baseline (`.specs/features/engineering-baseline/`)
- **Phase / Task**: Done — all 23 tasks (T1, T15–T23, T2–T14) complete, Verifier PASS
- **Completed**: T1, T15, T16, T17, T18, T19, T20, T21, T22, T23, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14
- **In-progress** (file:line): none
- **Next step**: Feature is closed. Open items: two spec-precision-gap lessons (L-001, L-002 in `.specs/LESSONS.md`) flag BASE-04/BASE-08 as never exercised by this diff — no action required unless a future feature touches those paths. Next work is whatever the user requests (no queued feature).
- **Blockers**: none
- **Uncommitted files**: none — working tree clean on `chore/engineering-baseline-spec`
- **Branch**: `chore/engineering-baseline-spec` (not yet merged into `main`; merge/PR decision is the user's call)
