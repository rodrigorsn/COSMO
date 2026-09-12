import React, { useState } from 'react';
import { Link, useMatches } from '@tanstack/react-router';
import { useRadar } from '../../context/RadarContext';
import { ROUTES } from '../../navigation/routeMap';
import { calculateOrgMaturity, calculatePainScore, isPainScoreMeasured, calculatePainConsolidation } from '../../utils/calculations';
import { EvidenceNatureBadge, EvidenceCompositionBadge } from '../common/Badge';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { 
  Building2, 
  ArrowLeft, 
  Users, 
  Cpu, 
  GitCommit, 
  MessageSquareText, 
  Flame, 
  Quote, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Play, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Plus,
  ChevronRight,
  MapPin,
  ArrowDown,
  FileText,
  Layers
} from 'lucide-react';
import { TechStackItem, ProcessMap, Finding, PainOccurrence } from '../../types/radar';

type OrgTab = 
  | 'resumo' 
  | 'perfil' 
  | 'tecnologia' 
  | 'pessoas' 
  | 'entrevistas' 
  | 'processos' 
  | 'achados' 
  | 'dores';

export const OrganizationDetailView: React.FC<{ 
  orgId?: string;
  onNewInterviewClick?: () => void;
  onNewFindingClick?: () => void;
}> = ({ orgId: propOrgId, onNewInterviewClick, onNewFindingClick }) => {
  const { 
    organizacoes, 
    entrevistas, 
    achados, 
    ocorrenciasDores, 
    doresConsolidadas,
    oportunidades,
    updatePainScore
  } = useRadar();

  const [activeTab, setActiveTab] = useState<OrgTab>('resumo');
  const [editingPainId, setEditingPainId] = useState<string | null>(null);

  // Resolução da fonte da verdade: parâmetro da rota dinâmica do TanStack Router
  const matches = useMatches();
  const orgMatch = matches.find(m => m.routeId === '/organizacoes/$orgId');
  const routeOrgId = (orgMatch?.params as Record<string, string> | undefined)?.orgId;

  // Fonte de seleção: parâmetro da rota (TanStack Router) ou prop
  const effectiveOrgId = propOrgId || routeOrgId;

  // Busca a organização correspondente ao ID da URL
  const org = effectiveOrgId ? organizacoes.find(o => o.id === effectiveOrgId) : null;

  if (!org) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Organização não encontrada</h2>
            <p className="text-xs text-slate-500 mt-1">
              Não foi possível localizar uma organização com o identificador{' '}
              <code className="font-mono font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                {effectiveOrgId}
              </code>.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to={ROUTES.ORGANIZACOES}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para Organizações</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orgInterviews = entrevistas.filter(e => e.organizacaoId === org.id);
  const orgFindings = achados.filter(f => f.organizacaoId === org.id);
  const orgPainOccurrences = ocorrenciasDores.filter(o => o.organizacaoId === org.id);

  const maturity = calculateOrgMaturity(org, orgInterviews.length, orgFindings.length, orgPainOccurrences.length);

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 px-0.5">
        <Link
          to={ROUTES.ORGANIZACOES}
          className="hover:text-blue-600 transition-colors flex items-center gap-1 font-medium text-slate-600"
        >
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Organizações</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-semibold text-slate-800 truncate">{org.nome}</span>
      </nav>

      {/* Header & Dossier Container */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shrink-0 mt-0.5">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {org.nome}
                </h1>
                <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
                  {org.id}
                </span>
                <SimulacaoTag compact />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-semibold text-slate-800">{org.subvertical}</span>
                <span className="text-slate-300">•</span>
                <span>{org.numFuncionarios} funcionários</span>
                <span className="text-slate-300">•</span>
                <span><strong className="text-slate-800">{org.numClientes} clientes PMEs</strong></span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3 h-3 text-slate-400 inline shrink-0" />
                  {org.cidade}/{org.estado}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
            <button
              onClick={onNewInterviewClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Conduzir Nova Entrevista</span>
            </button>
          </div>
        </div>

        {/* Maturity Progress (PRD Seção 11) */}
        <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-700">Maturidade da Pesquisa na Organização:</span>
              <span className="font-bold text-blue-700 font-mono text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                {maturity.scorePercent}% estruturada
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Progresso operacional (PRD Seção 11)</span>
          </div>

          <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${maturity.scorePercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[11px]">
            <div className="p-2 rounded bg-white border border-slate-200/70 text-slate-600">
              <span className="text-slate-400 block text-[10px]">Perfil</span>
              <strong className="text-slate-800">{maturity.perfil}</strong>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200/70 text-slate-600">
              <span className="text-slate-400 block text-[10px]">Stack</span>
              <strong className="text-slate-800">{maturity.stack}</strong>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200/70 text-slate-600">
              <span className="text-slate-400 block text-[10px]">Entrevistas</span>
              <strong className="text-slate-800">{maturity.interviewsText}</strong>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200/70 text-slate-600">
              <span className="text-slate-400 block text-[10px]">Processos</span>
              <strong className="text-slate-800">{maturity.processesText}</strong>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200/70 text-slate-600">
              <span className="text-slate-400 block text-[10px]">Dores</span>
              <strong className="text-slate-800">{maturity.painsText}</strong>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200/70 text-slate-600">
              <span className="text-slate-400 block text-[10px]">Evidências</span>
              <strong className="text-slate-800">{maturity.findingsText}</strong>
            </div>
          </div>
        </div>

        {/* Tabs (PRD Seção 57) */}
        <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto text-xs font-semibold pt-1">
          {[
            { id: 'resumo', label: 'Resumo' },
            { id: 'perfil', label: 'Perfil' },
            { id: 'tecnologia', label: `Tecnologia & Gap (${org.stackTecnologico.length})` },
            { id: 'pessoas', label: `Pessoas (${org.entrevistados.length})` },
            { id: 'entrevistas', label: `Entrevistas (${orgInterviews.length})` },
            { id: 'processos', label: `Processos Mapeados (${org.processos.length})` },
            { id: 'achados', label: `Achados Extraídos (${orgFindings.length})` },
            { id: 'dores', label: `Ocorrências de Dores (${orgPainOccurrences.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as OrgTab)}
              className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENTS */}

      {/* 1. RESUMO (PRD Seção 58) */}
      {activeTab === 'resumo' && (
        <div className="space-y-6">
          {/* Banner de Investigação em estágio inicial */}
          {orgInterviews.length === 0 && (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-amber-900 text-sm">Investigação em estágio inicial</span>
                    <span className="text-[10px] font-semibold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded uppercase tracking-wider">
                      Sem dados primários
                    </span>
                  </div>
                  <p className="text-amber-900/80 text-xs leading-relaxed">
                    Esta organização possui poucas evidências coletadas. Novas entrevistas, processos mapeados e achados tornarão o dossiê da investigação mais completo.
                  </p>
                </div>
              </div>
              {onNewInterviewClick && (
                <button
                  onClick={onNewInterviewClick}
                  className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-2xs self-start sm:self-auto flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Conduzir primeira entrevista</span>
                </button>
              )}
            </div>
          )}

          {/* BLOCO 1: SNAPSHOT DA INVESTIGAÇÃO */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Snapshot da Investigação
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Volume de material de pesquisa coletado até o momento nesta organização.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
              {/* Entrevistados */}
              <button
                onClick={() => setActiveTab('pessoas')}
                className="bg-slate-50 hover:bg-blue-50/50 p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-200 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-medium">Entrevistados</span>
                  <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <span className="font-bold text-slate-900 text-xl mt-1 block font-mono">{org.entrevistados.length}</span>
                <span className="text-[10px] text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5 mt-1">
                  Ver pessoas <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </button>

              {/* Entrevistas */}
              <button
                onClick={() => setActiveTab('entrevistas')}
                className="bg-slate-50 hover:bg-blue-50/50 p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-200 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-medium">Entrevistas</span>
                  <MessageSquareText className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <span className="font-bold text-slate-900 text-xl mt-1 block font-mono">{orgInterviews.length}</span>
                <span className="text-[10px] text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5 mt-1">
                  Ver histórico <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </button>

              {/* Processos */}
              <button
                onClick={() => setActiveTab('processos')}
                className="bg-slate-50 hover:bg-blue-50/50 p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-200 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-medium">Processos</span>
                  <GitCommit className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <span className="font-bold text-slate-900 text-xl mt-1 block font-mono">{org.processos.length}</span>
                <span className="text-[10px] text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5 mt-1">
                  Ver fluxos <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </button>

              {/* Achados */}
              <button
                onClick={() => setActiveTab('achados')}
                className="bg-slate-50 hover:bg-blue-50/50 p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-200 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-medium">Achados</span>
                  <Quote className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <span className="font-bold text-slate-900 text-xl mt-1 block font-mono">{orgFindings.length}</span>
                <span className="text-[10px] text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5 mt-1">
                  Ver falas <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </button>

              {/* Ocorrências de Dores */}
              <button
                onClick={() => setActiveTab('dores')}
                className="bg-slate-50 hover:bg-orange-50/50 p-3.5 rounded-xl border border-slate-200/80 hover:border-orange-200 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-medium">Ocorrências Dores</span>
                  <Flame className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 transition-colors" />
                </div>
                <span className="font-bold text-orange-700 text-xl mt-1 block font-mono">{orgPainOccurrences.length}</span>
                <span className="text-[10px] text-orange-600 font-semibold group-hover:underline flex items-center gap-0.5 mt-1">
                  Ver dores <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </button>

              {/* Stack / Ferramentas */}
              <button
                onClick={() => setActiveTab('tecnologia')}
                className="bg-slate-50 hover:bg-blue-50/50 p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-200 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-medium">Stack Mapeado</span>
                  <Cpu className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <span className="font-bold text-slate-900 text-xl mt-1 block font-mono">{org.stackTecnologico.length}</span>
                <span className="text-[10px] text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5 mt-1">
                  Ver ferramentas <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </button>
            </div>
          </div>

          {/* BLOCO 2: PRINCIPAIS SINAIS OPERACIONAIS */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-600" />
                  Principais Sinais Operacionais Detectados
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sinais de dor registrados especificamente nesta organização e sua intensidade calculada.
                </p>
              </div>
              {orgPainOccurrences.length > 0 && (
                <button
                  onClick={() => setActiveTab('dores')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline hidden sm:inline-flex items-center gap-1"
                >
                  Ver todas as dores ({orgPainOccurrences.length}) <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {orgPainOccurrences.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center space-y-2">
                <Flame className="w-6 h-6 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800">Nenhuma ocorrência de dor registrada</h4>
                <p className="text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed">
                  Uma ocorrência registra como uma dor se manifesta especificamente nesta organização.
                  {orgFindings.length > 0
                    ? ' Revise os achados existentes para mapear dores operacionais.'
                    : ' Realize entrevistas com a equipe para coletar evidências primárias.'}
                </p>
                {orgFindings.length > 0 ? (
                  <button
                    onClick={() => setActiveTab('achados')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    <Quote className="w-3.5 h-3.5" />
                    <span>Ver Achados Extraídos</span>
                  </button>
                ) : onNewInterviewClick ? (
                  <button
                    onClick={onNewInterviewClick}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Conduzir primeira entrevista</span>
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {orgPainOccurrences.slice(0, 4).map(occ => {
                  const painObj = doresConsolidadas.find(d => d.id === occ.dorConsolidadaId);
                  const measured = isPainScoreMeasured(occ);
                  const score = measured ? occ.painScore!.total : null;
                  const occFindings = achados.filter(f => occ.achadosIds.includes(f.id));
                  const reviewedOccFindings = occFindings.filter(f => f.reviewStatus !== 'pendente' && Boolean(f.natureza));
                  const favCount = reviewedOccFindings.filter(f => f.natureza === 'favoravel').length;
                  const conCount = reviewedOccFindings.filter(f => f.natureza === 'contraria').length;
                  const neuCount = reviewedOccFindings.filter(f => f.natureza === 'neutra').length;
                  const pendingCount = occFindings.filter(f => f.reviewStatus === 'pendente' || !f.natureza).length;

                  return (
                    <div key={occ.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-[10px] bg-orange-100/80 text-orange-900 border border-orange-200/80 px-1.5 py-0.2 rounded font-semibold uppercase tracking-wide">
                                Ocorrência nesta organização
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mt-1">
                              {painObj?.titulo || occ.dorConsolidadaId}
                            </h4>
                          </div>

                          {measured ? (
                            <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border shrink-0 ${
                              score! >= 20 
                                ? 'bg-orange-100 text-orange-900 border-orange-200' 
                                : 'bg-slate-100 text-slate-800 border-slate-200'
                            }`}>
                              Pain Score: {score}/25
                            </span>
                          ) : (
                            <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                              Não mensurado
                            </span>
                          )}
                        </div>

                        <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                          {occ.notasEspecificas}
                        </p>

                        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                          <span className="text-slate-400 font-medium">Evidências locais:</span>
                          <EvidenceCompositionBadge favCount={favCount} conCount={conCount} neuCount={neuCount} />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-mono text-[10px]">{occ.id}</span>
                        <Link
                          to="/dores/$painId"
                          params={{ painId: occ.dorConsolidadaId }}
                          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        >
                          Ver consolidação da dor na vertical <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* BLOCO 3: STACK & OPERATIONS GAP RESUMIDO */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  Stack & Operations Gap Resumido
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visão rápida das ferramentas em uso e sinais de trabalho manual ocorrendo fora do software.
                </p>
              </div>
              {org.stackTecnologico.length > 0 && (
                <button
                  onClick={() => setActiveTab('tecnologia')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline flex items-center gap-1"
                >
                  Ver Tecnologia & Gap <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {org.stackTecnologico.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center space-y-2">
                <Cpu className="w-6 h-6 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800">Stack tecnológico ainda não mapeado</h4>
                <p className="text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed">
                  Mapear as ferramentas utilizadas ajuda a identificar onde o trabalho acontece dentro e fora dos sistemas atuais (gap operacional).
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {org.stackTecnologico.slice(0, 3).map(stk => (
                  <div key={stk.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{stk.nome}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200/80 text-slate-700">
                        {stk.categoria}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Satisfação percebida: <strong className="text-slate-800">{stk.satisfacaoPercebida}/5</strong>
                    </div>

                    {stk.oQueAconteceFora && (
                      <div className="p-2 rounded bg-rose-50/80 border border-rose-200/80 text-rose-950 space-y-0.5">
                        <span className="text-[10px] font-bold text-rose-800 flex items-center gap-1 uppercase tracking-wider">
                          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                          Gap (Fora do Software):
                        </span>
                        <p className="text-[11px] text-rose-900/90 line-clamp-2 leading-relaxed">
                          {stk.oQueAconteceFora}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BLOCO 4: PRÓXIMA INVESTIGAÇÃO */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Próxima Investigação
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Próximos passos recomendados por regras determinísticas para aumentar a maturidade desta pesquisa.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {(() => {
                const steps: {
                  id: string;
                  title: string;
                  description: string;
                  actionText: string;
                  onAction: () => void;
                }[] = [];

                if (orgInterviews.length === 0) {
                  steps.push({
                    id: 'interview',
                    title: 'Conduzir a primeira entrevista',
                    description: 'Nenhuma entrevista registrada ainda para esta organização.',
                    actionText: '+ Conduzir Entrevista',
                    onAction: () => onNewInterviewClick?.(),
                  });
                }

                if (orgInterviews.length > 0 && org.processos.length === 0) {
                  steps.push({
                    id: 'process',
                    title: 'Mapear fluxo de processos',
                    description: 'Mapear pelo menos um processo operacional citado nas entrevistas.',
                    actionText: 'Mapear Processos',
                    onAction: () => setActiveTab('processos'),
                  });
                }

                if (orgFindings.length > 0 && orgPainOccurrences.length === 0) {
                  steps.push({
                    id: 'pain-occ',
                    title: 'Mapear ocorrências de dores',
                    description: 'Revisar os achados extraídos e associar problemas recorrentes a dores da vertical.',
                    actionText: 'Ver Achados',
                    onAction: () => setActiveTab('achados'),
                  });
                }

                if (orgPainOccurrences.some(o => !isPainScoreMeasured(o))) {
                  steps.push({
                    id: 'eval-pain',
                    title: 'Avaliar Pain Score pendente',
                    description: 'Avaliar o Pain Score nas 5 dimensões das ocorrências ainda não mensuradas.',
                    actionText: 'Avaliar Dores',
                    onAction: () => setActiveTab('dores'),
                  });
                }

                if (org.entrevistados.length < 2) {
                  steps.push({
                    id: 'more-people',
                    title: 'Ampliar perfis investigados',
                    description: 'Cadastrar e entrevistar outro perfil ou área funcional da organização.',
                    actionText: 'Ver Pessoas',
                    onAction: () => setActiveTab('pessoas'),
                  });
                }

                // Fallback default step if steps array is empty
                if (steps.length === 0) {
                  steps.push({
                    id: 'deep-dive',
                    title: 'Aprofundar evidências',
                    description: 'Aprofundar a validação das evidências e reavaliar o Pain Score com novos relatos.',
                    actionText: 'Ver Ocorrências de Dores',
                    onAction: () => setActiveTab('dores'),
                  });
                }

                // Select top 1-3 steps
                return steps.slice(0, 3).map(st => (
                  <div key={st.id} className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2 flex flex-col justify-between text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{st.title}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {st.description}
                      </p>
                    </div>

                    <button
                      onClick={st.onAction}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-colors self-start shadow-2xs mt-2"
                    >
                      <span>{st.actionText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 2. PERFIL DA ORGANIZAÇÃO (PRD Seção 10) */}
      {activeTab === 'perfil' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Características Gerais & Perfil Econômico</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-slate-500 block">Identificação:</span>
                  <span className="font-bold text-slate-900">{org.nome} ({org.id})</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 block">Localização:</span>
                  <span>{org.cidade} / {org.estado} — Região {org.regiao}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 block">Especialização:</span>
                  <span>{org.especializacao}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 block">Perfil dos Clientes:</span>
                  <span>{org.perfilClientes}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 block">Tempo de Operação:</span>
                  <span>{org.anosOperacao} anos no mercado</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-slate-500 block">Faixa de Faturamento:</span>
                  <span className="font-mono text-slate-900 font-semibold">{org.faixaFaturamento || 'Não informada'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 block">Ticket Médio do Serviço:</span>
                  <span className="font-mono text-slate-900 font-semibold">{org.ticketMedioServico || 'Não informado'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 block">Estrutura da Equipe:</span>
                  <p className="text-slate-600 mt-0.5">{org.estruturaEquipe}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 block">Observações do Pesquisador:</span>
                  <p className="text-slate-600 mt-0.5 italic">{org.observacoes}</p>
                </div>
              </div>
            </div>
          </div>

          {(!org.faixaFaturamento || !org.ticketMedioServico || !org.estruturaEquipe) && (
            <div className="p-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <h4 className="font-bold text-slate-800">Perfil da organização ainda incompleto</h4>
              </div>
              <p className="text-slate-600 leading-relaxed max-w-2xl">
                Características como porte, operação, tipo de cliente e estrutura ajudam a interpretar corretamente as evidências coletadas e o contexto das dores operacionais.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. TECNOLOGIA & STACK (PRD Seção 12) */}
      {activeTab === 'tecnologia' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Stack Tecnológico & Pergunta Obrigatória do Gap</h3>
            <p className="text-xs text-slate-500">
              Mapeamento de ferramentas e identificação do que continua ocorrendo manualmente fora do software principal (PRD Seção 12).
            </p>
          </div>

          {org.stackTecnologico.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-dashed border-slate-200 text-center space-y-3">
              <Cpu className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Stack tecnológico ainda não mapeado</h4>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Mapear as ferramentas utilizadas ajuda a identificar onde o trabalho acontece dentro e fora dos sistemas atuais, revelando gargalos e o que continua sendo executado manualmente fora do software (gap operacional).
                </p>
              </div>
              {orgInterviews.length > 0 ? (
                <button
                  onClick={() => setActiveTab('entrevistas')}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs mt-2"
                >
                  <MessageSquareText className="w-3.5 h-3.5" />
                  <span>Ver Entrevistas</span>
                </button>
              ) : onNewInterviewClick ? (
                <button
                  onClick={onNewInterviewClick}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Conduzir primeira entrevista</span>
                </button>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {org.stackTecnologico.map(stk => (
                <div key={stk.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-slate-900">{stk.nome}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {stk.categoria}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px]">
                      <span className="text-slate-500">Satisfação percebida:</span>
                      <span className="font-bold text-slate-900">{stk.satisfacaoPercebida}/5</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-600">
                    <div>
                      <strong>Finalidade:</strong> {stk.finalidade}
                    </div>
                    <div>
                      <strong>Quem utiliza:</strong> {stk.quemUtiliza} ({stk.frequencia})
                    </div>
                    <div>
                      <strong>Limitações observadas:</strong> {stk.limitacoes}
                    </div>
                    <div>
                      <strong>Processos atendidos:</strong> {stk.processosAtendidos.join(', ')}
                    </div>
                  </div>

                  {/* Pergunta Obrigatória (Seção 12) */}
                  <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-200 text-rose-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-rose-900">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Pergunta Obrigatória: O que continua acontecendo fora dessa ferramenta?
                    </div>
                    <p className="text-rose-900/90 text-xs leading-relaxed">
                      {stk.oQueAconteceFora}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. PESSOAS / ENTREVISTADOS (PRD Seção 15) */}
      {activeTab === 'pessoas' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Entrevistados da Organização (PRD Seção 15)</h3>
              <p className="text-xs text-slate-500">Cada entrevistado pertence unicamente à sua organização.</p>
            </div>
          </div>

          {org.entrevistados.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-center space-y-3">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Nenhum perfil de entrevistado mapeado</h4>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Diferentes papéis e áreas funcionais podem vivenciar o mesmo processo e a mesma dor de maneiras distintas. O mapeamento dos entrevistados permite correlacionar achados e visões específicas.
                </p>
              </div>
              {onNewInterviewClick && (
                <button
                  onClick={onNewInterviewClick}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Conduzir primeira entrevista</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {org.entrevistados.map(person => {
                const personInterviews = entrevistas.filter(e => e.entrevistadoId === person.id);

                return (
                  <div key={person.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{person.nome}</div>
                        <div className="text-slate-500 text-[11px]">{person.cargo} • Área: {person.area}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                        {person.perfil}
                      </span>
                    </div>

                    <p className="text-slate-600 text-[11px] italic">
                      "{person.observacoes}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-[11px]">
                      <span className="text-slate-500">{personInterviews.length} entrevista(s) vinculada(s)</span>
                      {personInterviews[0] ? (
                        <Link
                          to="/entrevistas/$interviewId"
                          params={{ interviewId: personInterviews[0].id }}
                          className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
                        >
                          Acessar Roteiro <ArrowRight className="w-3 h-3" />
                        </Link>
                      ) : (
                        <button
                          onClick={onNewInterviewClick}
                          className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
                        >
                          Acessar Roteiro <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. ENTREVISTAS (PRD Seção 16) */}
      {activeTab === 'entrevistas' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Histórico de Entrevistas Realizadas</h3>
            {onNewInterviewClick && (
              <button
                onClick={onNewInterviewClick}
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Nova Entrevista</span>
              </button>
            )}
          </div>

          {orgInterviews.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-center space-y-3">
              <MessageSquareText className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Nenhuma entrevista realizada</h4>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  As entrevistas são a principal fonte de evidência primária da investigação desta organização. Elas fornecem relatos diretos sobre rotinas, dificuldades e uso de ferramentas.
                </p>
              </div>
              {onNewInterviewClick && (
                <button
                  onClick={onNewInterviewClick}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Conduzir primeira entrevista</span>
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orgInterviews.map(ent => {
                const person = org.entrevistados.find(p => p.id === ent.entrevistadoId);

                return (
                  <div key={ent.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{ent.id}</span>
                        <span className="font-semibold text-slate-700">— {person?.nome} ({person?.cargo})</span>
                        <span className="px-2 py-0.2 rounded text-[10px] bg-slate-100 text-slate-700">
                          {ent.tipo}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Data: {ent.data} • Duração: {ent.duracaoMinutos} min • {ent.perguntas.length} perguntas aplicadas • {ent.achadosGeradosIds.length} achados gerados
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1 line-clamp-1 italic">
                        "{ent.notasGerais}"
                      </p>
                    </div>

                    <Link
                      to="/entrevistas/$interviewId"
                      params={{ interviewId: ent.id }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-xs font-semibold text-slate-700 transition-colors shrink-0"
                    >
                      Abrir Roteiro & Respostas
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. PROCESSOS MAPEADOS & FLUXO VISUAL (PRD Seção 13 e 14) */}
      {activeTab === 'processos' && (
        <div className="space-y-4">
          {org.processos.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-dashed border-slate-200 text-center space-y-3">
              <GitCommit className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Nenhum processo operacional mapeado</h4>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Processos conectam atividades, ferramentas, pessoas, handoffs e dificuldades observadas.
                  {orgInterviews.length > 0 
                    ? ' Use as entrevistas já realizadas para identificar e estruturar os principais fluxos operacionais.'
                    : ' Inicie conduzindo entrevistas com a equipe da organização para mapear como as atividades são executadas no dia a dia.'}
                </p>
              </div>
              {orgInterviews.length > 0 ? (
                <button
                  onClick={() => setActiveTab('entrevistas')}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs mt-2"
                >
                  <MessageSquareText className="w-3.5 h-3.5" />
                  <span>Ver Entrevistas</span>
                </button>
              ) : onNewInterviewClick ? (
                <button
                  onClick={onNewInterviewClick}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Conduzir primeira entrevista</span>
                </button>
              ) : null}
            </div>
          ) : (
            org.processos.map(proc => (
              <div key={proc.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-slate-400">{proc.id}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{proc.nome} ({proc.area})</h3>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 font-mono text-sm">{proc.tempoEstimadoHorasMes} horas/mês</span>
                    <span className="text-[11px] text-slate-500 block">{proc.frequencia} • {proc.pessoasEnvolvidas} pessoas envolvidas</span>
                  </div>
                </div>

                <p className="text-slate-600">{proc.descricao}</p>

                {/* Visual Process Flow (PRD Seção 14: Cards/Etapas conectadas) */}
                <div className="space-y-2 pt-2">
                  <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                    Fluxo Visual de Etapas Conectadas (PRD Seção 14)
                  </div>
                  
                  <div className="flex items-center gap-2 overflow-x-auto py-3 px-1">
                    {proc.etapas.map((step, idx) => (
                      <React.Fragment key={step.id}>
                        <div className="min-w-[170px] max-w-[190px] p-3 rounded-lg border border-slate-200 bg-slate-50 shadow-2xs space-y-1 shrink-0">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-bold font-mono">Passo {step.ordem}</span>
                            <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold">{step.ferramenta}</span>
                          </div>
                          <div className="font-semibold text-slate-900 text-xs line-clamp-2">
                            {step.acao}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Ator: {step.ator}
                          </div>
                          {step.gargaloOuErro && (
                            <div className="text-[10px] text-rose-700 font-medium bg-rose-50 p-1 rounded">
                              Gargalo: {step.gargaloOuErro}
                            </div>
                          )}
                        </div>

                        {idx < proc.etapas.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-slate-600">
                  <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200">
                    <strong className="text-amber-900 block mb-1">Gargalos Identificados:</strong>
                    <p className="text-amber-900/90 text-xs">{proc.gargalos}</p>
                  </div>
                  <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-200">
                    <strong className="text-rose-900 block mb-1">Erros & Retrabalho:</strong>
                    <p className="text-rose-900/90 text-xs">{proc.errosERetrabalho}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 7. ACHADOS (PRD Seção 25 e 26) */}
      {activeTab === 'achados' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Achados Extraídos da Organização</h3>
              <p className="text-xs text-slate-500">
                Preservação estrita da <strong>Fala Original</strong> separadamente da <strong>Interpretação Analítica</strong> (PRD Seção 26).
              </p>
            </div>
            {onNewFindingClick && (
              <button
                onClick={onNewFindingClick}
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Novo Achado</span>
              </button>
            )}
          </div>

          {orgFindings.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-center space-y-3">
              <Quote className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Nenhum achado extraído</h4>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Achados transformam respostas e observações das entrevistas em evidências estruturadas e rastreáveis.
                  {orgInterviews.length === 0
                    ? ' A investigação precisa começar pela realização das entrevistas.'
                    : ' Revise as respostas das entrevistas já realizadas para extrair citações e interpretar observações.'}
                </p>
              </div>
              {orgInterviews.length === 0 && onNewInterviewClick ? (
                <button
                  onClick={onNewInterviewClick}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Conduzir primeira entrevista</span>
                </button>
              ) : onNewFindingClick ? (
                <button
                  onClick={onNewFindingClick}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Novo Achado</span>
                </button>
              ) : orgInterviews.length > 0 ? (
                <button
                  onClick={() => setActiveTab('entrevistas')}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs mt-2"
                >
                  <MessageSquareText className="w-3.5 h-3.5" />
                  <span>Ver Entrevistas</span>
                </button>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3">
              {orgFindings.map(ach => {
                const relatedOcc = orgPainOccurrences.find(o => o.achadosIds.includes(ach.id) || (ach.dorConsolidadaId && o.dorConsolidadaId === ach.dorConsolidadaId));
                const painObj = doresConsolidadas.find(d => d.id === ach.dorConsolidadaId);

                return (
                <div key={ach.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded">{ach.id}</span>
                      <h4 className="font-bold text-slate-900 text-sm">{ach.titulo}</h4>
                    </div>
                    <EvidenceNatureBadge nature={ach.natureza} reviewStatus={ach.reviewStatus} />
                  </div>

                  {/* Fala Original Preservada & Versão Revisada (Pontos 4 e 5) */}
                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-slate-800 space-y-2 shadow-2xs">
                    <div className="flex items-start gap-2 italic">
                      <Quote className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 not-italic uppercase tracking-wider block">
                          Fala Original Capturada (Imutável):
                        </span>
                        <span className="text-xs leading-relaxed">"{ach.fraseOriginal}"</span>
                      </div>
                    </div>
                    {ach.fraseRevisada && (
                      <div className="pl-6 pt-1.5 border-t border-slate-100 text-xs italic text-slate-900 font-medium flex items-start gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-700 not-italic uppercase tracking-wider block shrink-0">
                          Versão Revisada:
                        </span>
                        <span>"{ach.fraseRevisada}"</span>
                      </div>
                    )}
                  </div>

                  {/* Interpretação Analítica */}
                  <div className="p-2.5 rounded-lg bg-slate-100/70 text-slate-700 text-[11px] leading-relaxed">
                    <strong className="text-slate-900">Interpretação Analítica:</strong> {ach.interpretacao}
                  </div>

                  {/* Evidence Chain / Status Message */}
                  {ach.reviewStatus === 'descartado' ? (
                    <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] space-y-1">
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Histórico de Auditoria (Captura Descartada):</span>
                      <div className="text-slate-700 font-medium">
                        Motivo: {ach.motivoDescarte || 'Descartado na revisão analítica pós-entrevista'}
                      </div>
                      <div className="text-slate-500 text-[10px]">
                        Esta captura permanece no histórico para rastreabilidade, porém não entra no Evidence Composition nem gera ocorrência de dor.
                      </div>
                    </div>
                  ) : ach.reviewStatus === 'pendente' || !ach.natureza ? (
                    <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] space-y-1">
                      <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">Rastreabilidade em Campo (Captura Pendente):</span>
                      <div className="text-amber-800">
                        Captura rápida aguardando revisão analítica pós-entrevista. Não vinculada a Dor nem ao Evidence Composition.
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] space-y-1">
                      <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">Rastreabilidade (Evidence Chain Mínima):</span>
                      <div className="flex items-center gap-1.5 flex-wrap text-slate-700">
                        <span className="font-semibold text-slate-900 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-blue-600" />
                          Achado ({ach.id})
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-900">
                          Ocorrência Local ({relatedOcc ? relatedOcc.id : 'Não associada'})
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                        {painObj ? (
                          <Link
                            to="/dores/$painId"
                            params={{ painId: painObj.id }}
                            className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Dor Consolidada: {painObj.titulo} <ArrowRight className="w-2.5 h-2.5" />
                          </Link>
                        ) : (
                          <span className="text-slate-400">Sem dor consolidada</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Links e Metadados */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
                    <div className="flex items-center gap-2 flex-wrap text-slate-500">
                      <span>Origem: <strong>{ach.origem}</strong></span>
                      <span>•</span>
                      <span>Categoria: <strong>{ach.categoria}</strong></span>
                      <span>•</span>
                      <span>Data: <strong>{ach.dataRegistro}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {ach.entrevistaId && (
                        <Link
                          to="/entrevistas/$interviewId"
                          params={{ interviewId: ach.entrevistaId }}
                          className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-blue-600 font-semibold flex items-center gap-1 shadow-2xs text-[11px]"
                        >
                          <MessageSquareText className="w-3 h-3 text-blue-500" />
                          <span>Ver Entrevista #{ach.entrevistaId}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </Link>
                      )}
                      {ach.dorConsolidadaId && (
                        <Link
                          to="/dores/$painId"
                          params={{ painId: ach.dorConsolidadaId }}
                          className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-semibold flex items-center gap-1 text-[11px]"
                        >
                          <Flame className="w-3 h-3 text-blue-600" />
                          <span>Ver Dor Consolidada</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* 8. OCORRÊNCIAS DE DORES & PAIN SCORE (PRD Seção 28 e 29) */}
      {activeTab === 'dores' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Ocorrências de Dores & Pain Score (0–25)</h3>
            <p className="text-xs text-slate-500">
              Clara distinção visual entre a <strong>Ocorrência Local nesta organização</strong> e a <strong>Dor Consolidada na Vertical</strong> (PRD Seção 28 e 29).
            </p>
          </div>

          {orgPainOccurrences.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-dashed border-slate-200 text-center space-y-3">
              <Flame className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Nenhuma ocorrência de dor identificada</h4>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Uma ocorrência registra como uma dor aparece especificamente nesta organização e permite posteriormente compará-la entre organizações da mesma vertical.
                  {orgFindings.length > 0
                    ? ' Os achados existentes podem ser revisados na aba Achados para identificar problemas e associar a dores.'
                    : orgInterviews.length > 0
                    ? ' Primeiro extraia achados das entrevistas para identificar dores operacionais.'
                    : ' A investigação precisa começar pela realização de entrevistas.'}
                </p>
              </div>
              {orgFindings.length > 0 ? (
                <button
                  onClick={() => setActiveTab('achados')}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs mt-2"
                >
                  <Quote className="w-3.5 h-3.5" />
                  <span>Ver Achados Extraídos</span>
                </button>
              ) : orgInterviews.length > 0 ? (
                <button
                  onClick={() => setActiveTab('entrevistas')}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs mt-2"
                >
                  <MessageSquareText className="w-3.5 h-3.5" />
                  <span>Ver Entrevistas</span>
                </button>
              ) : onNewInterviewClick ? (
                <button
                  onClick={onNewInterviewClick}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Conduzir primeira entrevista</span>
                </button>
              ) : null}
            </div>
          ) : (
            <div className="space-y-5">
              {orgPainOccurrences.map(occ => {
                const painObj = doresConsolidadas.find(d => d.id === occ.dorConsolidadaId);
              const isEditing = editingPainId === occ.id;
              const measured = isPainScoreMeasured(occ);
              const score = measured ? occ.painScore!.total : null;
              const occFindings = achados.filter(f => occ.achadosIds.includes(f.id));
              const reviewedOccFindings = occFindings.filter(f => f.reviewStatus !== 'pendente' && Boolean(f.natureza));
              const favCount = reviewedOccFindings.filter(f => f.natureza === 'favoravel').length;
              const conCount = reviewedOccFindings.filter(f => f.natureza === 'contraria').length;
              const neuCount = reviewedOccFindings.filter(f => f.natureza === 'neutra').length;
              const pendingCount = occFindings.filter(f => f.reviewStatus === 'pendente' || !f.natureza).length;

              // Consolidated vertical stats for this pain
              const stats = painObj ? calculatePainConsolidation(painObj.id, ocorrenciasDores, organizacoes.length, achados) : null;
              const relatedOpp = painObj ? oportunidades.find(op => op.doresRelacionadasIds.includes(painObj.id)) : null;

              return (
                <div key={occ.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden text-xs">
                  {/* NÍVEL 1: ORGANIZAÇÃO (OCORRÊNCIA LOCAL) */}
                  <div className="p-5 space-y-3 bg-white">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold bg-orange-100 text-orange-900 border border-orange-200 px-2 py-0.5 rounded uppercase tracking-wider">
                            Ocorrência nesta organização
                          </span>
                          <span className="font-mono text-xs text-slate-500">{occ.id}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                          {painObj?.titulo || occ.dorConsolidadaId}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-slate-400 text-[10px] block font-semibold uppercase">Pain Score Local</span>
                          {measured ? (
                            <span className="font-mono font-bold text-lg text-orange-800">{score}/25</span>
                          ) : (
                            <span className="font-mono font-semibold text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mt-0.5">
                              Não mensurado
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setEditingPainId(isEditing ? null : occ.id)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors"
                        >
                          {isEditing ? 'Fechar Edição' : (measured ? 'Ajustar Dimensões' : 'Avaliar Dimensões')}
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed">{occ.notasEspecificas}</p>

                    {/* Evidências locais */}
                    <div className="flex items-center justify-between gap-2 flex-wrap p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-slate-600 font-semibold text-[11px]">Evidências Locais:</span>
                        <EvidenceCompositionBadge favCount={favCount} conCount={conCount} neuCount={neuCount} />
                        <span className="text-slate-400 text-[11px]">
                          ({occFindings.length} achado{occFindings.length !== 1 ? 's' : ''} nesta organização)
                        </span>
                      </div>

                      {/* Evidence Chain mínima */}
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                        <span>Achados ({occFindings.length})</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className="font-bold text-slate-800">Ocorrência ({occ.id})</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span>Vertical ({occ.dorConsolidadaId})</span>
                      </div>
                    </div>

                    {/* Pain Score 5 Dimensions Breakdown */}
                    <div className="grid grid-cols-5 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Frequência</span>
                        <span className="font-mono font-bold text-slate-800 text-sm">
                          {measured ? `${occ.painScore!.frequencia}/5` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Tempo/Custo</span>
                        <span className="font-mono font-bold text-slate-800 text-sm">
                          {measured ? `${occ.painScore!.tempoCusto}/5` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Severidade</span>
                        <span className="font-mono font-bold text-slate-800 text-sm">
                          {measured ? `${occ.painScore!.severidade}/5` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Manualidade</span>
                        <span className="font-mono font-bold text-slate-800 text-sm">
                          {measured ? `${occ.painScore!.manualidade}/5` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Repetibilidade</span>
                        <span className="font-mono font-bold text-slate-800 text-sm">
                          {measured ? `${occ.painScore!.repetibilidade}/5` : '—'}
                        </span>
                      </div>
                    </div>

                    {/* Slider Editor */}
                    {isEditing && (
                      <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-blue-900 text-xs">Avaliar / Ajustar Dimensões do Pain Score (0–5):</div>
                          <span className="text-[10px] text-blue-700">Preencha as 5 dimensões conscientemente</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                          {(['frequencia', 'tempoCusto', 'severidade', 'manualidade', 'repetibilidade'] as const).map(dim => {
                            const currentVal = (occ.painScore && typeof occ.painScore[dim] === 'number') ? occ.painScore[dim] : 0;
                            return (
                              <div key={dim} className="space-y-1 text-slate-700">
                                <label className="text-[11px] font-semibold capitalize block">
                                  {dim}: {currentVal}
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="5"
                                  value={currentVal}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    const baseScore = occ.painScore || {
                                      frequencia: 0,
                                      tempoCusto: 0,
                                      severidade: 0,
                                      manualidade: 0,
                                      repetibilidade: 0,
                                      total: 0
                                    };
                                    updatePainScore(occ.id, {
                                      frequencia: dim === 'frequencia' ? val : (baseScore.frequencia ?? 0),
                                      tempoCusto: dim === 'tempoCusto' ? val : (baseScore.tempoCusto ?? 0),
                                      severidade: dim === 'severidade' ? val : (baseScore.severidade ?? 0),
                                      manualidade: dim === 'manualidade' ? val : (baseScore.manualidade ?? 0),
                                      repetibilidade: dim === 'repetibilidade' ? val : (baseScore.repetibilidade ?? 0)
                                    });
                                  }}
                                  className="w-full cursor-pointer accent-blue-600"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* VISUAL CONNECTOR: Ocorrência Local -> Contribui Para -> Dor Consolidada na Vertical */}
                  <div className="bg-slate-100/90 border-y border-slate-200 px-5 py-2 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-slate-600 font-semibold">
                      <ArrowDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Esta ocorrência local contribui para a consolidação na vertical:</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 font-semibold uppercase">Visão de Mercado</span>
                  </div>

                  {/* NÍVEL 2: VERTICAL (DOR CONSOLIDADA NA VERTICAL) */}
                  <div className="p-4 sm:p-5 bg-slate-50/70 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200 px-2 py-0.5 rounded uppercase tracking-wider">
                            Dor consolidada na vertical
                          </span>
                          {stats?.amostraLimitada && (
                            <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                              Amostra limitada
                            </span>
                          )}
                          {relatedOpp && (
                            <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
                              Nível Evidência: {relatedOpp.evidenceLevel}
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-slate-900 text-sm">
                          {painObj?.titulo}
                        </h5>
                      </div>

                      {painObj && (
                        <Link
                          to="/dores/$painId"
                          params={{ painId: painObj.id }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs self-start sm:self-auto shrink-0"
                        >
                          <span>Ver Consolidação na Vertical</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>

                    {stats && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-slate-600">
                          <span className="text-slate-400 block text-[10px]">Incidência na Vertical</span>
                          <strong className="text-slate-900 font-mono text-xs">
                            {stats.orgsComDor} de {stats.totalOrgsVertical} organizações ({stats.incidenciaPercent}%)
                          </strong>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-slate-600">
                          <span className="text-slate-400 block text-[10px]">Pain Score Médio na Vertical</span>
                          <strong className="text-slate-900 font-mono text-xs">
                            {stats.ocorrenciasMensuradasCount > 0 ? `${stats.media}/25` : 'Nenhum mensurado'}
                          </strong>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-slate-600">
                          <span className="text-slate-400 block text-[10px]">Total de Evidências na Vertical</span>
                          <div className="mt-0.5">
                            <EvidenceCompositionBadge
                              favCount={stats.evidenciasFavoraveis}
                              conCount={stats.evidenciasContrarias}
                              neuCount={stats.evidenciasNeutras}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}
    </div>
  );
};
