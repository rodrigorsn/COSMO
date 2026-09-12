import React, { useState } from 'react';
import { Link, useMatches } from '@tanstack/react-router';
import { useRadar } from '../../context/RadarContext';
import { calculatePainConsolidation, isPainScoreMeasured, evaluateEvidenceLevel } from '../../utils/calculations';
import { EvidenceNatureBadge, EvidenceCompositionBadge, EvidenceLevelBadge } from '../common/Badge';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { ROUTES } from '../../navigation/routeMap';
import { EvidenceLevel } from '../../types/radar';
import { 
  ArrowLeft, 
  ChevronRight,
  HelpCircle,
  Quote, 
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
  GitCompare,
  Filter,
  User,
  FileText,
  Workflow,
  Layers,
  Cpu,
  FileSpreadsheet,
  Target,
  Compass,
  Search,
  Users,
  AlertCircle
} from 'lucide-react';

interface PainDetailViewProps {
  painId?: string;
}

export const PainDetailView: React.FC<PainDetailViewProps> = ({ painId: propPainId }) => {
  const [showLevelPopover, setShowLevelPopover] = useState(false);
  const [natureFilter, setNatureFilter] = useState<'todas' | 'favoravel' | 'contraria' | 'neutra'>('todas');

  const { 
    doresConsolidadas, 
    ocorrenciasDores, 
    organizacoes, 
    entrevistas,
    achados, 
    oportunidades,
    verticais
  } = useRadar();

  // Resolução da fonte da verdade: parâmetro da rota dinâmica do TanStack Router
  const matches = useMatches();
  const painMatch = matches.find(m => m.routeId === '/dores/$painId');
  const routePainId = (painMatch?.params as Record<string, string> | undefined)?.painId;

  // Fonte de seleção: parâmetro da rota (TanStack Router) ou prop
  const effectivePainId = propPainId || routePainId;

  // Busca a dor correspondente ao ID da URL
  const pain = effectivePainId ? doresConsolidadas.find(p => p.id === effectivePainId) : null;

  // Tratamento explícito de Dor Não Encontrada (PRD Seção 8 / Etapa 2C)
  if (!pain) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-xs">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-full">
            Dor não encontrada
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Nenhuma dor consolidada encontrada para "{effectivePainId}"
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            O identificador fornecido na URL não corresponde a nenhuma dor consolidada registrada nesta vertical de pesquisa.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to={ROUTES.DORES}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a Lista de Dores
          </Link>
        </div>
      </div>
    );
  }

  // Resolução dinâmica da Vertical e organizações da vertical
  const vertical = pain.verticalId ? verticais.find(v => v.id === pain.verticalId) : null;
  const verticalNome = vertical ? vertical.nome : (pain.verticalId || 'Vertical não identificada');

  const verticalOrgs = pain.verticalId ? organizacoes.filter(o => o.verticalId === pain.verticalId) : organizacoes;
  const stats = calculatePainConsolidation(pain.id, ocorrenciasDores, verticalOrgs.length, achados, entrevistas, verticalOrgs);

  const relevantOccurrences = ocorrenciasDores.filter(o => o.dorConsolidadaId === pain.id);
  const unmeasuredCount = relevantOccurrences.length - stats.ocorrenciasMensuradasCount;
  const relevantFindings = achados.filter(f => f.dorConsolidadaId === pain.id);
  const reviewedFindings = relevantFindings.filter(f => (f.reviewStatus === 'revisado' || f.reviewStatus === undefined) && Boolean(f.natureza));
  const favorableFindings = reviewedFindings.filter(f => f.natureza === 'favoravel');
  const contraryFindings = reviewedFindings.filter(f => f.natureza === 'contraria');
  const neutralFindings = reviewedFindings.filter(f => f.natureza === 'neutra');

  const pendingFindings = relevantFindings.filter(f => f.reviewStatus === 'pendente' || (f.reviewStatus !== 'descartado' && !f.natureza));
  const discardedFindings = relevantFindings.filter(f => f.reviewStatus === 'descartado');

  // Helper para resolução do entrevistado e cargo (Etapa 5A.5)
  const getIntervieweeInfo = (f: typeof achados[0]) => {
    const org = organizacoes.find(o => o.id === f.organizacaoId);
    let interviewee: any = null;

    if (org?.entrevistados && f.entrevistadoId) {
      interviewee = org.entrevistados.find(e => e.id === f.entrevistadoId);
    }

    if (!interviewee && f.entrevistaId) {
      const interview = entrevistas.find(i => i.id === f.entrevistaId);
      if (interview?.entrevistadoId) {
        if (org?.entrevistados) {
          interviewee = org.entrevistados.find(e => e.id === interview.entrevistadoId);
        }
        if (!interviewee) {
          for (const o of organizacoes) {
            const found = o.entrevistados?.find(e => e.id === interview.entrevistadoId);
            if (found) {
              interviewee = found;
              break;
            }
          }
        }
      }
    }

    if (interviewee) {
      const role = interviewee.cargo || interviewee.perfil || interviewee.area || '';
      return {
        found: true,
        nome: interviewee.nome,
        cargo: role,
        label: role ? `${interviewee.nome} — ${role}` : interviewee.nome
      };
    }

    return {
      found: false,
      label: 'Entrevistado não identificado'
    };
  };

  // Helper para renderização dos cards da Matriz de Evidências (Etapa 5A.5)
  const renderEvidenceCard = (f: typeof achados[0], nature: 'favoravel' | 'contraria' | 'neutra') => {
    const org = f.organizacaoId ? organizacoes.find(o => o.id === f.organizacaoId) : null;
    const intervieweeInfo = getIntervieweeInfo(f);
    const hasRevisedSpeech = Boolean(f.fraseRevisada && f.fraseRevisada.trim() !== '' && f.fraseRevisada !== f.fraseOriginal);

    const isFav = nature === 'favoravel';
    const isCon = nature === 'contraria';

    const cardBg = isCon ? 'bg-rose-50/60 border-rose-200' : isFav ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50/70 border-slate-200';
    const badgeBg = isCon ? 'bg-rose-100 text-rose-900 border-rose-200' : isFav ? 'bg-emerald-100 text-emerald-900 border-emerald-200' : 'bg-slate-100 text-slate-800 border-slate-200';

    return (
      <div key={f.id} className={`p-4 rounded-xl border text-xs space-y-3 ${cardBg} shadow-2xs`}>
        {/* Cabeçalho do Card: Título & Natureza */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-200/60 pb-2">
          <div className="space-y-1">
            <span className="font-bold text-slate-900 text-sm block leading-snug">{f.titulo}</span>
            <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
              <span className={`font-mono font-bold px-2 py-0.2 rounded border ${badgeBg}`}>
                {isFav ? 'Favorável' : isCon ? 'Contrária / Atenuante' : 'Neutra'}
              </span>
              {f.categoria && (
                <span className="font-mono text-slate-600 bg-white px-2 py-0.2 rounded border border-slate-200">
                  {f.categoria}
                </span>
              )}
            </div>
          </div>
          <span className="font-mono text-[10px] text-slate-400 font-bold shrink-0">
            {f.id}
          </span>
        </div>

        {/* Origem, Organização e Entrevistado (Rastreabilidade da Cadeia) */}
        <div className="space-y-1.5 bg-white/90 p-2.5 rounded-lg border border-slate-200/80 text-[11px] text-slate-700">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-900">
              {org ? (
                <Link
                  to="/organizacoes/$orgId"
                  params={{ orgId: org.id }}
                  className="hover:text-blue-700 hover:underline inline-flex items-center gap-1"
                >
                  {org.nome} <ArrowRight className="w-3 h-3 text-blue-500" />
                </Link>
              ) : (
                f.origem || 'Fonte Externa'
              )}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[10px]">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {intervieweeInfo.label}
            </span>

            {f.entrevistaId ? (
              <Link
                to="/entrevistas/$interviewId"
                params={{ interviewId: f.entrevistaId }}
                className="text-blue-700 hover:text-blue-900 hover:underline font-semibold inline-flex items-center gap-1 shrink-0"
              >
                <FileText className="w-3 h-3 text-blue-600" />
                Ver Entrevista <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <span className="text-slate-400 italic">
                Origem da entrevista indisponível
              </span>
            )}
          </div>
        </div>

        {/* Hierarquia Visual da Fala (Fala Original → Fala Revisada → Interpretação Analítica) */}
        <div className="space-y-2">
          {/* Nível 1: Fala Original Capturada (Imutável) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Fala Original Capturada</span>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                Registro de Campo Imutável
              </span>
            </div>
            <div className="italic text-slate-900 bg-white p-2.5 rounded-lg border border-slate-200/90 leading-relaxed shadow-2xs">
              "{f.fraseOriginal}"
            </div>
          </div>

          {/* Nível 2: Versão Revisada (Se existir e for distinta) */}
          {hasRevisedSpeech && (
            <div className="space-y-1 pt-0.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                <span>Versão Revisada de Transcrição</span>
                <span className="text-[9px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                  Correção de Transcrição
                </span>
              </div>
              <div className="italic text-slate-800 bg-blue-50/40 p-2.5 rounded-lg border border-blue-200/80 leading-relaxed">
                "{f.fraseRevisada}"
              </div>
            </div>
          )}

          {/* Nível 3: Interpretação Analítica */}
          <div className="space-y-1 pt-0.5">
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Interpretação Analítica
            </div>
            <p className="text-slate-700 text-[11px] bg-white/90 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
              {f.interpretacao}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const relatedOpportunities = oportunidades.filter(o => o.doresRelacionadasIds.includes(pain.id));

  // Organizações da amostra investigada (ao menos 1 entrevista com status 'Concluída') - Etapa 5A.3.2 & 5A.4
  const concludedInterviews = entrevistas.filter(i => i.status === 'Concluída');
  const concludedOrgIdsSet = new Set(concludedInterviews.map(i => i.organizacaoId).filter(Boolean));
  const investigatedOrgs = verticalOrgs.filter(o => concludedOrgIdsSet.has(o.id));

  // Amostra de organizações para análise de contexto operacional (Etapa 5A.6)
  const sampleOrganizations = investigatedOrgs.length > 0 
    ? investigatedOrgs 
    : verticalOrgs.filter(o => relevantOccurrences.some(occ => occ.organizacaoId === o.id));

  // Processos explicitamente vinculados via processoId nos achados revisados da Dor
  const explicitlyLinkedProcesses = reviewedFindings
    .filter(f => Boolean(f.processoId))
    .map(f => {
      const org = sampleOrganizations.find(o => o.id === f.organizacaoId) || organizacoes.find(o => o.id === f.organizacaoId);
      const process = org?.processos?.find(p => p.id === f.processoId);
      return process && org ? { process, org, finding: f } : null;
    })
    .filter((item): item is { process: any; org: any; finding: any } => Boolean(item));

  // Processos mapeados na organização sem vínculo explícito aos achados da Dor
  const unlinkedMappedProcesses = sampleOrganizations.flatMap(org => {
    return (org.processos || [])
      .filter(proc => !explicitlyLinkedProcesses.some(ep => ep.process.id === proc.id))
      .map(proc => ({ process: proc, org }));
  });

  // Data Helpers para a Etapa 5A.7 — Lacunas de Evidência & Próxima Investigação
  const primaryContraryFinding = contraryFindings.length > 0 ? contraryFindings[0] : null;
  const primaryContraryOrg = primaryContraryFinding ? (organizacoes.find(o => o.id === primaryContraryFinding.organizacaoId) || null) : null;
  const primaryContraryInterviewee = primaryContraryFinding ? getIntervieweeInfo(primaryContraryFinding) : null;

  const interviewedRolesInfo = reviewedFindings
    .map(f => getIntervieweeInfo(f))
    .filter(info => info.found);

  const roleCounts = {
    socio: interviewedRolesInfo.filter(r => r.cargo.toLowerCase().includes('sócio') || r.cargo.toLowerCase().includes('proprietário') || r.cargo.toLowerCase().includes('fundador')).length,
    gestor: interviewedRolesInfo.filter(r => r.cargo.toLowerCase().includes('supervisora') || r.cargo.toLowerCase().includes('coordenadora') || r.cargo.toLowerCase().includes('gestor')).length,
    operacional: interviewedRolesInfo.filter(r => r.cargo.toLowerCase().includes('analista') || r.cargo.toLowerCase().includes('operacional')).length
  };

  // Cálculo do Evidence Level canônico (H0–H5) para a Dor
  const uniqueOrgsWithReviewedFindings = Array.from(new Set(
    reviewedFindings
      .map(f => f.organizacaoId)
      .filter((id): id is string => Boolean(id))
  ));
  const independentOrgsCount = uniqueOrgsWithReviewedFindings.length;

  const hasExternalSource = reviewedFindings.some(f => f.origem === 'Fonte externa' || f.tipoEvidencia === 'evidencia_observada');
  const hasEconomicSpendingEvidence = reviewedFindings.some(f => f.tipoEvidencia === 'fato' || (f.tags && f.tags.some(t => t.includes('custo') || t.includes('horas') || t.includes('padrao_h3'))));
  const hasCommercialCommitment = reviewedFindings.some(f => f.tipoEvidencia === 'evidencia_comercial');

  const evidenceLevel = evaluateEvidenceLevel(
    independentOrgsCount,
    hasExternalSource,
    hasEconomicSpendingEvidence,
    hasCommercialCommitment
  );

  const evidenceLevelConfigs: Record<EvidenceLevel, { label: string; name: string; shortDesc: string; explanation: string }> = {
    H0: {
      label: 'H0',
      name: 'Suposição / Hipótese',
      shortDesc: 'Sem evidências de campo registradas',
      explanation: 'H0 representa uma suposição ainda não validada por fontes externas ou entrevistas.'
    },
    H1: {
      label: 'H1',
      name: 'Evidência Externa / Secundária',
      shortDesc: 'Suporte de relatórios ou fontes externas',
      explanation: 'H1 indica suporte preliminar vindo de relatórios de mercado, artigos ou pesquisas secundárias.'
    },
    H2: {
      label: 'H2',
      name: 'Evidência Individual',
      shortDesc: 'Confirmado em 1 organização',
      explanation: 'H2 indica confirmação direta com evidências revisadas em uma organização.'
    },
    H3: {
      label: 'H3',
      name: 'Padrão Confirmado',
      shortDesc: `Confirmado em ${independentOrgsCount} organizações independentes`,
      explanation: 'H3 representa um padrão validado em múltiplas organizações independentes da vertical.'
    },
    H4: {
      label: 'H4',
      name: 'Evidência Econômica',
      shortDesc: 'Gastos reais de recursos/headcount',
      explanation: 'H4 demonstra que as organizações alocam dinheiro, tempo ou pessoas reais convivendo com o problema.'
    },
    H5: {
      label: 'H5',
      name: 'Comprometimento Comercial',
      shortDesc: 'Piloto pago / compromisso de compra',
      explanation: 'H5 é o grau máximo de evidência, onde clientes aceitam pagar por um piloto ou protótipo.'
    }
  };

  let levelJustification = '';
  if (evidenceLevel === 'H5') {
    levelJustification = 'Existe registro de evidência comercial (piloto pago ou proposta aceita).';
  } else if (evidenceLevel === 'H4') {
    levelJustification = 'Há evidências revisadas de gasto real de horas/headcount alocado para conter o problema.';
  } else if (evidenceLevel === 'H3') {
    levelJustification = `A dor possui evidências revisadas em ${independentOrgsCount} organizações independentes da vertical.`;
  } else if (evidenceLevel === 'H2') {
    levelJustification = 'Há evidências revisadas em 1 organização pesquisada.';
  } else if (evidenceLevel === 'H1') {
    levelJustification = 'Suportado por dados secundários ou observações externas registradas.';
  } else {
    levelJustification = 'Nenhuma evidência de campo revisada foi associada a esta dor até o momento.';
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Breadcrumb Navigável (TanStack Router) */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link
          to={ROUTES.DORES}
          className="hover:text-slate-900 font-semibold transition-colors hover:underline flex items-center gap-1"
        >
          <span>Dores Consolidadas</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-semibold text-slate-900 truncate max-w-md">{pain.titulo}</span>
      </nav>

      {/* Hero do Dossiê da Dor (Etapa 5A.2) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          {/* Identidade da Dor */}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {pain.id}
              </span>
              <SimulacaoTag compact />
              <span className="text-xs text-slate-600 font-medium bg-blue-50 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-200">
                Vertical: <strong>{verticalNome}</strong>
              </span>
            </div>

            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {pain.titulo}
            </h1>

            <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
              <span>Categoria: <strong>{pain.categoria}</strong></span>
            </div>
          </div>

          {/* Card Destacado do Evidence Level H0–H5 (PRD Seção 35 / Etapa 5A.2) */}
          <div className="w-full lg:w-80 shrink-0 p-3.5 rounded-xl border border-slate-200 bg-slate-50/90 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Nível de Evidência
                </span>
              </div>
              <EvidenceLevelBadge level={evidenceLevel} />
            </div>

            <div>
              <div className="font-bold text-slate-900 text-xs">
                {evidenceLevelConfigs[evidenceLevel].name}
              </div>
              <div className="text-[11px] text-slate-500">
                {evidenceLevelConfigs[evidenceLevel].shortDesc}
              </div>
            </div>

            <p className="text-[10px] text-slate-700 bg-white p-2 rounded border border-slate-200 leading-normal">
              <strong>Justificativa:</strong> {levelJustification}
            </p>

            <button
              type="button"
              onClick={() => setShowLevelPopover(!showLevelPopover)}
              className="w-full text-[10px] font-semibold text-blue-700 hover:text-blue-900 flex items-center justify-center gap-1 cursor-pointer transition-colors pt-0.5"
            >
              <HelpCircle className="w-3 h-3" />
              <span>{showLevelPopover ? 'Ocultar escala H0–H5' : 'Ver escala metodológica (H0–H5)'}</span>
            </button>
          </div>
        </div>

        {/* Popover / Explicação da Escala Metodológica */}
        {showLevelPopover && (
          <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Escala Metodológica de Evidência (H0–H5) — COSMO Framework
              </span>
              <button 
                type="button" 
                onClick={() => setShowLevelPopover(false)}
                className="text-slate-400 hover:text-white cursor-pointer font-bold px-1"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              O Evidence Level indica o grau de maturidade da validação empírica da hipótese de dor na vertical. Não representa nota de qualidade, mas sim a solidez dos fatos coletados.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
              {(Object.entries(evidenceLevelConfigs) as [EvidenceLevel, typeof evidenceLevelConfigs['H0']][]).map(([lvl, cfg]) => {
                const isCurrent = lvl === evidenceLevel;
                return (
                  <div 
                    key={lvl} 
                    className={`p-2.5 rounded-lg border text-[11px] space-y-1 ${
                      isCurrent ? 'border-blue-400 bg-blue-950/80 ring-1 ring-blue-400' : 'border-slate-800 bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold px-1.5 py-0.2 rounded text-[10px] ${
                        isCurrent ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {lvl}
                      </span>
                      <span className="font-bold text-slate-100">{cfg.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{cfg.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Contexto da Dor */}
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
          {pain.descricao}
        </p>

        {/* Snapshot Metodológico da Validação Empírica (Etapa 5A.3.2) */}
        <div className="pt-2 space-y-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>Snapshot da Validação Empírica</span>
            </h3>
            <span className="text-[11px] text-slate-500">
              Análise por organizações na amostra investigada da vertical
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Bloco 1: Amostra Investigada */}
            <div className={`p-3.5 rounded-xl border space-y-2 flex flex-col justify-between ${
              stats.amostraLimitada 
                ? 'bg-amber-50/80 border-amber-300/80 text-amber-950' 
                : 'bg-slate-50/80 border-slate-200 text-slate-900'
            }`}>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Amostra Investigada
                  </span>
                  {stats.amostraLimitada && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                      Amostra limitada
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold font-mono text-slate-900">
                    {stats.totalAmostraInvestigada}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">organizações investigadas</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                  ({stats.totalOrgsVertical} cadastradas na vertical)
                </div>
              </div>

              {stats.amostraLimitada ? (
                <div className="p-2 rounded-lg bg-amber-100/90 border border-amber-200 text-[10px] text-amber-900 leading-snug">
                  <strong>Alerta de Amostra:</strong> {stats.alertaAmostra || `Amostra de ${stats.totalAmostraInvestigada} organização(ões). Percentual preliminar sujeito a validação.`}
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 leading-snug pt-2 border-t border-slate-200/60">
                  Organizações da vertical com ao menos uma entrevista com status concluído.
                </p>
              )}
            </div>

            {/* Bloco 2: Evidência Favorável */}
            <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Evidência Favorável
                  </span>
                  <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
                    {stats.incidenciaFavoravelPercent}% da amostra
                  </span>
                </div>

                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">
                    {stats.orgsFavoraveisCount} de {stats.totalAmostraInvestigada}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">organizações</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-600 leading-snug pt-2 border-t border-slate-200/60">
                Evidência favorável observada em {stats.orgsFavoraveisCount} de {stats.totalAmostraInvestigada} organizações da amostra investigada.
              </p>
            </div>

            {/* Bloco 3: Evidência Contrária / Atenuante */}
            <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                    Evidência Contrária / Atenuante
                  </span>
                  <span className="font-mono text-[11px] font-bold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-200">
                    {stats.incidenciaContrariaPercent}% da amostra
                  </span>
                </div>

                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">
                    {stats.orgsContrariasCount} de {stats.totalAmostraInvestigada}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">organizações</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-600 leading-snug pt-2 border-t border-slate-200/60">
                Evidência contrária ou atenuante observada em {stats.orgsContrariasCount} de {stats.totalAmostraInvestigada} organizações.
              </p>
            </div>

            {/* Bloco 4: Intensidade da Dor (Pain Score) */}
            <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Intensidade da Dor
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {stats.ocorrenciasMensuradasCount} mensurada(s)
                  </span>
                </div>

                {stats.ocorrenciasMensuradasCount > 0 ? (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">Mediana dos Pain Scores:</span>
                      <span className="text-base font-bold text-slate-900 font-mono">{stats.mediana}/25</span>
                    </div>
                    <div className="flex items-baseline justify-between text-[11px] text-slate-500">
                      <span>Média: <strong className="text-slate-800 font-mono">{stats.media}</strong></span>
                      <span>Faixa: <strong className="text-slate-800 font-mono">{stats.minimo}–{stats.maximo}</strong></span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-xs font-medium text-slate-400 italic py-1">
                    Intensidade ainda não mensurada
                  </div>
                )}
              </div>

              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span>Cálculo sobre ocorrências mensuradas</span>
                {unmeasuredCount > 0 && (
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    {unmeasuredCount} não mensurada(s)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Nota Metodológica Integrada (Seção 5A.3.2) */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <strong>Nota Metodológica da Amostra:</strong> Os percentuais representam somente a amostra investigada ({stats.totalAmostraInvestigada} organizações com entrevistas concluídas) e não devem ser interpretados como prevalência estatística do mercado. Uma mesma organização pode contribuir para mais de uma categoria caso apresente evidências de naturezas distintas (mistas).
            </div>
          </div>
        </div>
      </div>

      {/* Seção 5A.4: Organizações & Contextos Observados */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Organizações & Contextos Observados
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare como a hipótese aparece — ou é atenuada — nos diferentes contextos investigados.
            </p>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 self-start md:self-auto">
            {investigatedOrgs.length} de {verticalOrgs.length} organizações investigadas
          </span>
        </div>

        {/* Lista de Cards por Organização */}
        {investigatedOrgs.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
            <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-medium text-slate-600">
              Ainda não há organizações elegíveis para comparação nesta Dor.
            </p>
            <p className="text-xs text-slate-400">
              Organizações da vertical entram na comparação ao concluírem pelo menos uma entrevista de campo.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {investigatedOrgs.map(org => {
              const orgConcludedInterviews = entrevistas.filter(i => i.organizacaoId === org.id && i.status === 'Concluída');
              const orgIntervieweesCount = org.entrevistados ? org.entrevistados.length : 0;
              const orgPainFindings = achados.filter(f => 
                f.organizacaoId === org.id && 
                f.dorConsolidadaId === pain.id && 
                (f.reviewStatus === 'revisado' || f.reviewStatus === undefined) && 
                Boolean(f.natureza)
              );

              const hasFav = orgPainFindings.some(f => f.natureza === 'favoravel');
              const hasCon = orgPainFindings.some(f => f.natureza === 'contraria');
              const hasNeu = orgPainFindings.some(f => f.natureza === 'neutra');
              const isMixed = (hasFav && hasCon) || (hasFav && hasNeu) || (hasCon && hasNeu);

              const orgOccurrence = relevantOccurrences.find(o => o.organizacaoId === org.id);
              const isMeasured = orgOccurrence ? isPainScoreMeasured(orgOccurrence) : false;
              const score = isMeasured && orgOccurrence?.painScore ? orgOccurrence.painScore.total : null;

              const orgSubvertical = org.subvertical || (vertical?.subverticais.find(s => s.id === org.subverticalId)?.nome) || 'Geral';

              const representativeFindings = orgPainFindings.slice(0, 2);

              return (
                <div key={org.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  {/* Cabeçalho e Identificação da Org */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">{org.nome}</span>
                        <span className="font-mono text-[10px] text-slate-500 font-bold bg-slate-200/80 px-1.5 py-0.2 rounded">
                          {org.id}
                        </span>
                        <span className="text-[10px] text-blue-900 bg-blue-100/80 px-2 py-0.2 rounded font-medium border border-blue-200">
                          {orgSubvertical}
                        </span>
                        <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.2 rounded">
                          {org.cidade}{org.estado ? `, ${org.estado}` : ''}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-3 flex-wrap">
                        <span><strong>{org.numClientes}</strong> clientes</span>
                        <span>•</span>
                        <span><strong>{org.numFuncionarios}</strong> colaboradores</span>
                        {org.especializacao && (
                          <>
                            <span>•</span>
                            <span className="italic">{org.especializacao}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Link
                        to="/organizacoes/$orgId"
                        params={{ orgId: org.id }}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs"
                      >
                        Abrir Dossiê da Organização <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Resumo de Investigação e Natureza / Intensidade */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Bloco Investigação & Badges */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Investigação & Natureza das Evidências
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-600">
                        <span><strong>{orgConcludedInterviews.length}</strong> entrevista(s) concluída(s)</span>
                        <span>•</span>
                        <span><strong>{orgIntervieweesCount}</strong> entrevistado(s)</span>
                        <span>•</span>
                        <span><strong>{orgPainFindings.length}</strong> achado(s) revisado(s)</span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {isMixed && (
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
                            Evidência mista
                          </span>
                        )}
                        {hasFav && (
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                            Favorável
                          </span>
                        )}
                        {hasCon && (
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-200">
                            Contrária / Atenuante
                          </span>
                        )}
                        {hasNeu && (
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                            Neutra
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bloco Intensidade Local (Pain Score) */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Intensidade Local Observada
                        </span>
                        {isMeasured ? (
                          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            score! >= 20 ? 'bg-orange-100 text-orange-900 border border-orange-200' : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}>
                            Pain Score: {score}/25
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            Intensidade não mensurada
                          </span>
                        )}
                      </div>

                      {isMeasured && orgOccurrence?.painScore ? (
                        <div className="grid grid-cols-5 gap-1 pt-1 text-center font-mono text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100">
                          <div>Freq: <strong>{orgOccurrence.painScore.frequencia}</strong></div>
                          <div>Tempo: <strong>{orgOccurrence.painScore.tempoCusto}</strong></div>
                          <div>Sev: <strong>{orgOccurrence.painScore.severidade}</strong></div>
                          <div>Man: <strong>{orgOccurrence.painScore.manualidade}</strong></div>
                          <div>Rep: <strong>{orgOccurrence.painScore.repetibilidade}</strong></div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic pt-1">
                          As dimensões de dor não foram quantificadas explicitamente nesta organização.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Evidências Representativas da Organização */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-bold text-slate-700">
                      Evidências Representativas ({representativeFindings.length} de {orgPainFindings.length} achados revisados):
                    </div>

                    {representativeFindings.length === 0 ? (
                      <p className="text-xs text-slate-500 italic bg-white p-3 rounded-lg border border-slate-200">
                        Organização investigada, mas ainda sem evidência revisada vinculada a esta hipótese.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {representativeFindings.map(f => {
                          const interviewee = org.entrevistados?.find(e => e.id === f.entrevistadoId);
                          const isFav = f.natureza === 'favoravel';
                          const isCon = f.natureza === 'contraria';

                          return (
                            <div 
                              key={f.id} 
                              className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                                isCon 
                                  ? 'bg-rose-50/50 border-rose-200' 
                                  : isFav 
                                    ? 'bg-emerald-50/40 border-emerald-200' 
                                    : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="font-bold text-slate-900">{f.titulo}</div>
                                <EvidenceNatureBadge nature={f.natureza} />
                              </div>

                              <div className="italic text-slate-800 bg-white/90 p-2 rounded border border-slate-200/80">
                                "{f.fraseRevisada || f.fraseOriginal}"
                              </div>

                              <p className="text-slate-600 text-[11px]">
                                <strong>Interpretação:</strong> {f.interpretacao}
                              </p>

                              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
                                <span className="text-slate-500">
                                  {interviewee ? (
                                    <>Fonte: <strong>{interviewee.nome}</strong> ({interviewee.cargo})</>
                                  ) : (
                                    <>Fonte: Entrevistado não especificado</>
                                  )}
                                </span>

                                {f.entrevistaId ? (
                                  <Link
                                    to="/entrevistas/$interviewId"
                                    params={{ interviewId: f.entrevistaId }}
                                    className="text-blue-700 hover:underline font-semibold inline-flex items-center gap-1 shrink-0"
                                  >
                                    Ver entrevista <ArrowRight className="w-3 h-3" />
                                  </Link>
                                ) : (
                                  <span className="text-slate-400 italic text-[10px]">
                                    Origem da entrevista indisponível
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bloco Comparativo: O que varia entre os contextos? */}
        {investigatedOrgs.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 pt-3">
            <div className="border-b border-slate-200/80 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <GitCompare className="w-4 h-4 text-blue-600" />
                O que varia entre os contextos?
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Diferenças factuais registradas entre as organizações da amostra investigada. As variações representam contextos operacionais observados, sem inferência de causalidade automática.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Contexto Observado 1 */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900">Uso de App / Portal Próprio</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    Contexto observado
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>ORG-CONT-002</strong> utiliza aplicativo e portal próprio para disponibilização de guias e certidões, apresentando Pain Score local de <strong>9/25</strong>.
                </p>
              </div>

              {/* Contexto Observado 2 */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900">Controles Paralelos & WhatsApp</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                    Contexto observado
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>ORG-CONT-001</strong> e <strong>ORG-CONT-003</strong> registram uso de controles paralelos e cobrança manual via WhatsApp, apresentando Pain Scores locais mais altos (<strong>23/25</strong> e <strong>25/25</strong>).
                </p>
              </div>

              {/* Hipótese para Investigação */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900">Atendimento & Entrega</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                    Hipótese para investigação
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Investigar se a centralização do atendimento e da entrega de documentos via portal ou software contribui para reduzir o atrito operacional em instâncias de maior volume.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Seção 5A.5: Matriz de Evidências & Rastreabilidade */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
        {/* Cabeçalho da Seção com Filtros e Auditoria */}
        <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Quote className="w-5 h-5 text-blue-600" />
              Matriz de Evidências & Rastreabilidade
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Achados revisados vinculados à Dor Consolidada, organizados por natureza com rastreabilidade de fonte e preservação da fala.
            </p>
          </div>

          {/* Filtro simples por Natureza */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs self-start md:self-auto">
            <button
              onClick={() => setNatureFilter('todas')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                natureFilter === 'todas'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({reviewedFindings.length})
            </button>
            <button
              onClick={() => setNatureFilter('favoravel')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                natureFilter === 'favoravel'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              Favoráveis ({favorableFindings.length})
            </button>
            <button
              onClick={() => setNatureFilter('contraria')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                natureFilter === 'contraria'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'text-rose-800 hover:bg-rose-50'
              }`}
            >
              Contrárias ({contraryFindings.length})
            </button>
            <button
              onClick={() => setNatureFilter('neutra')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                natureFilter === 'neutra'
                  ? 'bg-slate-700 text-white shadow-2xs font-bold'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              Neutras ({neutralFindings.length})
            </button>
          </div>
        </div>

        {/* Indicador discreto de auditoria para capturas Pendentes e Descartadas */}
        {(pendingFindings.length > 0 || discardedFindings.length > 0) && (
          <div className="flex items-center justify-between text-[11px] bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Preservação de Auditoria Fora da Matriz Formal:
            </span>
            <div className="flex items-center gap-3">
              {pendingFindings.length > 0 && (
                <span className="font-mono font-semibold text-amber-800">
                  {pendingFindings.length} captura(s) pendente(s)
                </span>
              )}
              {discardedFindings.length > 0 && (
                <span className="font-mono font-semibold text-slate-500">
                  {discardedFindings.length} captura(s) descartada(s)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Renderização dos Grupos da Matriz Formal */}
        {reviewedFindings.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-1">
            <Quote className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">
              Ainda não há evidências revisadas vinculadas a esta Dor.
            </p>
            <p className="text-xs text-slate-500">
              Associe ou revise capturas registradas para popular a matriz formal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Grupo 1: Favoráveis */}
            {(natureFilter === 'todas' || natureFilter === 'favoravel') && (
              <div className={`space-y-3 ${natureFilter === 'favoravel' ? 'md:col-span-3' : ''}`}>
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Favoráveis ({favorableFindings.length})
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                    Sustenta a hipótese
                  </span>
                </div>

                {favorableFindings.length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                    Nenhuma evidência favorável revisada registrada.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {favorableFindings.map(f => renderEvidenceCard(f, 'favoravel'))}
                  </div>
                )}
              </div>
            )}

            {/* Grupo 2: Contrárias / Atenuantes */}
            {(natureFilter === 'todas' || natureFilter === 'contraria') && (
              <div className={`space-y-3 ${natureFilter === 'contraria' ? 'md:col-span-3' : ''}`}>
                <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                  <span className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Contrárias / Atenuantes ({contraryFindings.length})
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-200">
                    Contesta / Atenua
                  </span>
                </div>

                {contraryFindings.length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                    Nenhuma evidência contrária revisada registrada.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {contraryFindings.map(f => renderEvidenceCard(f, 'contraria'))}
                  </div>
                )}
              </div>
            )}

            {/* Grupo 3: Neutras */}
            {(natureFilter === 'todas' || natureFilter === 'neutra') && (
              <div className={`space-y-3 ${natureFilter === 'neutra' ? 'md:col-span-3' : ''}`}>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-slate-500" />
                    Neutras ({neutralFindings.length})
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    Informativa
                  </span>
                </div>

                {neutralFindings.length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                    Nenhuma evidência neutra revisada registrada.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {neutralFindings.map(f => renderEvidenceCard(f, 'neutra'))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Seção 5A.6: Contexto Operacional & Gap de Software */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-6">
        {/* Cabeçalho da Seção */}
        <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-blue-600" />
              Contexto Operacional & Gap de Software
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Análise observacional dos processos afetados, do stack tecnológico das organizações investigadas e do trabalho executado fora do software principal.
            </p>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 self-start md:self-auto">
            Visão Observacional Sem Causalidade
          </span>
        </div>

        {/* 1. Processos Relacionados & Vínculos de Evidência */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Layers className="w-4 h-4 text-slate-600" />
            1. Processos Relacionados & Vínculos de Evidência
          </h3>

          {/* Vínculos Explícitos */}
          {explicitlyLinkedProcesses.length > 0 ? (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-600 font-medium">
                Processos com <strong>vínculo explícito (ID)</strong> aos achados desta Dor:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {explicitlyLinkedProcesses.map(({ process, org, finding }) => (
                  <div key={`${process.id}-${finding.id}`} className="p-3.5 rounded-lg border border-blue-200 bg-blue-50/40 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] text-blue-800 font-bold bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200">
                          {process.id}
                        </span>
                        <h4 className="font-bold text-slate-900 mt-1">{process.nome}</h4>
                      </div>
                      <Link
                        to="/organizacoes/$orgId"
                        params={{ orgId: org.id }}
                        className="text-[11px] font-bold text-blue-700 hover:underline inline-flex items-center gap-1 shrink-0 bg-white px-2 py-0.5 rounded border border-blue-200"
                      >
                        {org.nome.split(' ')[0]} {org.nome.split(' ')[1]} <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {process.descricao}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-600 bg-white p-2 rounded border border-blue-100">
                      <div>Área: <strong>{process.area}</strong></div>
                      <div>Freq: <strong>{process.frequencia}</strong></div>
                      <div>Volume: <strong>{process.volumeEstimado}</strong></div>
                      <div>Horas/mês: <strong>{process.tempoEstimadoHorasMes}h</strong></div>
                    </div>

                    <div className="pt-1.5 border-t border-blue-200/60 text-[11px] space-y-1">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        Achado Vinculado Explicitamente ({finding.id}):
                      </div>
                      <div className="italic text-slate-700 bg-white p-2 rounded border border-blue-100">
                        "{finding.fraseOriginal}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
              Nenhum processo foi explicitamente vinculado às evidências desta Dor.
            </div>
          )}

          {/* Processos Mapeados sem Vínculo Explícito */}
          {unlinkedMappedProcesses.length > 0 && (
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs mt-2">
              <div className="font-semibold text-slate-800 text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                Processos mapeados na organização — vínculo com esta Dor ainda não confirmado:
              </div>
              <p className="text-slate-500 text-[11px]">
                Estes processos foram mapeados no Dossiê da Organização, mas os achados registrados para esta Dor não contêm referência de ID direta a eles:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {unlinkedMappedProcesses.map(({ process, org }) => (
                  <div key={process.id} className="bg-white px-2.5 py-1.5 rounded border border-slate-200 text-[11px] space-x-1">
                    <span className="font-bold text-slate-800">{process.nome}</span>
                    <span className="text-slate-500">({org.nome.split(' ')[0]} {org.nome.split(' ')[1]})</span>
                    <span className="text-[10px] text-slate-400 font-mono">• {process.area}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Stack Tecnológico Observado por Organização */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Cpu className="w-4 h-4 text-slate-600" />
            2. Stack Tecnológico Observado por Organização
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {sampleOrganizations.map(org => {
              const stack = org.stackTecnologico || [];
              return (
                <div key={org.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-bold text-slate-900">{org.nome}</h4>
                      <div className="text-[10px] text-slate-500">{org.numClientes} clientes • {org.numFuncionarios} colab.</div>
                    </div>
                    <Link
                      to="/organizacoes/$orgId"
                      params={{ orgId: org.id }}
                      className="text-[10px] font-bold text-blue-700 hover:underline shrink-0"
                    >
                      Ver Dossiê <ArrowRight className="w-3 h-3 inline" />
                    </Link>
                  </div>

                  {stack.length === 0 ? (
                    <p className="text-slate-500 italic text-[11px] py-2">
                      Stack tecnológico ainda não mapeado nesta organização.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {stack.map(stk => (
                        <div key={stk.id} className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-slate-900 text-[11px]">{stk.nome}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                              {stk.categoria}
                            </span>
                          </div>

                          <div className="text-[10px] text-slate-500">
                            Uso: <strong>{stk.quemUtiliza}</strong> ({stk.frequencia}) • Satisfação: <strong>{stk.satisfacaoPercebida}/5</strong>
                          </div>

                          {stk.limitacoes && (
                            <p className="text-[11px] text-slate-600">
                              <strong className="text-slate-700">Limitação:</strong> {stk.limitacoes}
                            </p>
                          )}

                          {stk.oQueAconteceFora && (
                            <div className="p-2 rounded bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-950 space-y-0.5">
                              <span className="font-bold text-[10px] text-amber-900 uppercase tracking-wider block">
                                O que acontece fora do software:
                              </span>
                              <span>{stk.oQueAconteceFora}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Operations Gap & Trabalho Fora do Software */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <FileSpreadsheet className="w-4 h-4 text-slate-600" />
            3. Operations Gap Observado (Trabalho Realizado Fora do Software)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {sampleOrganizations.map(org => {
              const gapScore = org.operationsGapScore;
              return (
                <div key={org.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                    <div>
                      <div className="font-bold text-slate-900">{org.nome}</div>
                      <div className="text-[10px] text-slate-500">Amostra Investigada</div>
                    </div>
                    {gapScore ? (
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                        Gap Score: {gapScore.total}/40
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-slate-400">Score N/A</span>
                    )}
                  </div>

                  {gapScore ? (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Trabalho fora do software:</span>
                        <strong className="font-mono text-slate-900">{gapScore.trabalhoForaSoftware}/5</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Troca de documentos:</span>
                        <strong className="font-mono text-slate-900">{gapScore.trocaDocumentos}/5</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Gestão de pendências:</span>
                        <strong className="font-mono text-slate-900">{gapScore.pendencias}/5</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Interação com cliente:</span>
                        <strong className="font-mono text-slate-900">{gapScore.interacaoCliente}/5</strong>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 italic text-[11px]">
                      Nenhum gap operacional estruturado foi registrado.
                    </p>
                  )}

                  <div className="pt-2 border-t border-amber-200/60 text-[10px] text-amber-900/80 italic leading-snug">
                    O Operations Gap Score mensura a intensidade de fricção operacional fora do ERP em 8 dimensões (1 a 5 cada).
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Comparação de Contexto Fato vs. Contexto vs. Hipótese */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 pt-3">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <GitCompare className="w-4 h-4 text-blue-600" />
              4. Comparação de Contexto Observado & Distinção de Hipóteses
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Comparação lado a lado dos dados reais registrados nas organizações da amostra, separando fatos observados de hipóteses investigativas sem inferência causal.
            </p>
          </div>

          {/* Matriz Comparativa */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 bg-white">
                  <th className="p-2.5">Organização & Porte</th>
                  <th className="p-2.5">Pain Score</th>
                  <th className="p-2.5">Gap Score</th>
                  <th className="p-2.5">Stack & Canal do Cliente</th>
                  <th className="p-2.5">Operações Fora do Software</th>
                  <th className="p-2.5">Evidências Vinculadas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 bg-white">
                {sampleOrganizations.map(org => {
                  const occ = relevantOccurrences.find(o => o.organizacaoId === org.id);
                  const measured = occ && isPainScoreMeasured(occ);
                  const score = measured ? occ.painScore!.total : 'N/M';
                  const gapScore = org.operationsGapScore?.total;
                  const orgFindings = reviewedFindings.filter(f => f.organizacaoId === org.id);
                  const favs = orgFindings.filter(f => f.natureza === 'favoravel').length;
                  const cons = orgFindings.filter(f => f.natureza === 'contraria').length;

                  return (
                    <tr key={org.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-2.5 font-bold text-slate-900">
                        {org.nome}
                        <div className="text-[10px] text-slate-500 font-normal">{org.numClientes} clientes • {org.numFuncionarios} colab.</div>
                      </td>
                      <td className="p-2.5 font-mono font-bold text-slate-800">
                        {measured ? `${score}/25` : 'Não mensurado'}
                      </td>
                      <td className="p-2.5 font-mono font-bold text-amber-800">
                        {gapScore ? `${gapScore}/40` : 'N/A'}
                      </td>
                      <td className="p-2.5 text-[11px] text-slate-700">
                        {org.stackTecnologico?.map(s => s.nome).join(', ') || 'N/A'}
                      </td>
                      <td className="p-2.5 text-[11px] text-slate-600 max-w-xs">
                        {org.stackTecnologico?.map(s => s.oQueAconteceFora).filter(Boolean).join(' ') || 'Controles paralelos'}
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-1 text-[10px] font-mono">
                          {favs > 0 && <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">{favs} Fav</span>}
                          {cons > 0 && <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-900 font-bold">{cons} Con</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards de Separação: Fato vs Contexto vs Hipótese */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 rounded-lg border border-blue-200 bg-white space-y-1.5">
              <span className="font-bold text-blue-900 text-[11px] uppercase tracking-wider block">
                Fato Observado
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Na <strong>ORG-CONT-002</strong>, a presença de aplicativo/portal do cliente coexiste com Pain Score local de <strong>9/25</strong> e evidência contrária à tese (ACH-005).
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5">
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                Contexto da Organização
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                A <strong>ORG-CONT-002</strong> opera em menor escala (65 clientes) com portal adotado no onboarding, enquanto Alfa (320) e Gamma (480) operam em maior escala com e-mail/WhatsApp/planilhas.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-purple-200 bg-purple-50/50 space-y-1.5">
              <span className="font-bold text-purple-900 text-[11px] uppercase tracking-wider block">
                Hipótese para Investigação
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Investigar se a centralização do atendimento e da entrega de documentos reduz a fricção em carteiras menores, e em qual limiar de porte a cobrança ativa passa a exigir automação dedicada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção 5A.7: Lacunas de Evidência & Próxima Investigação */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-6">
        {/* Cabeçalho da Seção */}
        <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              Lacunas de Evidência & Próxima Investigação
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Orientação determinística de pesquisa baseada nas lacunas verificáveis dos dados atuais para evoluir a confiança na hipótese.
            </p>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 self-start md:self-auto">
            Sem Scores Artificiais / Regras Factualmente Derivadas
          </span>
        </div>

        {/* 1. Resumo Factual da Hipótese ("O que sabemos hoje") */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              1. Estado Atual da Hipótese (Resumo Factual)
            </h3>
            <EvidenceLevelBadge level={evidenceLevel} size="sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Nível de Evidência</div>
              <div className="font-bold text-slate-900 text-sm font-mono flex items-center gap-1.5">
                {evidenceLevel} — {evidenceLevelConfigs[evidenceLevel].name}
              </div>
              <div className="text-[10px] text-slate-500">{levelJustification}</div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Amostra & Incidência</div>
              <div className="font-bold text-slate-900 text-sm font-mono">
                {stats.totalAmostraInvestigada} de {verticalOrgs.length} orgs
              </div>
              <div className="text-[10px] text-slate-500">
                {stats.orgsFavoraveisCount} favorável(is) • {stats.orgsContrariasCount} contrária(s)
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Evidência Econômica (H4)</div>
              <div className="font-bold text-emerald-700 text-sm font-mono flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> Confirmada
              </div>
              <div className="text-[10px] text-slate-500">
                Alocação comprovada de horas/equipe (até 160h/mês)
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Compromisso Comercial (H5)</div>
              <div className="font-bold text-amber-700 text-sm font-mono flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-amber-600 inline" /> Pendente
              </div>
              <div className="text-[10px] text-slate-500">
                Nenhum piloto pago ou pré-contrato registrado
              </div>
            </div>
          </div>
        </div>

        {/* 2. Lacunas Determinísticas & Próxima Evidência Necessária */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Target className="w-4 h-4 text-slate-600" />
            2. Lacunas Determinísticas & Próxima Evidência Necessária
          </h3>

          <div className="space-y-3 text-xs">
            {/* Lacuna 1: Contraponto a aprofundar */}
            {primaryContraryFinding && primaryContraryOrg && (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2">
                <div className="flex items-center justify-between gap-2 border-b border-rose-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white">
                      Investigar Agora
                    </span>
                    <span className="font-bold text-slate-900">
                      Lacuna 1: Contraponto/Atenuante na {primaryContraryOrg.nome.split(' ')[0]} {primaryContraryOrg.nome.split(' ')[1]}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-800 font-bold">
                    Achado {primaryContraryFinding.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Lacuna Factual</span>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      Existe evidência contrária ({primaryContraryFinding.titulo}) em escritório menor (65 clientes) com Pain Score de 9/25. É preciso entender se o atrito é atenuado pelo portal ou pela escala reduzida.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Próxima Evidência Útil</span>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      Entrevistar usuários finais e clientes da {primaryContraryOrg.nome.split(' ')[0]} {primaryContraryOrg.nome.split(' ')[1]} para medir taxa real de adesão ao aplicativo e mapear o volume de exceções tratadas fora do app.
                    </p>
                  </div>

                  <div className="space-y-1 bg-white p-2.5 rounded-lg border border-rose-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Onde Investigar</span>
                    <div className="font-semibold text-slate-900">{primaryContraryOrg.nome}</div>
                    <div className="text-[10px] text-slate-500">65 clientes • Portal do Cliente ativo</div>
                    <Link
                      to="/organizacoes/$orgId"
                      params={{ orgId: primaryContraryOrg.id }}
                      className="text-blue-700 font-bold hover:underline text-[10px] inline-flex items-center gap-1 mt-1"
                    >
                      Acessar Dossiê <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Lacuna 2: Vínculo com Processos */}
            {unlinkedMappedProcesses.length > 0 && (
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
                <div className="flex items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-600 text-white">
                      Investigar Agora
                    </span>
                    <span className="font-bold text-slate-900">
                      Lacuna 2: Cobertura Limitada de Vínculos Explícitos com Processos
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-800 font-bold">
                    {unlinkedMappedProcesses.length} processo(s) sem vínculo de ID
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Lacuna Factual</span>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      Apenas 1 processo possui vínculo direto de ID com achados da Dor ({explicitlyLinkedProcesses[0]?.process.nome || 'PROC-01'}). Outros {unlinkedMappedProcesses.length} processos estão mapeados na organização sem vínculo explícito aos achados.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Próxima Evidência Útil</span>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      Mapear os passos de execução em cada organização para atribuir explicitamente os IDs dos achados de atraso documental às rotinas fiscais e de DP.
                    </p>
                  </div>

                  <div className="space-y-1 bg-white p-2.5 rounded-lg border border-amber-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Onde Investigar</span>
                    <div className="text-[11px] text-slate-800 space-y-1">
                      {unlinkedMappedProcesses.map(u => (
                        <div key={u.process.id} className="font-medium">
                          • {u.process.nome} ({u.org.nome.split(' ')[0]} {u.org.nome.split(' ')[1]})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lacuna 3: Diversidade de Papéis */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-white">
                    Investigar Depois
                  </span>
                  <span className="font-bold text-slate-900">
                    Lacuna 3: Cobertura de Papéis de Campo
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-600 font-bold">
                  {roleCounts.operacional} analista(s) operacional(is) ouvido(s)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Lacuna Factual</span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    A amostra de 5 entrevistas contém 4 visões de nível estratégico/gerencial (Sócios e Coordenadores) e apenas 1 entrevista direta com analista operacional de ponta.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Próxima Evidência Útil</span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    Realizar entrevista em profundidade com analistas júnior/pleno responsáveis pela cobrança diária no WhatsApp para observar a fricção em tempo real.
                  </p>
                </div>

                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Onde Investigar</span>
                  <div className="font-semibold text-slate-900">Escritório Contábil Alfa (ORG-CONT-001)</div>
                  <div className="text-[10px] text-slate-500">Equipe com 11 analistas cadastrados no ERP Atlas</div>
                </div>
              </div>
            </div>

            {/* Lacuna 4: Progressão para H5 (Validação Comercial) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-white">
                    Investigar Depois
                  </span>
                  <span className="font-bold text-slate-900">
                    Lacuna 4: Validação Comercial de Compromisso (H5)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-600 font-bold">
                  Nível Atual: H4
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Lacuna Factual</span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    Embora H4 esteja comprovado por alocação de horas e headcount em 2 escritórios, ainda não há registro de piloto pago ou LOI (Letter of Intent).
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Próxima Evidência Útil</span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    Testar oferta de piloto remunerado ou protótipo funcional de cobrança ativa com os sócios dos escritórios favoráveis.
                  </p>
                </div>

                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Onde Investigar</span>
                  <div className="font-semibold text-slate-900">ORG-CONT-001 e ORG-CONT-003</div>
                  <div className="text-[10px] text-slate-500">Organizações com evidência favorável confirmada</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bloco de Contraprova (Ativo Metodológico) */}
        {primaryContraryFinding && primaryContraryOrg && (
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-3">
            <div className="border-b border-rose-200/80 pb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                3. Contraprova a Explorar (Ativo Metodológico)
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-200">
                Evidência Contrária Observada
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 bg-white p-3.5 rounded-lg border border-rose-200">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900">{primaryContraryOrg.nome}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {primaryContraryOrg.numClientes} clientes • {primaryContraryOrg.numFuncionarios} colab.
                  </span>
                </div>

                <div className="text-[11px] font-bold text-rose-900 pt-1">
                  Achado {primaryContraryFinding.id}: {primaryContraryFinding.titulo}
                </div>

                <div className="italic text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] leading-relaxed">
                  "{primaryContraryFinding.fraseRevisada || primaryContraryFinding.fraseOriginal}"
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                  <span className="text-slate-500">
                    Fonte: <strong>{primaryContraryInterviewee?.nome || 'Roberto Silva'}</strong> ({primaryContraryInterviewee?.cargo || 'Sócio Proprietário'})
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/organizacoes/$orgId"
                      params={{ orgId: primaryContraryOrg.id }}
                      className="text-blue-700 hover:underline font-bold"
                    >
                      Dossiê <ArrowRight className="w-3 h-3 inline" />
                    </Link>
                    {primaryContraryFinding.entrevistaId && (
                      <Link
                        to="/entrevistas/$interviewId"
                        params={{ interviewId: primaryContraryFinding.entrevistaId }}
                        className="text-blue-700 hover:underline font-bold"
                      >
                        Entrevista <ArrowRight className="w-3 h-3 inline" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 bg-white p-3.5 rounded-lg border border-rose-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 block mb-1">
                    Pergunta Investigativa Guiada
                  </span>
                  <p className="text-slate-700 font-medium text-xs leading-relaxed">
                    Quais diferenças de processo, stack tecnológico, porte ou forma de atendimento ajudam a explicar este contraponto na {primaryContraryOrg.nome.split(' ')[0]} {primaryContraryOrg.nome.split(' ')[1]}?
                  </p>
                  <p className="text-slate-500 text-[11px] mt-2 leading-relaxed">
                    Esta evidência contrária previne generalização indevida da hipótese e orienta a investigação sobre os fatores que neutralizam a dor em carteiras menores.
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded border border-purple-200 text-[10px] text-purple-900 font-semibold italic">
                  Orientação: Não responder automaticamente a esta pergunta. Registrar como tópico obrigatório da próxima rodada de entrevistas.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Cobertura de Papéis & Cobertura Organizacional */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 pt-3">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-600" />
              4. Mapeamento Factual de Cobertura da Amostra
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Auditoria dos papéis ouvidos e das organizações investigadas na vertical sem inferência ou criação de personas ausentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Cobertura Organizacional */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900">Cobertura Organizacional</span>
                <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {stats.totalAmostraInvestigada} de {verticalOrgs.length} investigadas
                </span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                {verticalOrgs.map(org => {
                  const isInvestigated = concludedOrgIdsSet.has(org.id);
                  const orgFindings = reviewedFindings.filter(f => f.organizacaoId === org.id);
                  const isFav = orgFindings.some(f => f.natureza === 'favoravel');
                  const isCon = orgFindings.some(f => f.natureza === 'contraria');

                  return (
                    <div key={org.id} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900">{org.nome}</span>
                        <div className="text-[10px] text-slate-500">{org.numClientes} clientes • {org.numFuncionarios} colab.</div>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        {isInvestigated ? (
                          isCon ? (
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-bold border border-rose-200">
                              Contrária
                            </span>
                          ) : isFav ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                              Favorável
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold border border-slate-200">
                              Investigada
                            </span>
                          )
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 italic">
                            Não investigada
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cobertura de Papéis */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900">Papéis Entrevistados na Amostra</span>
                <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {interviewedRolesInfo.length} fontes ativas
                </span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-800">Sócio / Proprietário</span>
                  <span className="font-mono font-bold text-slate-900">{roleCounts.socio} entrevistado(s)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-800">Gestor / Coordenador</span>
                  <span className="font-mono font-bold text-slate-900">{roleCounts.gestor} entrevistado(s)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-800">Operacional / Analista</span>
                  <span className="font-mono font-bold text-slate-900">{roleCounts.operacional} entrevistado(s)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 italic">
                Nota: Para aumentar a densidade dos achados operacionais, recomenda-se expandir as entrevistas na camada de analistas operacionais de ponta.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Ocorrências e Distribuição por Organização (PRD Seção 28 e 29) */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Ocorrências Individuais por Organização</span>
              <span className="text-xs font-normal text-slate-500">Dados segregados (PRD Seção 28)</span>
            </h2>

            <div className="space-y-3">
              {relevantOccurrences.map(occ => {
                const org = organizacoes.find(o => o.id === occ.organizacaoId);
                const measured = isPainScoreMeasured(occ);
                const score = measured ? occ.painScore!.total : null;
                const occFindings = achados.filter(f => occ.achadosIds.includes(f.id));
                const reviewedOccFindings = occFindings.filter(f => f.reviewStatus !== 'pendente' && Boolean(f.natureza));
                const favCount = reviewedOccFindings.filter(f => f.natureza === 'favoravel').length;
                const conCount = reviewedOccFindings.filter(f => f.natureza === 'contraria').length;
                const neuCount = reviewedOccFindings.filter(f => f.natureza === 'neutra').length;
                const pendingCount = occFindings.filter(f => f.reviewStatus === 'pendente' || !f.natureza).length;

                return (
                  <div key={occ.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{org?.nome}</div>
                        <div className="text-[11px] text-slate-500">{org?.numClientes} clientes • {org?.numFuncionarios} funcionários</div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        {measured ? (
                          <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                            score! >= 20 ? 'bg-orange-100 text-orange-900 border border-orange-200' : 'bg-slate-200 text-slate-800'
                          }`}>
                            {score}/25
                          </span>
                        ) : (
                          <span className="font-mono font-semibold px-2 py-0.5 rounded text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
                            Não mensurado
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {occ.notasEspecificas}
                    </p>

                    {/* Composição das evidências desta ocorrência */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                      <span className="text-slate-500 font-medium">Evidências:</span>
                      <EvidenceCompositionBadge favCount={favCount} conCount={conCount} neuCount={neuCount} pendingCount={pendingCount} />
                    </div>

                    {measured ? (
                      <div className="grid grid-cols-5 gap-1 pt-1 text-center font-mono text-[10px] text-slate-500 border-t border-slate-200/60">
                        <div>Freq: <strong>{occ.painScore!.frequencia}</strong></div>
                        <div>Tempo: <strong>{occ.painScore!.tempoCusto}</strong></div>
                        <div>Sev: <strong>{occ.painScore!.severidade}</strong></div>
                        <div>Man: <strong>{occ.painScore!.manualidade}</strong></div>
                        <div>Rep: <strong>{occ.painScore!.repetibilidade}</strong></div>
                      </div>
                    ) : (
                      <div className="pt-1 text-center font-mono text-[11px] text-slate-400 italic border-t border-slate-200/60">
                        Dimensões de dor ainda não mensuradas nesta organização.
                      </div>
                    )}

                    <div className="pt-2 text-right">
                      <Link
                        to="/organizacoes/$orgId"
                        params={{ orgId: occ.organizacaoId }}
                        className="text-blue-700 font-semibold text-[11px] hover:underline inline-flex items-center gap-1"
                      >
                        Ver ambiente da organização <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Oportunidades de Software Derivadas Desta Dor */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Oportunidades de Software Derivadas Desta Dor</h3>
            {relatedOpportunities.length === 0 ? (
              <p className="text-slate-500 italic py-2">Nenhuma oportunidade vinculada a esta dor no momento.</p>
            ) : (
              relatedOpportunities.map(opp => (
                <div key={opp.id} className="p-3.5 rounded-lg border border-blue-200 bg-blue-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{opp.nome}</span>
                    <span className="font-mono font-bold text-blue-800">Score {opp.opportunityScore.total}/100</span>
                  </div>
                  <p className="text-slate-600 text-xs">{opp.problema}</p>
                  <Link
                    to="/oportunidades/$opportunityId"
                    params={{ opportunityId: opp.id }}
                    className="text-blue-700 font-semibold hover:underline inline-flex items-center gap-1 pt-1"
                  >
                    Ver Opportunity Card & Evidence Chain <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
