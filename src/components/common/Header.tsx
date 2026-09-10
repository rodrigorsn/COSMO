import React from 'react';
import { Link, useNavigate, useMatches } from '@tanstack/react-router';
import { useRadar } from '../../context/RadarContext';
import { ROUTES } from '../../navigation/routeMap';
import { SimulacaoTag } from './SimulacaoBadge';
import { Radar, RotateCcw, Building2, HelpCircle, Layers, ExternalLink } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    verticais, 
    selectedVerticalId, 
    resetToDemoData
  } = useRadar();

  const navigate = useNavigate();
  const matches = useMatches();
  const verticalMatch = matches.find(m => m.routeId === '/verticais/$verticalId');
  const routeVerticalId = (verticalMatch?.params as Record<string, string> | undefined)?.verticalId;

  // Fonte prioritária: reflete a URL se estiver em rota dinâmica de vertical, fallback para selectedVerticalId
  const activeVerticalValue = routeVerticalId || selectedVerticalId;
  const activeVertical = verticais.find(v => v.id === activeVerticalValue) || verticais[0];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <Link 
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-500 transition-colors">
              <Radar className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white group-hover:text-blue-200 transition-colors">
                  Vertical Opportunity Radar
                </span>
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                  VOR v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Investigação Estruturada de Mercados B2B & Evidence Chain
              </p>
            </div>
          </Link>

          <div className="hidden lg:block ml-2 pl-3 border-l border-slate-800">
            <SimulacaoTag />
          </div>
        </div>

        {/* Center: Active Vertical Switcher */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
          <span className="text-xs text-slate-400 font-medium">Vertical em foco:</span>
          <select
            value={activeVerticalValue}
            onChange={(e) => {
              const nextVerticalId = e.target.value;
              navigate({
                to: '/verticais/$verticalId',
                params: { verticalId: nextVerticalId },
              });
            }}
            className="bg-transparent text-xs font-semibold text-white focus:outline-hidden cursor-pointer"
          >
            {verticais.map(v => (
              <option key={v.id} value={v.id} className="bg-slate-800 text-white">
                {v.nome} ({v.status})
              </option>
            ))}
          </select>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (window.confirm('Deseja restaurar todos os dados fictícios originais do protótipo (Seção 67)?')) {
                resetToDemoData();
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/80"
            title="Restaura os dados originais do protótipo definidos no PRD"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restaurar Simulação</span>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => { e.preventDefault(); alert('Protótipo funcional executando em memória local.'); }}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Documentação / Repositório"
          >
            <HelpCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
