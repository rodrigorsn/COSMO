import React from 'react';
import { useRadar } from '../../context/RadarContext';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { Flame, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { calculatePainConsolidation } from '../../utils/calculations';
import { EvidenceLevelBadge } from '../common/Badge';

export const PainsView: React.FC = () => {
  const { 
    doresConsolidadas, 
    ocorrenciasDores, 
    organizacoes, 
    achados, 
    setSelectedPainId, 
    setActiveView 
  } = useRadar();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Dores Consolidadas da Vertical
            </h1>
            <SimulacaoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Problemas conceituais que se repetem entre organizações. Dores agregam ocorrências e nunca escondem evidências contrárias (PRD Seção 27, 30 e 38).
          </p>
        </div>
      </div>

      {/* Table (PRD Seção 61) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Dor Conceitual</th>
                <th className="py-3 px-4">Vertical</th>
                <th className="py-3 px-4 text-center">Organizações</th>
                <th className="py-3 px-4 text-center">Incidência</th>
                <th className="py-3 px-4 text-center">Pain Mediano</th>
                <th className="py-3 px-4 text-center">Evidências (Fav / Cont)</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {doresConsolidadas.map(pain => {
                const stats = calculatePainConsolidation(
                  pain.id, 
                  ocorrenciasDores, 
                  organizacoes.length, 
                  achados
                );

                return (
                  <tr key={pain.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] text-slate-400">{pain.id}</div>
                      <div className="font-bold text-slate-900 mt-0.5 text-sm">{pain.titulo}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{pain.categoria}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      Contabilidade
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold">
                      {stats.orgsComDor} de {stats.totalOrgsVertical}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                        stats.incidenciaPercent >= 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {stats.incidenciaPercent}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900 text-sm">
                      {stats.mediana}/25
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-emerald-700 font-semibold" title="Evidências favoráveis">
                          +{pain.evidenciasFavoraveisIds.length}
                        </span>
                        <span>/</span>
                        <span className="text-rose-700 font-semibold" title="Evidências contrárias">
                          -{pain.evidenciasContrariasIds.length}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedPainId(pain.id);
                          setActiveView('dor-detail');
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-700 text-xs font-semibold"
                      >
                        Ver Detalhe & Evidências
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
