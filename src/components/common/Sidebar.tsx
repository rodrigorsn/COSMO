import React from 'react';
import { useRadar, ActiveView } from '../../context/RadarContext';
import { 
  LayoutDashboard, 
  Layers, 
  Building2, 
  MessageSquareText, 
  Flame, 
  Sparkles, 
  Trophy, 
  BookOpen, 
  Database, 
  GitCompare
} from 'lucide-react';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ElementType;
  count?: number;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    verticais, 
    organizacoes, 
    entrevistas, 
    doresConsolidadas, 
    oportunidades, 
    perguntasBiblioteca,
    fontes 
  } = useRadar();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'verticais', label: 'Verticais', icon: Layers, count: verticais.length },
    { id: 'organizacoes', label: 'Organizações', icon: Building2, count: organizacoes.length },
    { id: 'entrevistas', label: 'Entrevistas', icon: MessageSquareText, count: entrevistas.length },
    { id: 'dores', label: 'Dores Consolidadas', icon: Flame, count: doresConsolidadas.length },
    { id: 'oportunidades', label: 'Oportunidades', icon: Sparkles, count: oportunidades.length },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
    { id: 'perguntas', label: 'Question Engine', icon: BookOpen, count: perguntasBiblioteca.length },
    { id: 'fontes-concorrentes', label: 'Fontes & Mercado', icon: Database, count: fontes.length },
    { id: 'cross-vertical', label: 'Cross-Vertical', icon: GitCompare, badge: 'Matriz' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      <div className="p-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase px-4 pt-4">
        Navegação de Pesquisa
      </div>

      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id || 
            (item.id === 'verticais' && activeView === 'vertical-detail') ||
            (item.id === 'organizacoes' && activeView === 'organizacao-detail') ||
            (item.id === 'dores' && activeView === 'dor-detail') ||
            (item.id === 'oportunidades' && activeView === 'oportunidade-detail') ||
            (item.id === 'fontes-concorrentes' && (activeView === 'fontes' || activeView === 'concorrentes'));

          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.count !== undefined && (
                <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-blue-700/80 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.count}
                </span>
              )}

              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-3 m-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
        <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Metodologia VOR
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Evidência antes de conclusão. Nenhuma oportunidade sem Evidence Chain rastreável.
        </p>
      </div>
    </aside>
  );
};
