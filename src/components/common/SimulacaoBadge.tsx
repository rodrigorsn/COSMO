import React from 'react';
import { Info } from 'lucide-react';

export const SimulacaoBanner: React.FC = () => {
  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-1.5 text-xs text-amber-900 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-semibold bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded text-[11px] tracking-wide uppercase">
          Simulação
        </span>
        <span>
          <strong>Dados demonstrativos fictícios:</strong> este protótipo utiliza o cenário simulado de <em>Contabilidade (Escritórios 001, 002 e 003)</em> para ilustrar a metodologia e a cadeia de evidências (PRD Seções 67 e 77).
        </span>
      </div>
      <div className="hidden md:flex items-center gap-1 text-amber-700 text-[11px]">
        <Info className="w-3.5 h-3.5" />
        <span>Rastreabilidade de Evidências Ativa</span>
      </div>
    </div>
  );
};

export const SimulacaoTag: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <span 
        title="Dado demonstrativo fictício para validação do protótipo"
        className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300"
      >
        SIMULAÇÃO
      </span>
    );
  }
  return (
    <span 
      title="Dado demonstrativo fictício para validação do protótipo (PRD Seção 67)"
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
      SIMULAÇÃO (Dados Fictícios)
    </span>
  );
};
