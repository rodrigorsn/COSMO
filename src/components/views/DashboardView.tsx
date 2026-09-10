import React from 'react';
import { Link } from '@tanstack/react-router';
import { useRadar } from '../../context/RadarContext';
import { ROUTES } from '../../navigation/routeMap';
import { 
  Building2, 
  MessageSquareText, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert,
  Clock,
  Compass
} from 'lucide-react';
import { EvidenceLevelBadge, EvidenceNatureBadge } from '../common/Badge';
import { SimulacaoTag } from '../common/SimulacaoBadge';

export const DashboardView: React.FC = () => {
  const { 
    verticais, 
    organizacoes, 
    entrevistas, 
    doresConsolidadas, 
    oportunidades, 
    setActiveView, 
    setSelectedOpportunityId,
    jumpToJourneyStep 
  } = useRadar();

  const h4h5Count = oportunidades.filter(o => o.evidenceLevel === 'H4' || o.evidenceLevel === 'H5').length;
  const topOpportunity = oportunidades.slice().sort((a, b) => b.opportunityScore.total - a.opportunityScore.total)[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Executive Summary (Seção 51) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Painel Executivo de Investigação B2B
              </h1>
              <SimulacaoTag />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Descoberta estruturada de oportunidades de software ancoradas em evidências reais de processos e clientes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => jumpToJourneyStep(1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              Iniciar Jornada de 18 Passos (PRD)
            </button>
          </div>
        </div>

        {/* 3 Core Questions from Section 51 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              1. O que estamos pesquisando?
            </div>
            <div className="text-sm font-semibold text-slate-900">
              Contabilidade (Foco primário em PMEs)
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Investigando o <strong>Customer Operations Gap</strong>: tarefas operacionais entre escritórios contábeis e seus clientes fora do ERP (WhatsApp, planilhas e e-mail).
            </p>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200/80">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>2. Onde aparecem os sinais mais fortes?</span>
              <span className="text-xs font-bold text-emerald-700">Score 88/100</span>
            </div>
            <div className="text-sm font-semibold text-emerald-950">
              Gestão de Pendências & Fechamento Mensal
            </div>
            <p className="text-xs text-emerald-900/90 mt-1 leading-relaxed">
              Incidência comprovada em escritórios com mais de 150 clientes. 3 colaboradores dedicados exclusivamente a follow-up no Escritório 003.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200/80">
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
              3. O que precisa ser investigado agora?
            </div>
            <div className="text-sm font-semibold text-amber-950">
              Piloto Pago (H4 → H5) & Validação de Micro-escritórios
            </div>
            <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
              Testar aceitação de proposta comercial de protótipo e averiguar se a dor é inexistente em carteiras com &lt;70 clientes.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards (Seção 51) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link 
          to={ROUTES.VERTICAIS}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 cursor-pointer transition-all block"
        >
          <div className="text-xs font-medium text-slate-500">Verticais Ativas</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{verticais.length}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1 flex items-center gap-1">
            <span>1 em campo</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </div>
        </Link>

        <Link 
          to={ROUTES.ORGANIZACOES}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 cursor-pointer transition-all block"
        >
          <div className="text-xs font-medium text-slate-500">Organizações</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{organizacoes.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            865 clientes B2B somados
          </div>
        </Link>

        <Link 
          to={ROUTES.ENTREVISTAS}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 cursor-pointer transition-all block"
        >
          <div className="text-xs font-medium text-slate-500">Entrevistas</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{entrevistas.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            5 perfis mapeados
          </div>
        </Link>

        <Link 
          to={ROUTES.DORES}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 cursor-pointer transition-all block"
        >
          <div className="text-xs font-medium text-slate-500">Dores Consolidadas</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{doresConsolidadas.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Incidência max 67%
          </div>
        </Link>

        <Link 
          to={ROUTES.OPORTUNIDADES}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 cursor-pointer transition-all block"
        >
          <div className="text-xs font-medium text-slate-500">Oportunidades</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{oportunidades.length}</div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">
            Top Score: 88
          </div>
        </Link>

        <Link 
          to={ROUTES.RANKING}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 cursor-pointer transition-all bg-linear-to-b from-indigo-50/30 to-white block"
        >
          <div className="text-xs font-medium text-slate-500">Nível H4 / H5</div>
          <div className="text-2xl font-bold text-indigo-900 mt-1">{h4h5Count}</div>
          <div className="text-[11px] text-indigo-700 font-medium mt-1">
            Evidência econômica
          </div>
        </Link>
      </div>

      {/* Main Content Split: Prioridades de Investigação vs. Oportunidade em Destaque */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Próximas Investigações (Seção 52 do PRD) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Próximas Investigações & Gaps de Pesquisa (Regras Automáticas)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Recomendações baseadas na ausência de evidências de suporte ou disparidades observadas (PRD Seção 52).
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/40 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-slate-900">
                    OP-CONT-001 necessita de proposta comercial de teste (H4 → H5)
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Já existe evidência econômica comprovada (H4) com despesas de 3 pessoas dedicadas na ORG-003. O próximo passo metodológico é apresentar proposta de piloto pago no Escritório 001 e Escritório 003.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedOpportunityId('OP-CONT-001');
                      setActiveView('oportunidade-detail');
                    }}
                    className="text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1 pt-1"
                  >
                    Ver Opportunity Card OP-CONT-001 <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 flex items-start gap-3">
                <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-slate-900">
                    Amostra insuficiente de escritórios pequenos (&lt;80 clientes)
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Apenas 1 organização pequena foi pesquisada (Escritório Beta - 65 clientes) e apresentou <strong>evidência contrária</strong> (o portal resolve bem). É necessário entrevistar mais 2 escritórios com &lt;80 clientes para confirmar se a dor realmente só emerge em médias empresas.
                  </p>
                  <Link
                    to={ROUTES.ORGANIZACOES}
                    className="text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1 pt-1"
                  >
                    Ver Organizações Pesquisadas <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Item 3 */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-slate-900">
                    Oportunidade OP-CONT-002 (Admissão DP) está em H2
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    A dor de documentos de admissão foi verificada apenas no Escritório 003. Para conceder H3 (padrão inter-organizações), é mandatório confirmar em pelo menos mais 1 organização independente.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedOpportunityId('OP-CONT-002');
                      setActiveView('oportunidade-detail');
                    }}
                    className="text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1 pt-1"
                  >
                    Abrir Detalhe de OP-CONT-002 <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dores com maior sinal */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-600" />
                Dores Consolidadas em Alta Intensidade
              </h2>
              <Link 
                to={ROUTES.DORES}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Ver todas ({doresConsolidadas.length})
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {doresConsolidadas.map(dor => (
                <div key={dor.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">
                      {dor.titulo}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="font-mono text-slate-600">{dor.id}</span>
                      <span>•</span>
                      <span>{dor.categoria}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">{dor.evidenciasFavoraveisIds.length} favoráveis</span>
                      {dor.evidenciasContrariasIds.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-rose-700 font-semibold">{dor.evidenciasContrariasIds.length} contrária</span>
                        </>
                      )}
                      {dor.evidenciasNeutrasIds && dor.evidenciasNeutrasIds.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600 font-medium">{dor.evidenciasNeutrasIds.length} neutra</span>
                        </>
                      )}
                    </div>
                  </div>

                  <Link
                    to="/dores/$painId"
                    params={{ painId: dor.id }}
                    className="px-2.5 py-1 rounded text-xs font-medium border border-slate-200 hover:bg-slate-50 text-slate-700 shrink-0 inline-block text-center cursor-pointer transition-colors"
                  >
                    Detalhar
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Top Opportunity Spotlight (Card PRD Seção 40) */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Oportunidade Líder</span>
              <EvidenceLevelBadge level={topOpportunity.evidenceLevel} />
            </div>

            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              {topOpportunity.nome}
            </h3>

            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Opportunity Score:</span>
                <span className="font-bold text-blue-700 text-sm font-mono">{topOpportunity.opportunityScore.total}/100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Confidence:</span>
                <span className="font-bold text-emerald-700 font-mono">{topOpportunity.confidenceScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                  {topOpportunity.status}
                </span>
              </div>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div>
                <span className="font-semibold text-slate-700">ICP Hipotético:</span>
                <p className="text-slate-600 text-[11px] mt-0.5">{topOpportunity.icpHipotetico}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-700">Customer Operations Gap (COG):</span>
                <p className="text-slate-600 text-[11px] mt-0.5 font-mono bg-slate-100 p-1.5 rounded">
                  {topOpportunity.processoAtual}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-700">Próxima Evidência (Next Evidence):</span>
                <p className="text-slate-600 text-[11px] mt-0.5 italic">
                  "{topOpportunity.proximaMelhorEvidencia}"
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedOpportunityId(topOpportunity.id);
                  setActiveView('oportunidade-detail');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <span>Explorar Evidence Chain Completa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Cross-Vertical preview */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-xs">
            <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span>Padrões Cross-Vertical</span>
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">4 Setores</span>
            </div>
            <p className="text-slate-500 text-[11px] mb-3">
              Cobrança de documentos e evidências dos clientes ocorre transversalmente:
            </p>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Contabilidade:</span>
                <span className="font-semibold text-slate-900">67% (H4)</span>
              </div>
              <div className="flex justify-between">
                <span>SST Ocupacional:</span>
                <span className="font-semibold text-slate-900">81% (H3)</span>
              </div>
              <div className="flex justify-between">
                <span>Consultoria Ambiental:</span>
                <span className="font-semibold text-slate-900">69% (H2)</span>
              </div>
              <div className="flex justify-between">
                <span>Jurídico Trabalhista:</span>
                <span className="font-semibold text-slate-900">54% (H2)</span>
              </div>
            </div>
            <Link
              to={ROUTES.CROSS_VERTICAL}
              className="mt-3 w-full text-center text-blue-600 font-semibold text-xs hover:underline block"
            >
              Abrir Matriz Cross-Vertical
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
