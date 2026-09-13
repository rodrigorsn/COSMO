# Relatório de Status do Projeto — Radar de Oportunidades & Framework COSMO

---

## 1. Visão Geral do Status Atual

O **Radar de Oportunidades & Validação Empírica** roda em **React 19 + Vite 8 + TypeScript + Tailwind CSS v4**, com `@tanstack/react-router` para roteamento e `RadarContext` para gerenciamento de estado persistente via `localStorage`.

Após a baseline de engenharia (typecheck limpo, suíte de testes automatizada e gate de CI), o projeto está pronto para **teste exploratório**, não para produção. Não há backend, autenticação ou persistência fora do navegador do usuário.

## 2. Gate de Qualidade

`npm run check` executa typecheck, a suíte Vitest, auditoria de dependências de produção e build, nessa ordem. O mesmo gate roda em `.github/workflows/ci.yml` em pull requests para `main` e pushes para `main`.

* **Testes**: exatamente **61 testes** passando, distribuídos em 4 arquivos (cálculos, rotas, `RadarContext` e smoke de aplicação).
* **Auditoria de produção**: `npm audit --omit=dev --audit-level=moderate` retorna zero vulnerabilidades.
* **Build**: `vite build` conclui sem erros.

## 3. Inventário de Rotas e Visões Comitadas

Toda rota é servida por `RadarAppContent` (`src/App.tsx`), que seleciona a visão ativa a partir do path corrente.

| Rota | Visão | Arquivo |
| :--- | :--- | :--- |
| `/` | Dashboard Executivo | `src/components/views/DashboardView.tsx` |
| `/verticais` | Lista de Verticais | `src/components/views/VerticalsView.tsx` |
| `/verticais/$verticalId` | Detalhe de Vertical | `src/components/views/VerticalDetailView.tsx` |
| `/organizacoes` | Lista de Organizações | `src/components/views/OrganizationsView.tsx` |
| `/organizacoes/$orgId` | Detalhe de Organização | `src/components/views/OrganizationDetailView.tsx` |
| `/entrevistas`, `/entrevistas/$interviewId` | Condução de Entrevistas | `src/components/views/InterviewsView.tsx` |
| `/dores` | Lista de Dores | `src/components/views/PainsView.tsx` |
| `/dores/$painId` | Dossiê da Dor | `src/components/views/PainDetailView.tsx` |
| `/oportunidades` | Lista de Oportunidades | `src/components/views/OpportunitiesView.tsx` |
| `/oportunidades/$opportunityId` | Dossiê da Oportunidade | `src/components/views/OpportunityDetailView.tsx` |
| `/ranking` | Ranking Comparativo | `src/components/views/RankingView.tsx` |
| `/perguntas` | Biblioteca de Perguntas | `src/components/views/QuestionsView.tsx` |
| `/fontes` | Fontes & Mercado | `src/components/views/FontesEMercadoView.tsx` |
| `/cross-vertical` | Matriz Cross-Vertical | `src/components/views/CrossVerticalView.tsx` |
| qualquer path não reconhecido | Fallback | `src/components/common/UnknownRouteFallback.tsx` |

Nenhuma Matriz de Evidências (`/evidencias`) ou Jornada Guiada (`/jornada`) existe no código-fonte comitado; ambas foram removidas deste inventário por não corresponderem a nenhum arquivo ou rota do repositório.

## 4. Riscos Conhecidos

| Risco | Detalhe | Mitigação |
| :--- | :--- | :--- |
| **Sem backend nem autenticação** | Todo o estado vive em `localStorage` no navegador do usuário; não há servidor, banco de dados ou controle de acesso. | Fora do escopo desta baseline; qualquer uso multiusuário ou com dados sensíveis exige uma feature dedicada de backend/auth antes de produção. |
| **Bundle principal acima de 500 kB** | O build de produção emite um chunk JS único acima do limite de aviso do Vite. | Registrado como débito técnico; code splitting fica para uma feature de performance separada. |
| **`JSON.parse` de storage sem tratamento de conteúdo inválido** | Storage corrompido pode impedir o boot do app. | Fora do escopo da baseline de engenharia; hardening de storage é um follow-up. |

## 5. Leitura

Consulte o [`README.md`](../README.md) para instalação, comandos e URL de desenvolvimento.
