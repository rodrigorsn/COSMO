import React from 'react';
import { Link, useMatches } from '@tanstack/react-router';
import { useRadar } from '../../context/RadarContext';
import { calculatePainConsolidation, isPainScoreMeasured } from '../../utils/calculations';
import { EvidenceNatureBadge, EvidenceCompositionBadge } from '../common/Badge';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { ROUTES } from '../../navigation/routeMap';
import { 
  ArrowLeft, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Building2, 
  Quote, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  Filter,
  BarChart3,
  AlertTriangle
} from 'lucide-react';

interface PainDetailViewProps {
  painId?: string;
}

export const PainDetailView: React.FC<PainDetailViewProps> = ({ painId: propPainId }) => {
  const { 
    doresConsolidadas, 
    selectedPainId, 
    setActiveView, 
    ocorrenciasDores, 
    organizacoes, 
    achados, 
    oportunidades,
    setSelectedOrgId,
    setSelectedOpportunityId
  } = useRadar();

  // Resolução da fonte da verdade: parâmetro da rota dinâmica do TanStack Router
  const matches = useMatches();
  const painMatch = matches.find(m => m.routeId === '/dores/$painId');
  const routePainId = (painMatch?.params as Record<string, string> | undefined)?.painId;

  // Fonte prioritária: parâmetro da rota (TanStack Router) ou prop; fallback para selectedPainId legado
  const isDynamicRoute = Boolean(routePainId);
  const effectivePainId = propPainId || routePainId || selectedPainId;

  // Se estiver em rota dinâmica, busca estritamente pelo ID fornecido na URL sem fallback silencioso para outra dor
  const pain = isDynamicRoute
    ? doresConsolidadas.find(p => p.id === effectivePainId)
    : (doresConsolidadas.find(p => p.id === effectivePainId) || null);

  // Tratamento explícito de Dor Não Encontrada (PRD Seção 8 / Etapa 2C)
  if (!pain) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-xs">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-full">
            Dor não encontrada
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Nenhuma dor consolidada encontrada para "{effectivePainId}"
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            O identificador fornecido na URL não corresponde a nenhuma dor consolidada registrada nesta vertical de pesquisa.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to={ROUTES.DORES}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a Lista de Dores
          </Link>
        </div>
      </div>
    );
  }

  const stats = calculatePainConsolidation(pain.id, ocorrenciasDores, organizacoes.length, achados);

  const relevantOccurrences = ocorrenciasDores.filter(o => o.dorConsolidadaId === pain.id);
  const relevantFindings = achados.filter(f => f.dorConsolidadaId === pain.id);
  const favorableFindings = relevantFindings.filter(f => f.natureza === 'favoravel');
  const contraryFindings = relevantFindings.filter(f => f.natureza === 'contraria');
  const neutralFindings = relevantFindings.filter(f => f.natureza === 'neutra');

  const relatedOpportunities = oportunidades.filter(o => o.doresRelacionadasIds.includes(pain.id));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header (PRD Seção 62) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.DORES}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors inline-flex items-center justify-center"
            title="Voltar para a lista de dores"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400 font-semibold">{pain.id}</span>
              <SimulacaoTag compact />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              {pain.titulo}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Categoria: <strong>{pain.categoria}</strong> • Vertical: Contabilidade
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
          {pain.descricao}
        </p>

        {/* Incidência e Métricas Consolidadas (PRD Seção 30) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center text-xs p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <span className="text-slate-400 text-[11px] block">Incidência</span>
            <span className="font-bold text-emerald-800 text-base font-mono">
              {stats.orgsComDor} de {stats.totalOrgsVertical} ({stats.incidenciaPercent}%)
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Pain Mediano</span>
            <span className="font-bold text-slate-900 text-base font-mono">
              {stats.ocorrenciasMensuradasCount > 0 ? `${stats.mediana}/25` : <span className="text-xs font-normal text-slate-400 italic">Não mensurado</span>}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Pain Médio</span>
            <span className="font-bold text-slate-900 text-base font-mono">
              {stats.ocorrenciasMensuradasCount > 0 ? stats.media : <span className="text-xs font-normal text-slate-400 italic">Não mensurado</span>}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Score Mínimo</span>
            <span className="font-mono font-semibold text-slate-700 text-sm">
              {stats.ocorrenciasMensuradasCount > 0 ? stats.minimo : '—'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Score Máximo</span>
            <span className="font-mono font-bold text-orange-800 text-sm">
              {stats.ocorrenciasMensuradasCount > 0 ? stats.maximo : '—'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Evid. Favoráveis</span>
            <span className="font-mono font-bold text-emerald-700 text-sm">+{favorableFindings.length}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Evid. Contrárias</span>
            <span className="font-mono font-bold text-rose-700 text-sm">-{contraryFindings.length}</span>
          </div>
          {neutralFindings.length > 0 && (
            <div>
              <span className="text-slate-400 text-[11px] block">Evid. Neutras</span>
              <span className="font-mono font-bold text-slate-600 text-sm">{neutralFindings.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Organizações vs. Evidências Favoráveis/Contrárias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Ocorrências e Distribuição por Organização (PRD Seção 28 e 29) */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Ocorrências Individuais por Organização</span>
              <span className="text-xs font-normal text-slate-500">Dados segregados (PRD Seção 28)</span>
            </h2>

            <div className="space-y-3">
              {relevantOccurrences.map(occ => {
                const org = organizacoes.find(o => o.id === occ.organizacaoId);
                const measured = isPainScoreMeasured(occ);
                const score = measured ? occ.painScore!.total : null;
                const occFindings = achados.filter(f => occ.achadosIds.includes(f.id));
                const favCount = occFindings.filter(f => f.natureza === 'favoravel').length;
                const conCount = occFindings.filter(f => f.natureza === 'contraria').length;
                const neuCount = occFindings.filter(f => f.natureza === 'neutra').length;

                return (
                  <div key={occ.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{org?.nome}</div>
                        <div className="text-[11px] text-slate-500">{org?.numClientes} clientes • {org?.numFuncionarios} funcionários</div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        {measured ? (
                          <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                            score! >= 20 ? 'bg-orange-100 text-orange-900 border border-orange-200' : 'bg-slate-200 text-slate-800'
                          }`}>
                            {score}/25
                          </span>
                        ) : (
                          <span className="font-mono font-semibold px-2 py-0.5 rounded text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
                            Não mensurado
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {occ.notasEspecificas}
                    </p>

                    {/* Composição das evidências desta ocorrência */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                      <span className="text-slate-500 font-medium">Evidências:</span>
                      <EvidenceCompositionBadge favCount={favCount} conCount={conCount} neuCount={neuCount} />
                    </div>

                    {measured ? (
                      <div className="grid grid-cols-5 gap-1 pt-1 text-center font-mono text-[10px] text-slate-500 border-t border-slate-200/60">
                        <div>Freq: <strong>{occ.painScore!.frequencia}</strong></div>
                        <div>Tempo: <strong>{occ.painScore!.tempoCusto}</strong></div>
                        <div>Sev: <strong>{occ.painScore!.severidade}</strong></div>
                        <div>Man: <strong>{occ.painScore!.manualidade}</strong></div>
                        <div>Rep: <strong>{occ.painScore!.repetibilidade}</strong></div>
                      </div>
                    ) : (
                      <div className="pt-1 text-center font-mono text-[11px] text-slate-400 italic border-t border-slate-200/60">
                        Dimensões de dor ainda não mensuradas nesta organização.
                      </div>
                    )}

                    <div className="pt-2 text-right">
                      <Link
                        to="/organizacoes/$orgId"
                        params={{ orgId: occ.organizacaoId }}
                        className="text-blue-700 font-semibold text-[11px] hover:underline inline-flex items-center gap-1"
                      >
                        Ver ambiente da organização <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Segmentação Analítica (PRD Seção 31) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              Segmentação Analítica (PRD Seção 31)
            </h3>
            <p className="text-slate-500 text-[11px]">
              Análise de correlação sem gerar conclusão causal automática:
            </p>

            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-emerald-950">
                <strong>Por Número de Clientes:</strong>
                <p className="mt-0.5 text-xs">
                  <strong>2/2 (100%)</strong> dos escritórios com mais de 200 clientes (ORG-001 com 320 e ORG-003 com 480) apresentam dor severa (&gt;22/25).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200 text-rose-950">
                <strong>Em Pequenos Escritórios (&lt;100 clientes):</strong>
                <p className="mt-0.5 text-xs">
                  <strong>0/1 (0%)</strong> dos escritórios pequenos (ORG-002 com 65 clientes) relata dor severa (Pain 9/25), pois o portal básico com app e o contato direto com os donos de comércios locais ainda seguram a operação.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Evidências Favoráveis vs. Contrárias (PRD Seção 38) */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Quote className="w-4 h-4 text-blue-600" />
                Evidências Qualitativas & Preservação da Fala (PRD Seção 26 e 38)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Regra de integridade do VOR: <strong>nunca ocultar evidências contrárias</strong>.
              </p>
            </div>

            {/* Evidência Contrária em Destaque */}
            {contraryFindings.length > 0 && (
              <div className="space-y-2">
                <div className="font-bold text-rose-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  Evidência Contrária Observada ({contraryFindings.length}):
                </div>
                {contraryFindings.map(cf => {
                  const org = cf.organizacaoId ? organizacoes.find(o => o.id === cf.organizacaoId) : null;
                  return (
                    <div key={cf.id} className="p-3.5 rounded-lg border border-rose-300 bg-rose-50/60 text-xs space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-rose-950">{cf.titulo}</div>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                          {org ? org.nome : (cf.origem || 'Fonte Externa')}
                        </span>
                      </div>
                      <div className="italic text-rose-900 bg-white/80 p-2.5 rounded border border-rose-200">
                        "{cf.fraseOriginal}"
                      </div>
                      <p className="text-rose-800 text-[11px]">
                        <strong>Interpretação:</strong> {cf.interpretacao}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Evidências Favoráveis */}
            <div className="space-y-2">
              <div className="font-bold text-emerald-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Evidências Favoráveis Observadas ({favorableFindings.length}):
              </div>
              <div className="space-y-2">
                {favorableFindings.map(ff => {
                  const org = ff.organizacaoId ? organizacoes.find(o => o.id === ff.organizacaoId) : null;
                  return (
                    <div key={ff.id} className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/40 text-xs space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-slate-900">{ff.titulo}</div>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {org ? org.nome : (ff.origem || 'Fonte Externa')}
                        </span>
                      </div>
                      <div className="italic text-slate-800 bg-white p-2.5 rounded border border-slate-200">
                        "{ff.fraseOriginal}"
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        <strong>Interpretação:</strong> {ff.interpretacao}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evidências Neutras */}
            {neutralFindings.length > 0 && (
              <div className="space-y-2">
                <div className="font-bold text-slate-700 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  Evidências Neutras Observadas ({neutralFindings.length}):
                </div>
                <div className="space-y-2">
                  {neutralFindings.map(nf => {
                    const org = nf.organizacaoId ? organizacoes.find(o => o.id === nf.organizacaoId) : null;
                    return (
                      <div key={nf.id} className="p-3.5 rounded-lg border border-slate-300 bg-slate-50/60 text-xs space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-bold text-slate-900">{nf.titulo}</div>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {org ? org.nome : (nf.origem || 'Fonte Externa')}
                          </span>
                        </div>
                        <div className="italic text-slate-800 bg-white p-2.5 rounded border border-slate-200">
                          "{nf.fraseOriginal}"
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          <strong>Interpretação:</strong> {nf.interpretacao}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Oportunidades Derivadas */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Oportunidades de Software Derivadas Desta Dor</h3>
            {relatedOpportunities.map(opp => (
              <div key={opp.id} className="p-3.5 rounded-lg border border-blue-200 bg-blue-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{opp.nome}</span>
                  <span className="font-mono font-bold text-blue-800">Score {opp.opportunityScore.total}/100</span>
                </div>
                <p className="text-slate-600 text-xs">{opp.problema}</p>
                <button
                  onClick={() => {
                    setSelectedOpportunityId(opp.id);
                    setActiveView('oportunidade-detail');
                  }}
                  className="text-blue-700 font-semibold hover:underline inline-flex items-center gap-1 pt-1"
                >
                  Ver Opportunity Card & Evidence Chain <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
