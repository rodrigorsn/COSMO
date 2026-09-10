import React from 'react';
import { useRadar } from '../../context/RadarContext';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { EvidenceLevelBadge } from '../common/Badge';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2, TrendingUp, Cpu } from 'lucide-react';

export const OpportunitiesView: React.FC = () => {
  const { oportunidades, setSelectedOpportunityId, setActiveView } = useRadar();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Oportunidades de Software Mapeadas
            </h1>
            <SimulacaoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cada oportunidade nasce de dores comprovadas em campo com cadeia de rastreabilidade (PRD Seção 4 e 39).
          </p>
        </div>
      </div>

      {/* Cards List (PRD Seção 40 e 63) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {oportunidades.map(opp => {
          return (
            <div
              key={opp.id}
              onClick={() => {
                setSelectedOpportunityId(opp.id);
                setActiveView('oportunidade-detail');
              }}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700">{opp.id}</span>
                    <EvidenceLevelBadge level={opp.evidenceLevel} />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">
                    {opp.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {opp.nome}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {opp.problema}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-slate-500">Opportunity Score:</span>
                    <span className="font-bold text-blue-700 text-sm">{opp.opportunityScore.total}/100</span>
                  </div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-slate-500">Confidence:</span>
                    <span className="font-bold text-emerald-700 text-sm">{opp.confidenceScore}%</span>
                  </div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-slate-500">AI Leverage:</span>
                    <span className="font-bold text-purple-700 text-xs">{opp.aiLeverage.total}/30</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  <strong className="text-slate-700">ICP:</strong> {opp.icpHipotetico}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 text-xs space-y-2">
                <div className="text-slate-500 text-[11px] line-clamp-1 italic">
                  <strong>Próxima Evidência:</strong> "{opp.proximaMelhorEvidencia}"
                </div>

                <button className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-blue-700 font-semibold text-xs border border-slate-200 hover:border-blue-200 transition-colors">
                  <span>Abrir Opportunity Card & Evidence Chain</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
