import React from 'react';
import { EvidenceType, EvidenceNature, EvidenceLevel, VerticalStatus } from '../../types/radar';
import { FileText, Eye, HelpCircle, DollarSign, CheckCircle2, XCircle, MinusCircle, AlertTriangle } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
}

export const EvidenceTypeBadge: React.FC<{ type: EvidenceType; showIcon?: boolean }> = ({ type, showIcon = true }) => {
  switch (type) {
    case 'fato':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
          {showIcon && <FileText className="w-3 h-3 text-blue-600" />}
          FATO
        </span>
      );
    case 'evidencia_observada':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          {showIcon && <Eye className="w-3 h-3 text-emerald-600" />}
          EVIDÊNCIA OBSERVADA
        </span>
      );
    case 'hipotese':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
          {showIcon && <HelpCircle className="w-3 h-3 text-amber-600" />}
          HIPÓTESE
        </span>
      );
    case 'evidencia_comercial':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200">
          {showIcon && <DollarSign className="w-3 h-3 text-purple-600" />}
          EVIDÊNCIA COMERCIAL
        </span>
      );
  }
};

export const EvidenceNatureBadge: React.FC<{ nature: EvidenceNature }> = ({ nature }) => {
  switch (nature) {
    case 'favoravel':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Favorável
        </span>
      );
    case 'contraria':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300 shadow-xs">
          <XCircle className="w-3 h-3 text-rose-600" />
          Contrária
        </span>
      );
    case 'neutra':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <MinusCircle className="w-3 h-3 text-slate-500" />
          Neutra
        </span>
      );
  }
};

export const EvidenceCompositionBadge: React.FC<{
  favCount: number;
  conCount: number;
  neuCount?: number;
}> = ({ favCount, conCount, neuCount = 0 }) => {
  const total = favCount + conCount + neuCount;

  if (total === 0) {
    return <span className="text-slate-400 text-[11px] italic">Sem achados</span>;
  }

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      {favCount > 0 && (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
          {favCount} {favCount === 1 ? 'favorável' : 'favoráveis'}
        </span>
      )}
      {conCount > 0 && (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs">
          <XCircle className="w-2.5 h-2.5 text-rose-600" />
          {conCount} {conCount === 1 ? 'contrária' : 'contrárias'}
        </span>
      )}
      {neuCount > 0 && (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <MinusCircle className="w-2.5 h-2.5 text-slate-500" />
          {neuCount} {neuCount === 1 ? 'neutra' : 'neutras'}
        </span>
      )}
    </div>
  );
};

export function formatEvidenceComposition(fav: number, con: number, neu: number = 0): string {
  const parts: string[] = [];
  if (fav > 0) parts.push(`${fav} ${fav === 1 ? 'favorável' : 'favoráveis'}`);
  if (con > 0) parts.push(`${con} ${con === 1 ? 'contrária' : 'contrárias'}`);
  if (neu > 0) parts.push(`${neu} ${neu === 1 ? 'neutra' : 'neutras'}`);
  return parts.length > 0 ? parts.join(' · ') : 'Sem evidências';
}

export const EvidenceLevelBadge: React.FC<{ level: EvidenceLevel; tooltip?: boolean }> = ({ level }) => {
  const configs: Record<EvidenceLevel, { label: string; desc: string; bg: string; text: string; border: string }> = {
    H0: { label: 'H0', desc: 'Suposição (sem evidência externa)', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
    H1: { label: 'H1', desc: 'Evidência Externa (estudos, fontes secundárias)', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
    H2: { label: 'H2', desc: 'Evidência Individual (1 organização confirma)', bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' },
    H3: { label: 'H3', desc: 'Padrão (múltiplas organizações independentes)', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300' },
    H4: { label: 'H4', desc: 'Evidência Econômica (gastos de dinheiro/pessoas/horas)', bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-300' },
    H5: { label: 'H5', desc: 'Evidência Comercial (piloto pago / compromisso real)', bg: 'bg-purple-100', text: 'text-purple-900', border: 'border-purple-300' }
  };

  const cfg = configs[level] || configs.H0;

  return (
    <span 
      title={`${cfg.label}: ${cfg.desc}`}
      className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      {cfg.label}
    </span>
  );
};

export const VerticalStatusBadge: React.FC<{ status: VerticalStatus }> = ({ status }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  if (status === 'Pesquisa de campo') style = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  if (status === 'Pesquisa secundária') style = 'bg-blue-50 text-blue-800 border-blue-200';
  if (status === 'Análise' || status === 'Validação') style = 'bg-amber-50 text-amber-800 border-amber-200';
  if (status === 'Promissora') style = 'bg-indigo-50 text-indigo-800 border-indigo-200';
  if (status === 'Descartada') style = 'bg-rose-50 text-rose-800 border-rose-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {status}
    </span>
  );
};

export const KillCriteriaStatusBadge: React.FC<{ status: 'seguro' | 'alerta' | 'atingido' }> = ({ status }) => {
  switch (status) {
    case 'seguro':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Seguro
        </span>
      );
    case 'alerta':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Em Alerta
        </span>
      );
    case 'atingido':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
          <XCircle className="w-3 h-3 text-rose-700" />
          Critério Atingido!
        </span>
      );
  }
};
