import React, { useState } from 'react';
import { Link, useMatches } from '@tanstack/react-router';
import { useRadar } from '../../context/RadarContext';
import { EvidenceLevelBadge, EvidenceNatureBadge } from '../common/Badge';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { ROUTES } from '../../navigation/routeMap';
import { calculatePainConsolidation, isPainScoreMeasured, evaluateEvidenceLevel } from '../../utils/calculations';
import { 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  GitFork, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Quote, 
  Building2, 
  User, 
  Cpu, 
  HelpCircle,
  FlaskConical,
  TrendingUp,
  XCircle,
  ExternalLink,
  AlertTriangle,
  DollarSign,
  Boxes,
  Swords,
  ShieldCheck,
  Target,
  AlertCircle
} from 'lucide-react';
import { Opportunity, Finding } from '../../types/radar';

export const OpportunityDetailView: React.FC = () => {
  const { 
    oportunidades, 
    doresConsolidadas, 
    ocorrenciasDores, 
    achados, 
    entrevistas, 
    organizacoes,
    verticais
  } = useRadar();

  // Resolução da fonte da verdade: parâmetro da rota dinâmica do TanStack Router
  const matches = useMatches();
  const oppMatch = matches.find(m => m.routeId === '/oportunidades/$opportunityId');
  const routeOppId = (oppMatch?.params as Record<string, string> | undefined)?.opportunityId;

  // Busca a oportunidade correspondente ao ID da URL
  const opp = routeOppId ? oportunidades.find(o => o.id === routeOppId) : null;

  // Tratamento explícito de Oportunidade Não Encontrada
  if (!opp) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-xs">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-full">
            Oportunidade não encontrada
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Nenhuma oportunidade registrada para "{routeOppId || 'ID não informado'}"
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            O identificador fornecido na URL não corresponde a nenhuma oportunidade registrada.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to={ROUTES.OPORTUNIDADES}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a Lista de Oportunidades
          </Link>
        </div>
      </div>
    );
  }

  // Selected node in the Evidence Chain for deep inspection
  const [selectedChainFindingId, setSelectedChainFindingId] = useState<string | null>(null);

  // Derive evidence chain items for this opportunity
  const relatedPains = doresConsolidadas.filter(d => opp.doresRelacionadasIds.includes(d.id));
  const relatedOccurrences = ocorrenciasDores.filter(occ => opp.doresRelacionadasIds.includes(occ.dorConsolidadaId));
  const relatedFindings = achados.filter(f => opp.doresRelacionadasIds.includes(f.dorConsolidadaId || '') && f.reviewStatus !== 'descartado' && f.reviewStatus !== 'pendente');

  const inspectFinding = achados.find(f => f.id === selectedChainFindingId) || relatedFindings[0];
  const inspectInterview = entrevistas.find(e => e.id === inspectFinding?.entrevistaId);
  const inspectOrg = organizacoes.find(o => o.id === inspectFinding?.organizacaoId);
  const inspectPerson = inspectOrg?.entrevistados.find(p => p.id === inspectFinding?.entrevistadoId);

  // Resolve vertical e subvertical canônicas
  const currentVertical = verticais.find(v => v.id === opp.verticalId);
  const currentSubvertical = currentVertical?.subverticais?.find(s => s.id === opp.subverticalId);
  const subverticalName = currentSubvertical ? currentSubvertical.nome : (opp.subverticalId || 'Não especificada');

  // Helper para resolução do entrevistado e cargo (Etapa 5B.3)
  const getIntervieweeInfo = (f: Finding) => {
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

  // Achados com evidência contrária para as dores vinculadas à oportunidade (Etapa 5B.3)
  const contraryFindingsForOpp = achados.filter(f => 
    f.dorConsolidadaId && 
    opp.doresRelacionadasIds.includes(f.dorConsolidadaId) &&
    (f.reviewStatus === 'revisado' || f.reviewStatus === undefined) &&
    f.natureza === 'contraria'
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <section aria-labelledby="opportunity-hero-title" className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.OPORTUNIDADES}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors inline-flex items-center justify-center"
              title="Voltar para lista de oportunidades"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700">{opp.id}</span>
                <EvidenceLevelBadge level={opp.evidenceLevel} />
                <SimulacaoTag compact />
              </div>
              <h1 id="opportunity-hero-title" className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                {opp.nome}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Vertical: <strong className="text-slate-700">{currentVertical?.nome || opp.verticalId}</strong> • Subvertical: <strong className="text-slate-700">{subverticalName}</strong> • Status: <strong className="text-slate-800">{opp.status}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block font-medium">Opportunity Score</span>
              <span className="font-mono font-bold text-xl text-blue-700 block leading-tight">{opp.opportunityScore.total}/100</span>
              <span className="text-[9px] font-mono text-slate-600 bg-slate-200/70 px-1.5 py-0.2 rounded font-medium inline-block mt-0.5">
                Avaliação atribuída
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block font-medium">Nível de Confiança</span>
              <span className="font-mono font-bold text-xl text-emerald-700 block leading-tight">{opp.confidenceScore}%</span>
              <span className="text-[9px] font-mono text-slate-600 bg-slate-200/70 px-1.5 py-0.2 rounded font-medium inline-block mt-0.5">
                Confiança atribuída
              </span>
            </div>
          </div>
        </div>

        {/* Next Evidence Callout (PRD Seção 43) */}
        <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2 text-blue-950">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Próxima Melhor Evidência Necessária (H4 → H5):</strong>
              <p className="text-blue-900 mt-0.5">{opp.proximaMelhorEvidencia}</p>
            </div>
          </div>
          <span className="font-mono text-[11px] bg-white px-2 py-1 rounded text-blue-800 border border-blue-200 font-semibold shrink-0">
            Regra do PRD Seção 43
          </span>
        </div>
      </section>

      {/* Strategic Thesis (PRD Seção 40) */}
      <section aria-labelledby="opportunity-thesis-title" className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h3 id="opportunity-thesis-title" className="text-sm font-bold text-slate-900">Definição Estratégica do Opportunity Card</h3>

        <div className="space-y-3">
          <div>
            <span className="font-semibold text-slate-500 block">ICP Hipotético (Ideal Customer Profile):</span>
            <p className="text-slate-900 font-medium mt-0.5">{opp.icpHipotetico}</p>
          </div>

          <div>
            <span className="font-semibold text-slate-500 block">Problema Resolvido:</span>
            <p className="text-slate-700 mt-0.5 leading-relaxed">{opp.problema}</p>
          </div>

          <div>
            <span className="font-semibold text-slate-500 block">Job-to-be-done (JTBD):</span>
            <p className="text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
              "{opp.jobToBeDone}"
            </p>
          </div>

          <div>
            <span className="font-semibold text-slate-500 block">Processo Atual (Onde Ocorre o Customer Operations Gap):</span>
            <p className="text-slate-700 mt-0.5 leading-relaxed bg-amber-50/50 p-2.5 rounded border border-amber-200">
              {opp.processoAtual}
            </p>
          </div>

          <div>
            <span className="font-semibold text-slate-500 block">Hipótese de Solução:</span>
            <p className="text-slate-700 mt-0.5 leading-relaxed">{opp.solucaoHipotetica}</p>
          </div>

          {/* Integrações Necessárias */}
          <div>
            <span className="font-semibold text-slate-700 block flex items-center gap-1.5 mb-1">
              <Boxes className="w-3.5 h-3.5 text-blue-600" />
              Integrações Necessárias:
            </span>
            <p className="text-[10px] text-slate-500 mb-1.5">
              Integrações atualmente consideradas necessárias para testar a hipótese de solução.
            </p>
            {opp.integracoesNecessarias && opp.integracoesNecessarias.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {opp.integracoesNecessarias.map((integ, idx) => (
                  <span key={idx} className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                    {integ}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                Nenhuma integração necessária registrada.
              </p>
            )}
          </div>

          {/* Monetização Hipotética */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-700 block flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                Monetização Hipotética:
              </span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                Estimativa a Validar
              </span>
            </div>
            {opp.monetizacaoHipotetica ? (
              <div className="bg-emerald-50/40 p-2.5 rounded border border-emerald-200/80 space-y-1">
                <p className="text-emerald-950 font-bold font-mono text-xs">{opp.monetizacaoHipotetica}</p>
                <p className="text-[10px] text-slate-500 italic">
                  Estimativa ainda sujeita a validação comercial.
                </p>
              </div>
            ) : (
              <p className="text-slate-400 italic text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                Hipótese de monetização ainda não registrada.
              </p>
            )}
          </div>

          {/* Alternativas, Concorrentes & Diferenciação */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
            <div>
              <span className="font-semibold text-slate-800 block flex items-center gap-1.5 mb-1">
                <Swords className="w-3.5 h-3.5 text-slate-700" />
                Alternativas & Concorrentes Mapeados:
              </span>
              <p className="text-[10px] text-slate-500 mb-1.5">
                Alternativas atuais, concorrentes percebidos e soluções substitutas consideradas no contexto do cliente.
              </p>
              {opp.concorrentesMapeados && opp.concorrentesMapeados.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {opp.concorrentesMapeados.map((conc, idx) => (
                    <span key={idx} className="text-[11px] px-2.5 py-1 rounded bg-white text-slate-800 border border-slate-200 font-medium shadow-2xs">
                      {conc}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic text-[11px] bg-white p-2 rounded border border-slate-100">
                  Nenhuma alternativa ou concorrente mapeado até o momento.
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-800 block flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Hipótese de Diferenciação:
              </span>
              {opp.diferenciacao ? (
                <p className="text-slate-700 leading-relaxed text-[11px] bg-white p-2.5 rounded border border-slate-200">
                  {opp.diferenciacao}
                </p>
              ) : (
                <p className="text-slate-400 italic text-[11px] bg-white p-2 rounded border border-slate-100">
                  Hipótese de diferenciação ainda não registrada.
                </p>
              )}
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-500 block">Riscos Principais Identificados:</span>
            <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5">
              {opp.riscos.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Sustentação Empírica & Contraprovas */}
      <section aria-label="Sustentação Empírica & Contraprovas" className="space-y-6">
      {/* SEÇÃO METODOLÓGICA 1: Dores que Sustentam esta Oportunidade (Etapa 5B.3) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Dores que Sustentam esta Oportunidade ({relatedPains.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sustentação empírica de campo fornecida pelas dores consolidadas vinculadas.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">PRD Seções 28–35</span>
        </div>

        {relatedPains.length === 0 ? (
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
            Nenhuma Dor Consolidada vinculada a esta hipótese de oportunidade.
          </div>
        ) : (
          <div className="space-y-4">
            {relatedPains.map(pain => {
              const painVertical = pain.verticalId ? verticais.find(v => v.id === pain.verticalId) : null;
              const painVerticalNome = painVertical ? painVertical.nome : (currentVertical?.nome || pain.verticalId || 'Vertical não identificada');
              const painVerticalOrgs = pain.verticalId ? organizacoes.filter(o => o.verticalId === pain.verticalId) : (currentVertical ? organizacoes.filter(o => o.verticalId === currentVertical.id) : organizacoes);
              
              const painStats = calculatePainConsolidation(pain.id, ocorrenciasDores, painVerticalOrgs.length, achados, entrevistas, painVerticalOrgs);
              
              const painFindings = achados.filter(f => f.dorConsolidadaId === pain.id);
              const painReviewedFindings = painFindings.filter(f => (f.reviewStatus === 'revisado' || f.reviewStatus === undefined) && Boolean(f.natureza));
              const painUniqueOrgsWithReviewed = Array.from(new Set(painReviewedFindings.map(f => f.organizacaoId).filter(Boolean)));
              const painIndependentOrgsCount = painUniqueOrgsWithReviewed.length;
              const painHasExternalSource = painReviewedFindings.some(f => f.origem === 'Fonte externa' || f.tipoEvidencia === 'evidencia_observada');
              const painHasEconomicSpendingEvidence = painReviewedFindings.some(f => f.tipoEvidencia === 'fato' || (f.tags && f.tags.some(t => t.includes('custo') || t.includes('horas') || t.includes('padrao_h3'))));
              const painHasCommercialCommitment = painReviewedFindings.some(f => f.tipoEvidencia === 'evidencia_comercial');

              const painEvidenceLevel = evaluateEvidenceLevel(
                painIndependentOrgsCount,
                painHasExternalSource,
                painHasEconomicSpendingEvidence,
                painHasCommercialCommitment
              );

              return (
                <div key={pain.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                  {/* Identidade da Dor */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {pain.id}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Categoria: <strong className="text-slate-700">{pain.categoria}</strong>
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Vertical: <strong className="text-slate-700">{painVerticalNome}</strong>
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        <Link
                          to="/dores/$painId"
                          params={{ painId: pain.id }}
                          className="hover:text-blue-700 hover:underline inline-flex items-center gap-1.5"
                        >
                          {pain.titulo}
                          <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                        </Link>
                      </h3>
                    </div>

                    {/* Evidence Level da Dor (Distinto do Evidence Level da Oportunidade) */}
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
                      <span className="text-[11px] font-semibold text-slate-600">Evidence Level da Dor:</span>
                      <EvidenceLevelBadge level={painEvidenceLevel} />
                    </div>
                  </div>

                  {/* Grid de Indicadores Empíricos da Dor */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Amostra Investigada</span>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {painStats.totalAmostraInvestigada} organizações investigadas
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">na vertical {painVerticalNome}</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-emerald-700 font-semibold block uppercase">Evidência Favorável</span>
                      <span className="font-mono font-bold text-emerald-900 text-xs">
                        {painStats.orgsFavoraveisCount} de {painStats.totalAmostraInvestigada} organizações
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">da amostra investigada ({painStats.incidenciaFavoravelPercent}%)</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-rose-700 font-semibold block uppercase">Evidência Contrária / Atenuante</span>
                      <span className="font-mono font-bold text-rose-900 text-xs">
                        {painStats.orgsContrariasCount} de {painStats.totalAmostraInvestigada} organizações
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">da amostra investigada ({painStats.incidenciaContrariaPercent}%)</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-blue-700 font-semibold block uppercase">Intensidade Observada</span>
                      {painStats.ocorrenciasMensuradasCount > 0 ? (
                        <div>
                          <span className="font-mono font-bold text-blue-900 text-xs">
                            Mediana dos Pain Scores: {painStats.mediana}/25
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            ({painStats.ocorrenciasMensuradasCount} ocorrência(s) mensurada(s))
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px] block mt-0.5">
                          Intensidade ainda não mensurada.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Avisos & Limitações da Amostra */}
                  {painReviewedFindings.length === 0 && (
                    <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-800 text-[11px]">
                      Esta Dor ainda não possui evidências revisadas suficientes para sustentar a oportunidade.
                    </div>
                  )}

                  {painStats.amostraLimitada && (
                    <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-slate-600 text-[11px] flex items-center gap-2">
                      <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] shrink-0 border border-amber-200">
                        Amostra limitada
                      </span>
                      <span>
                        Percentuais referem-se apenas à amostra investigada ({painStats.orgsFavoraveisCount} de {painStats.totalAmostraInvestigada} organizações).
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SEÇÃO METODOLÓGICA 2: Contraprovas & Limites da Hipótese (Etapa 5B.3) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Contraprovas & Limites da Hipótese ({contraryFindingsForOpp.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Contrapontos empíricos e evidências atenuantes observadas nas organizações pesquisadas.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Contrapontos de Campo</span>
        </div>

        {contraryFindingsForOpp.length === 0 ? (
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
            Nenhuma evidência contrária revisada foi identificada nas Dores vinculadas até o momento.
          </div>
        ) : (
          <div className="space-y-4">
            {contraryFindingsForOpp.map(f => {
              const pain = doresConsolidadas.find(p => p.id === f.dorConsolidadaId);
              const org = organizacoes.find(o => o.id === f.organizacaoId);
              const intervieweeInfo = getIntervieweeInfo(f);
              
              // Resolve a ocorrência e o Pain Score local da organização para aquela dor
              const occ = ocorrenciasDores.find(o => o.organizacaoId === f.organizacaoId && o.dorConsolidadaId === f.dorConsolidadaId);
              const isMeasured = occ ? isPainScoreMeasured(occ) : false;
              const hasRevisedSpeech = Boolean(f.fraseRevisada && f.fraseRevisada.trim() !== '' && f.fraseRevisada !== f.fraseOriginal);

              return (
                <div key={f.id} className="p-4 rounded-xl border border-rose-200 bg-rose-50/20 space-y-3 text-xs">
                  {/* Header do Card de Contraprova */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                        {f.id}
                      </span>
                      <EvidenceNatureBadge nature={f.natureza} reviewStatus={f.reviewStatus} />
                      <span className="text-[11px] text-slate-600">
                        Dor Relacionada: {pain ? (
                          <Link to="/dores/$painId" params={{ painId: pain.id }} className="font-semibold text-blue-700 hover:underline">
                            {pain.titulo} ({pain.id})
                          </Link>
                        ) : f.dorConsolidadaId}
                      </span>
                    </div>

                    {/* Pain Score local da Organização para essa Dor */}
                    <div className="bg-white px-2.5 py-1 rounded border border-rose-200 text-[11px] font-mono shrink-0">
                      <span className="text-slate-500 mr-1">Pain Score local:</span>
                      {isMeasured && occ?.painScore ? (
                        <strong className="text-rose-900">{occ.painScore.total}/25</strong>
                      ) : (
                        <span className="text-slate-400 italic">Intensidade não mensurada.</span>
                      )}
                    </div>
                  </div>

                  {/* Origem, Organização e Entrevistado */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5 text-slate-700">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="font-bold text-slate-900">
                          {org ? (
                            <Link to="/organizacoes/$orgId" params={{ orgId: org.id }} className="hover:text-blue-700 hover:underline inline-flex items-center gap-1">
                              {org.nome} <ArrowRight className="w-3 h-3 text-blue-500" />
                            </Link>
                          ) : (
                            f.origem || 'Fonte Externa'
                          )}
                        </span>
                      </div>

                      <span className="flex items-center gap-1 text-slate-600 text-[11px]">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {intervieweeInfo.label}
                      </span>

                      {f.entrevistaId && (
                        <Link
                          to="/entrevistas/$interviewId"
                          params={{ interviewId: f.entrevistaId }}
                          className="text-blue-700 hover:underline font-semibold text-[11px] inline-flex items-center gap-1"
                        >
                          Ver Entrevista <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Falas e Interpretação Analítica */}
                  <div className="space-y-2">
                    {/* Nível 1: Fala Original Capturada (Imutável) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <span>Fala Original Capturada</span>
                        <span className="text-[9px] font-mono text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                          Registro de Campo Imutável
                        </span>
                      </div>
                      <div className="italic text-slate-900 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                        "{f.fraseOriginal}"
                      </div>
                    </div>

                    {/* Nível 2: Versão Revisada (se houver) */}
                    {hasRevisedSpeech && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                          Versão Revisada de Transcrição
                        </div>
                        <div className="italic text-slate-800 bg-blue-50/50 p-2.5 rounded-lg border border-blue-200 leading-relaxed">
                          "{f.fraseRevisada}"
                        </div>
                      </div>
                    )}

                    {/* Nível 3: Interpretação Analítica */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        Interpretação Analítica do Contraponto
                      </div>
                      <div className="text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                        {f.interpretacao}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sub-bloco: Evidências que Sustentam ou Limitam o ICP */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <h3>Evidências que Sustentam ou Limitam o ICP</h3>
          </div>
          
          <p className="text-slate-700 leading-relaxed">
            {contraryFindingsForOpp.length > 0 ? (
              <>
                Na amostragem investigada, foi observada evidência atenuante pontual (ex: na{' '}
                <strong className="text-slate-900">
                  {organizacoes.find(o => o.id === contraryFindingsForOpp[0].organizacaoId)?.nome || contraryFindingsForOpp[0].organizacaoId}
                </strong>
                ), onde o problema apresenta menor severidade em razão de uma carteira de clientes menor e uso prévio de portal/aplicativo. Em contrapartida, organizações de maior porte (como{' '}
                <strong className="text-slate-900">
                  {organizacoes.find(o => o.id === 'ORG-CONT-001')?.nome || 'ORG-CONT-001'}
                </strong>
                ) reportaram alta dor e grande gargalo operacional.
              </>
            ) : (
              <>
                Até o momento, não foram registradas evidências contrárias nas organizações investigadas para esta hipótese de oportunidade.
              </>
            )}
          </p>

          <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-amber-200/60 mt-2">
            <span className="italic">
              Este é um limite observado na amostra atual e não uma regra geral do mercado.
            </span>
            <span className="font-mono text-slate-400">
              Nota: O ICP Hipotético permanece registrado sem alterações automáticas.
            </span>
          </div>
        </div>
      </div>
      </section>

      {/* Scores & Viabilidade */}
      <section aria-label="Scores & Viabilidade" className="space-y-4">
        {/* Opportunity Score Breakdown (PRD Seção 41) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Opportunity Score Breakdown (0–100)
                <span className="text-[10px] font-mono text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                  Avaliação atribuída
                </span>
              </h3>
            </div>
            <span className="font-mono font-bold text-base text-blue-700">{opp.opportunityScore.total}/100</span>
          </div>

          {/* Explicativo de Transparência Metodológica do Opportunity Score */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[11px] space-y-1.5 leading-relaxed">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              Transparência Metodológica do Opportunity Score:
            </div>
            <p>
              O score representa uma avaliação estruturada registrada para esta oportunidade. Ele não é recalculado automaticamente a partir das evidências de campo.
            </p>
            <p className="text-slate-500 italic pt-1 border-t border-slate-200/60 text-[10.5px]">
              Os valores abaixo são avaliações atribuídas segundo o framework COSMO e devem ser revisados conforme novas evidências sejam coletadas.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Mercado (Tamanho e multiplicador B2B):</span>
                <span className="font-mono font-bold">{opp.opportunityScore.mercado}/20</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(opp.opportunityScore.mercado / 20) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Dor (Incidência e severidade):</span>
                <span className="font-mono font-bold">{opp.opportunityScore.dor}/25</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(opp.opportunityScore.dor / 25) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Customer Operations Gap (Falta de solução no ERP):</span>
                <span className="font-mono font-bold">{opp.opportunityScore.operationsGap}/25</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(opp.opportunityScore.operationsGap / 25) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Economia da Oportunidade (WTP & ROI claro):</span>
                <span className="font-mono font-bold">{opp.opportunityScore.economia}/20</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(opp.opportunityScore.economia / 20) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Go-To-Market (Canais e distribuição):</span>
                <span className="font-mono font-bold">{opp.opportunityScore.gtm}/10</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(opp.opportunityScore.gtm / 10) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Score & Indicator Separation Callout */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Nível de Confiança & Distinção de Indicadores
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Avaliação atribuída de confiança na hipótese da oportunidade.
              </p>
            </div>
            <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 shrink-0">
              Confiança atribuída: {opp.confidenceScore}%
            </span>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/80 text-emerald-950 text-[11px] space-y-1.5 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              Definição do Nível de Confiança:
            </div>
            <p>
              Indicador registrado para representar a confiança atual na hipótese. Não é uma probabilidade estatística.
            </p>
          </div>

          {/* Distinção Conceitual entre os 3 Indicadores */}
          <div className="space-y-2 pt-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Distinção entre os 3 Indicadores da Oportunidade:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wide">1. Opportunity Score</span>
                <span className="font-mono font-bold text-blue-700 block">{opp.opportunityScore.total}/100</span>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Priorização estruturada atribuída (Mercado, Dor, Gap, Economia, GTM).
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wide">2. Confidence Score</span>
                <span className="font-mono font-bold text-emerald-700 block">{opp.confidenceScore}%</span>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Avaliação de confiança atribuída à hipótese. Não é probabilidade estatística.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wide">3. Evidence Level</span>
                <div className="mt-0.5">
                  <EvidenceLevelBadge level={opp.evidenceLevel} />
                </div>
                <p className="text-[10px] text-slate-500 leading-tight mt-1">
                  Maturidade e tipo de prova empírica coletada no campo (H0–H5).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Leverage Assessment (PRD Seção 34) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-600" />
              Alavancagem de IA (AI Leverage - PRD Seção 34)
            </h3>
            <span className="font-mono font-bold text-sm text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              {opp.aiLeverage.total}/30
            </span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Avaliação de viabilidade e impacto da IA nas 6 dimensões do PRD:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
            <div className="p-2 bg-purple-50/50 rounded border border-purple-100">
              <span className="text-slate-500 block text-[10px]">1. Leitura Não Est.</span>
              <span className="font-bold text-purple-900">{opp.aiLeverage.leituraNaoEstruturada}/5</span>
            </div>
            <div className="p-2 bg-purple-50/50 rounded border border-purple-100">
              <span className="text-slate-500 block text-[10px]">2. Classificação</span>
              <span className="font-bold text-purple-900">{opp.aiLeverage.classificacao}/5</span>
            </div>
            <div className="p-2 bg-purple-50/50 rounded border border-purple-100">
              <span className="text-slate-500 block text-[10px]">3. Extração Dados</span>
              <span className="font-bold text-purple-900">{opp.aiLeverage.extracao}/5</span>
            </div>
            <div className="p-2 bg-purple-50/50 rounded border border-purple-100">
              <span className="text-slate-500 block text-[10px]">4. Comparação</span>
              <span className="font-bold text-purple-900">{opp.aiLeverage.comparacao}/5</span>
            </div>
            <div className="p-2 bg-purple-50/50 rounded border border-purple-100">
              <span className="text-slate-500 block text-[10px]">5. Geração</span>
              <span className="font-bold text-purple-900">{opp.aiLeverage.geracao}/5</span>
            </div>
            <div className="p-2 bg-purple-50/50 rounded border border-purple-100">
              <span className="text-slate-500 block text-[10px]">6. Revisão Humana</span>
              <span className="font-bold text-purple-900">{opp.aiLeverage.revisaoHumanaDisponivel}/5</span>
            </div>
          </div>
        </div>

      </section>

      {/* Kill Criteria & Experimentos (PRD Seção 44 e 45) */}
      <section aria-label="Validação" className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Kill Criteria Table */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Critérios de Descarte (Kill Criteria - PRD Seção 45)
            </h3>
            <span className="text-[11px] text-slate-400">Decisão Humana Obrigatória</span>
          </div>

          <div className="divide-y divide-slate-100">
            {opp.killCriteria.map(kc => (
              <div key={kc.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{kc.criterio}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    kc.status === 'seguro' ? 'bg-emerald-100 text-emerald-800' :
                    kc.status === 'alerta' ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                  }`}>
                    {kc.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Limiar de corte: <span className="font-mono text-slate-700 font-semibold">{kc.limiar}</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Condição atual observada: {kc.observacao}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experimentos Validados */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-blue-600" />
              Histórico de Experimentos (PRD Seção 44)
            </h3>
            <span className="text-[11px] text-slate-400">{opp.experimentos.length} realizados</span>
          </div>

          <div className="space-y-2.5">
            {opp.experimentos.map(exp => (
              <div key={exp.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{exp.tipo}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                    {exp.conclusao}
                  </span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  <strong>Hipótese:</strong> {exp.hipotese}
                </div>
                <div className="text-slate-500 text-[11px]">
                  <strong>Resultado observado:</strong> {exp.resultadoObservado}
                </div>
                <div className="text-[10px] text-slate-400 pt-1">
                  Data: {exp.data}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE EVIDENCE CHAIN (Rastreabilidade Integral - PRD Seção 4 & 81.16) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-blue-600" />
              Cadeia Completa de Evidências (Evidence Chain - PRD Seção 4)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Rastreabilidade ponta a ponta: <em>Oportunidade → Dor Consolidada → Ocorrência → Achado → Entrevista → Entrevistado → Organização</em>
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">100% Rastreável</span>
        </div>

        {/* Dores Consolidadas Relacionadas */}
        {relatedPains.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-semibold text-[11px]">Dores Consolidadas Vinculadas:</span>
            {relatedPains.map(p => (
              <Link
                key={p.id}
                to="/dores/$painId"
                params={{ painId: p.id }}
                className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-semibold transition-colors"
              >
                <span>{p.id}</span>
                <span className="font-sans text-slate-600 font-normal">({p.titulo})</span>
              </Link>
            ))}
          </div>
        )}

        {/* Visual Breadcrumb / Chain Nodes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
          {/* List of Evidence Nodes in the Chain */}
          <div className="lg:col-span-1 space-y-2 max-h-[380px] overflow-y-auto pr-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Selecione um Achado na Cadeia ({relatedFindings.length}):
            </div>

            {relatedFindings.map(f => {
              const org = organizacoes.find(o => o.id === f.organizacaoId);
              const isSelected = (inspectFinding?.id === f.id);

              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedChainFindingId(f.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500 shadow-2xs' 
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-700">{f.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      f.natureza === 'favoravel' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {f.natureza}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 mt-1 line-clamp-1">{f.titulo}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Origem: {org?.nome?.slice(0, 18)}... • {f.categoria}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Inspection Card of Selected Chain Node */}
          <div className="lg:col-span-2 bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-[11px] border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-700">Rastreabilidade em Nível Atômico</span>
              <span className="font-mono text-slate-400">Achado ID: {inspectFinding?.id}</span>
            </div>

            {/* Step-by-Step Chain Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2.5 rounded bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px]">1. Organização</span>
                <span className="font-bold text-slate-900 block mt-0.5">{inspectOrg?.nome}</span>
                <span className="text-slate-500 text-[10px]">{inspectOrg?.numClientes} clientes • {inspectOrg?.cidade}</span>
              </div>

              <div className="p-2.5 rounded bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px]">2. Entrevistado</span>
                <span className="font-bold text-slate-900 block mt-0.5">{inspectPerson?.nome}</span>
                <span className="text-slate-500 text-[10px]">{inspectPerson?.cargo} ({inspectPerson?.perfil})</span>
              </div>

              <div className="p-2.5 rounded bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px]">3. Sessão de Entrevista</span>
                {inspectInterview?.id ? (
                  <Link
                    to="/entrevistas/$interviewId"
                    params={{ interviewId: inspectInterview.id }}
                    className="font-bold text-blue-700 hover:underline block mt-0.5 font-mono"
                  >
                    {inspectInterview.id}
                  </Link>
                ) : (
                  <span className="font-bold text-slate-900 block mt-0.5">-</span>
                )}
                <span className="text-slate-500 text-[10px]">Data: {inspectInterview?.data}</span>
              </div>

              <div className="p-2.5 rounded bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px]">4. Dor Consolidada</span>
                {inspectFinding?.dorConsolidadaId ? (
                  <Link
                    to="/dores/$painId"
                    params={{ painId: inspectFinding.dorConsolidadaId }}
                    className="font-bold text-blue-700 hover:underline block mt-0.5 font-mono"
                  >
                    {inspectFinding.dorConsolidadaId}
                  </Link>
                ) : (
                  <span className="text-slate-400 text-[10px] block mt-0.5">Não vinculada</span>
                )}
                <span className="text-slate-500 text-[10px]">Rastreabilidade</span>
              </div>
            </div>

            {/* Preserved Verbatim Quote (PRD Seção 26) */}
            <div className="p-3.5 bg-white rounded-lg border border-blue-200 text-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold text-[11px] uppercase tracking-wider">
                <Quote className="w-3.5 h-3.5 text-blue-600" />
                Fala Original Preservada (Evidência Observada):
              </div>
              <p className="italic text-xs text-slate-800 leading-relaxed bg-blue-50/30 p-2 rounded">
                "{inspectFinding?.fraseOriginal}"
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
              <strong className="text-slate-800">Interpretação Analítica:</strong>
              <p>{inspectFinding?.interpretacao}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
