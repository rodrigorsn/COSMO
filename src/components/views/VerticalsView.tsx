import React from 'react';
import { Link } from '@tanstack/react-router';
import { useRadar } from '../../context/RadarContext';
import { VerticalStatusBadge } from '../common/Badge';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { Layers, ArrowRight, Building2, MessageSquareText, Flame, Sparkles } from 'lucide-react';

export const VerticalsView: React.FC = () => {
  const { verticais, organizacoes, entrevistas, doresConsolidadas, oportunidades } = useRadar();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Verticais de Mercado Investigadas
            </h1>
            <SimulacaoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cada vertical representa um setor econômico B2B investigado de forma independente (PRD Seção 6 e 7).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {verticais.map((vert) => {
          const isContabilidade = vert.id === 'VERT-CONT';
          const orgCount = isContabilidade ? organizacoes.length : 0;
          const interviewCount = isContabilidade ? entrevistas.length : 0;
          const painCount = isContabilidade ? doresConsolidadas.length : 0;
          const oppCount = isContabilidade ? oportunidades.length : 0;

          return (
            <Link
              key={vert.id}
              to="/verticais/$verticalId"
              params={{ verticalId: vert.id }}
              className={`block p-5 rounded-xl border transition-all bg-white shadow-xs hover:border-blue-300 hover:shadow-sm group ${
                isContabilidade ? 'ring-1 ring-blue-500/20 border-blue-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">{vert.id}</span>
                    <VerticalStatusBadge status={vert.status} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5 flex items-center gap-2">
                    {vert.nome}
                    {isContabilidade && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                        Cenário Demonstrativo do PRD
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {vert.descricao}
              </p>

              <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <span className="font-semibold text-slate-700">Tese Inicial:</span>
                <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-2">
                  {vert.teseInicial}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
                <div>
                  <div className="text-[11px] text-slate-400">Orgs</div>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{orgCount}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Entrevistas</div>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{interviewCount}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Dores</div>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{painCount}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Oportunidades</div>
                  <div className="font-bold text-blue-700 text-sm mt-0.5">{oppCount}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2">
                <span>Responsável: {vert.responsavel}</span>
                <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Acessar Vertical <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
