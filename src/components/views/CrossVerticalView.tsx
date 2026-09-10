import React, { useState } from 'react';
import { useRadar } from '../../context/RadarContext';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { EvidenceLevelBadge } from '../common/Badge';
import { 
  GitCompare, 
  Layers, 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import { INITIAL_CROSS_VERTICAL } from '../../data/initialData';

export const CrossVerticalView: React.FC = () => {
  const { crossVertical } = useRadar();
  const [selectedPatternIndex, setSelectedPatternIndex] = useState<number>(0);

  const patterns = crossVertical && crossVertical.length > 0 ? crossVertical : INITIAL_CROSS_VERTICAL;
  const currentPattern = patterns[selectedPatternIndex] || patterns[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-indigo-600" />
              Matriz Comparativa Cross-Vertical (PRD Seções 44 e 68)
            </h1>
            <SimulacaoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Identificação de dores transversais presentes em múltiplos setores de prestação de serviços B2B com regulação e entregas periódicas.
          </p>
        </div>
      </div>

      {/* Methodology Callout */}
      <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-950 space-y-1.5">
        <div className="font-bold flex items-center gap-1.5 text-indigo-900">
          <Layers className="w-4 h-4 text-indigo-600" />
          Metodologia Cross-Vertical do VOR:
        </div>
        <p className="leading-relaxed text-indigo-900/90">
          Dores com alta incidência em múltiplas verticais indicam oportunidades para <strong>software de infraestrutura operacional horizontal</strong> ou <strong>verticais adjacentes</strong> com rápida transferibilidade de produto. Nenhuma generalização é feita sem evidência de campo auditável em cada segmento.
        </p>
      </div>

      {/* Pattern Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {patterns.map((p, idx) => {
          const isSelected = selectedPatternIndex === idx;
          const verticalsCount = Object.keys(p.dadosPorVertical).length;
          
          return (
            <button
              key={p.padraoNome}
              onClick={() => setSelectedPatternIndex(idx)}
              className={`p-4 rounded-xl border text-left text-xs transition-all flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-white border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-indigo-600 block mb-1">
                  Padrão Transversal #{idx + 1}
                </span>
                <h3 className="font-bold text-slate-900 line-clamp-2 leading-snug">
                  {p.padraoNome}
                </h3>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{verticalsCount} verticais analisadas</span>
                <span className={`font-semibold ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {isSelected ? 'Ativo' : 'Ver matriz'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Pattern Matrix */}
      {currentPattern && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 space-y-2 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800 border border-indigo-200">
                Padrão Selecionado
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {currentPattern.padraoNome}
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              {currentPattern.descricao}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Vertical Investigada</th>
                  <th className="py-3 px-4">Incidência Observada</th>
                  <th className="py-3 px-4">Amostra / Confirmadas</th>
                  <th className="py-3 px-4">Pain Score Médio</th>
                  <th className="py-3 px-4">Nível de Evidência</th>
                  <th className="py-3 px-4">Conclusão Metodológica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {Object.entries(currentPattern.dadosPorVertical).map(([vertName, rawData]) => {
                  const data = rawData as {
                    incidenciaPercent: number;
                    orgsConfirmadas: number;
                    totalOrgs: number;
                    painMedio: number;
                    evidenciaNivel: any;
                  };

                  return (
                    <tr key={vertName} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>{vertName}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[11px] font-mono">
                            <span className="font-bold text-indigo-900">{data.incidenciaPercent}%</span>
                          </div>
                          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-600 rounded-full" 
                              style={{ width: `${Math.min(data.incidenciaPercent, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px]">
                        <strong>{data.orgsConfirmadas}</strong> de {data.totalOrgs} organizações
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {data.painMedio.toFixed(1)} / 25
                      </td>

                      <td className="py-3 px-4">
                        <EvidenceLevelBadge level={data.evidenciaNivel} />
                      </td>

                      <td className="py-3 px-4 text-[11px] text-slate-500 max-w-xs">
                        {data.incidenciaPercent >= 70 ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            Dor crítica confirmada no core operacional
                          </span>
                        ) : data.incidenciaPercent >= 50 ? (
                          <span className="text-blue-700 font-semibold flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            Incidência majoritária relevante
                          </span>
                        ) : (
                          <span className="text-slate-500 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            Incidência moderada ou restrita a subsegmento
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cross-Vertical Takeaway */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <BarChart2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong>Diagnóstico de Mercado:</strong> Este padrão apresenta alta aderência em prestadores de serviços técnicos com obrigação de conformidade. Uma solução verticalizada em Contabilidade que resolva este ponto pode ser adaptada para SST e Meio Ambiente com custo de produto marginal.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
