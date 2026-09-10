import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useRadar } from '../../context/RadarContext';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { EvidenceLevelBadge } from '../common/Badge';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert, 
  Layers, 
  AlertCircle,
  BarChart3,
  Cpu
} from 'lucide-react';

export const RankingView: React.FC = () => {
  const { 
    oportunidades, 
    doresConsolidadas, 
    setSelectedOpportunityId, 
    setActiveView 
  } = useRadar();

  const [activeTab, setActiveTab] = useState<'oportunidades' | 'dores'>('oportunidades');

  // Sorted Opportunities by Total Opportunity Score DESC, then Confidence DESC
  const sortedOpportunities = [...oportunidades].sort((a, b) => {
    if (b.opportunityScore.total !== a.opportunityScore.total) {
      return b.opportunityScore.total - a.opportunityScore.total;
    }
    return b.confidenceScore - a.confidenceScore;
  });

  // Sorted Pains by Incidência DESC, then Pain Score Médio DESC
  const sortedPains = [...doresConsolidadas].sort((a, b) => {
    if (b.incidenciaPercentual !== a.incidenciaPercentual) {
      return b.incidenciaPercentual - a.incidenciaPercentual;
    }
    return b.painScoreMedio - a.painScoreMedio;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Ranking Comparativo de Oportunidades & Dores (PRD Seções 46 e 64)
            </h1>
            <SimulacaoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Priorização rigorosa baseada em evidência empírica, Opportunity Score (OGS) e incidência observada nas organizações pesquisadas.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/80 p-1 rounded-lg text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('oportunidades')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'oportunidades'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Oportunidades ({oportunidades.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('dores')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'dores'
                ? 'bg-white text-amber-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Dores Consolidadas ({doresConsolidadas.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'oportunidades' ? (
        <div className="space-y-4">
          <div className="bg-blue-50/60 border border-blue-200 p-3.5 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <BarChart3 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Critério de Ranqueamento de Oportunidades:</strong> Pontuação total do Opportunity Score (0-100) composto por: Tamanho de Mercado (20), Intensidade da Dor (20), Operations Gap / OGS (20), Economia Gerada (20) e Viabilidade de GTM (20), ponderado pelo nível de evidência e confiança.
            </div>
          </div>

          <div className="space-y-3">
            {sortedOpportunities.map((opp, idx) => (
              <div 
                key={opp.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all text-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                    idx === 0 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : idx === 1 
                      ? 'bg-slate-200 text-slate-800' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    #{idx + 1}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-blue-700">{opp.id}</span>
                      <EvidenceLevelBadge level={opp.evidenceLevel} />
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {opp.status}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ICP: <strong className="text-slate-700">{opp.icpHipotetico}</strong>
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900">{opp.nome}</h3>
                    <p className="text-slate-600 line-clamp-2 max-w-2xl leading-relaxed">
                      {opp.problema}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Opp Score</span>
                      <span className="font-mono font-bold text-blue-700 text-sm">{opp.opportunityScore.total}/100</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Confiança</span>
                      <span className="font-mono font-bold text-emerald-700 text-sm">{opp.confidenceScore}%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">AI Leverage</span>
                      <span className="font-mono font-bold text-purple-700 text-sm">{opp.aiLeverage.total}/30</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedOpportunityId(opp.id);
                      setActiveView('oportunidade-detail');
                    }}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-blue-700 font-semibold border border-slate-200 hover:border-blue-200 transition-colors"
                  >
                    <span>Ver Detalhes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-amber-50/60 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Critério de Ranqueamento de Dores:</strong> Incidência percentual nas organizações pesquisadas (confirmadas vs. total pesquisado), seguido pelo Pain Score médio calculado sobre as ocorrências de campo segregadas.
            </div>
          </div>

          <div className="space-y-3">
            {sortedPains.map((pain, idx) => (
              <div 
                key={pain.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all text-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                    idx === 0 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : idx === 1 
                      ? 'bg-slate-200 text-slate-800' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    #{idx + 1}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-amber-800">{pain.id}</span>
                      <EvidenceLevelBadge level={pain.evidenciaNivel} />
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {pain.categoria}
                      </span>
                      {pain.amostraLimitada && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                          Amostra limitada ({pain.amostraTamanho}/{pain.amostraRecomendadaMinima})
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-slate-900">{pain.titulo}</h3>
                    <p className="text-slate-600 line-clamp-2 max-w-2xl leading-relaxed">
                      {pain.descricao}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Incidência</span>
                      <span className="font-mono font-bold text-amber-800 text-sm">
                        {pain.incidenciaPercentual}% ({pain.organizacoesConfirmadasCount}/{pain.organizacoesTotalPesquisadas})
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Pain Score Médio</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">{pain.painScoreMedio}/25</span>
                    </div>
                  </div>

                  <Link
                    to="/dores/$painId"
                    params={{ painId: pain.id }}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-50 hover:bg-amber-50 text-amber-800 font-semibold border border-slate-200 hover:border-amber-200 transition-colors"
                  >
                    <span>Ver Detalhes da Dor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
