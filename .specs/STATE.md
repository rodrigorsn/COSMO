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
