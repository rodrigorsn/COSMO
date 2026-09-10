import React, { useState } from 'react';
import { useRadar } from '../../context/RadarContext';
import { ChevronRight, ChevronLeft, Compass, CheckCircle2, Play, ChevronDown } from 'lucide-react';

const JOURNEY_STEPS = [
  { step: 1, title: 'Abrir Dashboard', desc: 'Visão executiva em 30 segundos e prioridades de pesquisa' },
  { step: 2, title: 'Entrar em Contabilidade', desc: 'Visualizar a vertical selecionada e seus dados' },
  { step: 3, title: 'Organizações pesquisadas', desc: 'Lista de escritórios com filtros de porte e stack' },
  { step: 4, title: 'Abrir Escritório Contábil 001', desc: 'Ver perfil da organização, 320 clientes, ERP Atlas' },
  { step: 5, title: 'Perfil, tecnologia e processos', desc: 'Visualizar stack, o que ocorre fora e etapas do processo' },
  { step: 6, title: 'Abrir entrevistado', desc: 'Carlos (Sócio) e Maria (Gestora Fiscal)' },
  { step: 7, title: 'Abrir entrevista', desc: 'Acessar roteiro com perguntas integradas' },
  { step: 8, title: 'Perguntas globais + específicas', desc: 'Composição de perguntas da biblioteca por perfil e vertical' },
  { step: 9, title: 'Registrar resposta e variáveis', desc: 'Entrada qualitativa e variáveis estruturadas' },
  { step: 10, title: 'Criar / Revisar Achado', desc: 'Preservar fala original separada da interpretação' },
  { step: 11, title: 'Associar Achado a uma Dor', desc: 'Vincular observação à dor conceitual correspondente' },
  { step: 12, title: 'Visualizar Pain Score da organização', desc: 'Score individual (23/25 no Escritório 001)' },
  { step: 13, title: 'Voltar para Contabilidade', desc: 'Retornar ao nível agregado da vertical' },
  { step: 14, title: 'Consolidação da dor entre organizações', desc: 'Incidência de 67%, média e evidência contrária' },
  { step: 15, title: 'Abrir Oportunidade OP-CONT-001', desc: 'Visualizar Opportunity Card e breakdown do score' },
  { step: 16, title: 'Visualizar Evidence Chain', desc: 'Rastreabilidade ponta a ponta até a fala original' },
  { step: 17, title: 'Visualizar Next Evidence', desc: 'Próxima melhor evidência para validação' },
  { step: 18, title: 'Abrir Ranking', desc: 'Comparativo ordenável de oportunidades por Score e Confidence' },
];

export const GuidedJourneyBar: React.FC = () => {
  const { currentJourneyStep, jumpToJourneyStep } = useRadar();
  const [isOpen, setIsOpen] = useState(false);

  const currentStepObj = JOURNEY_STEPS.find(s => s.step === currentJourneyStep) || JOURNEY_STEPS[0];

  const handleNext = () => {
    if (currentJourneyStep < 18) {
      jumpToJourneyStep(currentJourneyStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentJourneyStep > 1) {
      jumpToJourneyStep(currentJourneyStep - 1);
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 relative z-30 shadow-xs">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold shrink-0">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Jornada do PRD (Seção 81):</span>
            <span className="text-blue-700 font-bold">Passo {currentJourneyStep} de 18</span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 text-xs text-left hover:text-blue-700 transition-colors truncate"
            title="Clique para ver todos os 18 passos do PRD"
          >
            <span className="font-semibold text-slate-900 truncate">
              {currentStepObj.title}
            </span>
            <span className="text-slate-400 hidden md:inline">— {currentStepObj.desc}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentJourneyStep <= 1}
            className="p-1.5 rounded text-xs border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
            title="Passo anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentJourneyStep >= 18}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            title="Avançar para o próximo passo"
          >
            <span>Próximo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dropdown list of all 18 steps */}
      {isOpen && (
        <div className="absolute left-4 right-4 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 max-h-96 overflow-y-auto z-50 p-2 max-w-4xl mx-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
            <span>Fluxo Demonstrativo Principal (Seção 81 do PRD)</span>
            <span className="text-[11px] text-slate-400">18 etapas navegáveis</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 pt-1">
            {JOURNEY_STEPS.map(item => {
              const isCurrent = item.step === currentJourneyStep;
              const isPast = item.step < currentJourneyStep;
              return (
                <button
                  key={item.step}
                  onClick={() => {
                    jumpToJourneyStep(item.step);
                    setIsOpen(false);
                  }}
                  className={`flex items-start gap-2.5 p-2 rounded text-left transition-colors text-xs ${
                    isCurrent 
                      ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                    isCurrent ? 'bg-blue-600 text-white' : isPast ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : item.step}
                  </span>
                  <div>
                    <div className="leading-tight">{item.title}</div>
                    <div className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
