import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useMatches } from '@tanstack/react-router';
import { useRadar } from '../../context/RadarContext';
import { ROUTES } from '../../navigation/routeMap';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { 
  MessageSquareText, 
  Play, 
  User, 
  Building2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Plus, 
  Quote, 
  ArrowRight,
  HelpCircle,
  Sparkles,
  Layers,
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  Zap,
  Trash2,
  Edit3,
  Filter,
  FileText
} from 'lucide-react';
import { Interview, InterviewQuestionInstance, Finding } from '../../types/radar';

export const InterviewsView: React.FC<{ onNewInterviewClick?: () => void }> = ({ onNewInterviewClick }) => {
  const { 
    entrevistas, 
    organizacoes, 
    saveInterview,
    addFinding,
    updateFinding,
    deleteFinding,
    achados,
    doresConsolidadas,
    promoteQuestion
  } = useRadar();

  const navigate = useNavigate();
  const matches = useMatches();
  const interviewMatch = matches.find(m => m.routeId === '/entrevistas/$interviewId');
  const routeInterviewId = (interviewMatch?.params as Record<string, string> | undefined)?.interviewId;

  // Busca estrita do ID fornecido na URL
  const interviewFromRoute = routeInterviewId 
    ? entrevistas.find(e => e.id === routeInterviewId)
    : null;

  const [activeInterview, setActiveInterview] = useState<Interview | null>(() => {
    if (routeInterviewId) {
      return interviewFromRoute || null;
    }
    return entrevistas[0] || null;
  });

  // Estado local exclusivo para navegação da Pergunta Ativa (Etapa 4B.2)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Estado visual do Autosave (Etapa 4B.2)
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Ref para a textarea da pergunta ativa (Etapa 4B.3)
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Estado para Captura Rápida de Evidência (Etapa 4B.3)
  const [quickCaptureToast, setQuickCaptureToast] = useState<string | null>(null);
  const [quickCaptureFallbackOpen, setQuickCaptureFallbackOpen] = useState(false);
  const [fallbackQuoteText, setFallbackQuoteText] = useState('');

  // Sincronização do estado local com a URL e reinicialização segura do índice
  useEffect(() => {
    if (routeInterviewId) {
      const found = entrevistas.find(e => e.id === routeInterviewId);
      setActiveInterview(found || null);
    } else if (!activeInterview && entrevistas.length > 0) {
      setActiveInterview(entrevistas[0]);
    }
  }, [routeInterviewId, entrevistas]);

  // Reinicia o índice de pergunta ativa ao trocar de entrevista
  useEffect(() => {
    setActiveQuestionIndex(0);
  }, [activeInterview?.id]);

  const [expandedFollowUps, setExpandedFollowUps] = useState<Record<string, boolean>>({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showEmergentQuestionModal, setShowEmergentQuestionModal] = useState(false);
  const [emergentText, setEmergentText] = useState('');
  const [emergentCategory, setEmergentCategory] = useState('Processo / Foco');
  const [promoteTo, setPromoteTo] = useState<'interview' | 'organizacao' | 'subvertical' | 'vertical' | 'global'>('vertical');

  // Finding Extraction state
  const [extractingForQuestionId, setExtractingForQuestionId] = useState<string | null>(null);
  const [findingOriginalQuote, setFindingOriginalQuote] = useState('');
  const [findingInterpretation, setFindingInterpretation] = useState('');
  const [findingNature, setFindingNature] = useState<'favoravel' | 'contraria' | 'neutra'>('favoravel');
  const [findingSelectedPainId, setFindingSelectedPainId] = useState<string>('DOR-CONT-001');

  // Estado do Modal de Revisão Pós-Entrevista (Etapa 4B.4)
  const [showPendingReviewModal, setShowPendingReviewModal] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewFraseOriginal, setReviewFraseOriginal] = useState('');
  const [reviewFraseRevisada, setReviewFraseRevisada] = useState('');
  const [reviewInterpretacao, setReviewInterpretacao] = useState('');
  const [reviewNatureza, setReviewNatureza] = useState<'favoravel' | 'contraria' | 'neutra' | undefined>(undefined);
  const [reviewDorId, setReviewDorId] = useState<string>('');
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [reviewMotivoChoice, setReviewMotivoChoice] = useState<'duplicada' | 'fora_de_contexto' | 'nao_representa_evidencia' | 'erro_de_captura' | 'outro'>('duplicada');
  const [reviewMotivoOutro, setReviewMotivoOutro] = useState('');

  // Derivações de Achados da Entrevista Ativa (Etapa 4B.4)
  const activeInterviewFindings = achados.filter(f => activeInterview?.achadosGeradosIds.includes(f.id));
  const pendingFindings = activeInterviewFindings.filter(f => f.reviewStatus === 'pendente' || (!f.reviewStatus && f.tags.includes('pendente-revisao')));
  const reviewedFindings = activeInterviewFindings.filter(f => f.reviewStatus === 'revisado' || (f.natureza && !f.tags.includes('pendente-revisao') && f.reviewStatus !== 'descartado'));
  const discardedFindings = activeInterviewFindings.filter(f => f.reviewStatus === 'descartado');

  const loadReviewTarget = (idx: number, findingsList = pendingFindings) => {
    if (!findingsList[idx]) return;
    const target = findingsList[idx];
    setReviewIndex(idx);
    setReviewFraseOriginal(target.fraseOriginal || '');
    setReviewFraseRevisada(target.fraseRevisada || '');
    const isAutoText = target.interpretacao === 'Captura rápida em campo — aguardando revisão e classificação analítica pós-entrevista.';
    setReviewInterpretacao(isAutoText ? '' : (target.interpretacao || ''));
    setReviewNatureza(undefined); // Metodologia 4B.4: escolha consciente e explícita sem default
    setReviewDorId(target.dorConsolidadaId || '');
    setReviewMotivoChoice('duplicada');
    setReviewMotivoOutro('');
    setShowDiscardConfirm(false);
  };

  const openPendingReview = (findingTarget?: string | number) => {
    if (pendingFindings.length === 0) return;
    let targetIdx = 0;
    if (typeof findingTarget === 'number') {
      targetIdx = Math.min(Math.max(0, findingTarget), pendingFindings.length - 1);
    } else if (typeof findingTarget === 'string') {
      const foundIdx = pendingFindings.findIndex(f => f.id === findingTarget);
      if (foundIdx >= 0) targetIdx = foundIdx;
    }
    loadReviewTarget(targetIdx, pendingFindings);
    setShowPendingReviewModal(true);
  };

  const handleSaveReview = () => {
    const currentFinding = pendingFindings[reviewIndex];
    if (!currentFinding) return;
    if (!reviewInterpretacao.trim()) return;
    if (!reviewNatureza) return;

    const updated: Finding = {
      ...currentFinding,
      fraseOriginal: currentFinding.fraseOriginal, // Preservação imutável da fala original
      fraseRevisada: reviewFraseRevisada.trim() || undefined,
      interpretacao: reviewInterpretacao.trim(),
      natureza: reviewNatureza,
      dorConsolidadaId: reviewDorId || undefined,
      reviewStatus: 'revisado' as const,
      titulo: `Achado em ${currentOrg?.nome?.slice(0, 20) || 'Org'}: ${reviewInterpretacao.trim().slice(0, 35)}...`,
      tags: currentFinding.tags.filter(t => t !== 'pendente-revisao')
    };

    updateFinding(updated);

    const remainingPending = pendingFindings.filter(f => f.id !== currentFinding.id);
    if (remainingPending.length > 0) {
      const nextIdx = Math.min(reviewIndex, remainingPending.length - 1);
      loadReviewTarget(nextIdx, remainingPending);
    } else {
      setShowPendingReviewModal(false);
    }
  };

  const handleDiscardReview = () => {
    const currentFinding = pendingFindings[reviewIndex];
    if (!currentFinding) return;

    const motivosLabels: Record<string, string> = {
      duplicada: 'Duplicada',
      fora_de_contexto: 'Fora de contexto',
      nao_representa_evidencia: 'Não representa evidência',
      erro_de_captura: 'Erro de captura',
      outro: reviewMotivoOutro.trim() || 'Outro motivo'
    };

    const motivoFinal = motivosLabels[reviewMotivoChoice] || 'Descartado na revisão pós-entrevista';

    const updated: Finding = {
      ...currentFinding,
      reviewStatus: 'descartado' as const,
      motivoDescarte: motivoFinal,
      tags: [...currentFinding.tags.filter(t => t !== 'pendente-revisao'), 'descartado']
    };

    // Atualiza o achado para 'descartado' preservando histórico sem remoção física (Ponto 1 e 2)
    updateFinding(updated);

    const remainingPending = pendingFindings.filter(f => f.id !== currentFinding.id);
    if (remainingPending.length > 0) {
      const nextIdx = Math.min(reviewIndex, remainingPending.length - 1);
      loadReviewTarget(nextIdx, remainingPending);
    } else {
      setShowPendingReviewModal(false);
    }
  };

  const currentOrg = organizacoes.find(o => o.id === activeInterview?.organizacaoId);
  const currentPerson = currentOrg?.entrevistados.find(p => p.id === activeInterview?.entrevistadoId);

  const toggleFollowUp = (qId: string) => {
    setExpandedFollowUps(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleAnswerChange = (qId: string, answer: string) => {
    if (!activeInterview) return;
    const updatedQuestions = activeInterview.perguntas.map(q => {
      if (q.id === qId) {
        return { ...q, respostaQualitativa: answer };
      }
      return q;
    });
    const updated = { ...activeInterview, perguntas: updatedQuestions };
    setActiveInterview(updated);
    saveInterview(updated);

    // Registra horário do autosave visual
    const now = new Date();
    setLastSavedTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const handleAddEmergentQuestion = () => {
    if (!activeInterview || !emergentText.trim()) return;

    const newQ: InterviewQuestionInstance = {
      id: `IP-EMERG-${Date.now().toString().slice(-4)}`,
      texto: emergentText.trim(),
      escopo: promoteTo,
      categoria: emergentCategory,
      respostaQualitativa: '',
      followUps: ['Quanto tempo isso consome?', 'Qual a frequência dessa ocorrência?'],
      isEmergente: true
    };

    const updated = {
      ...activeInterview,
      perguntas: [...activeInterview.perguntas, newQ]
    };
    setActiveInterview(updated);
    saveInterview(updated);

    if (promoteTo !== 'interview') {
      promoteQuestion(
        emergentText.trim(),
        emergentCategory,
        newQ.followUps,
        promoteTo,
        {
          interviewId: activeInterview.id,
          organizacaoId: activeInterview.organizacaoId,
          verticalId: activeInterview.verticalId,
          subverticalId: currentOrg?.subverticalId,
          previousScope: 'Entrevista',
          originNote: `Entrevista ${activeInterview.id} (${currentOrg?.nome})`
        }
      );
    }

    setEmergentText('');
    setShowEmergentQuestionModal(false);
  };

  // Funções de Captura Rápida de Evidência (Etapa 4B.3)
  const createQuickFinding = (q: InterviewQuestionInstance, quote: string) => {
    if (!activeInterview || !quote.trim()) return;

    const newFinding = addFinding({
      titulo: `Captura em ${currentOrg?.nome?.slice(0, 18) || 'Entrevista'}: "${quote.trim().slice(0, 30)}..."`,
      descricao: `Fala capturada durante a pergunta "${q.texto.slice(0, 45)}..."`,
      origem: 'Entrevista',
      tipoEvidencia: 'evidencia_observada',
      reviewStatus: 'pendente', // Estado explícito de captura não analisada (Microcorreção 4B.3)
      natureza: undefined, // SEM natureza atribuída artificialmente
      organizacaoId: activeInterview.organizacaoId,
      entrevistadoId: activeInterview.entrevistadoId,
      entrevistaId: activeInterview.id,
      categoria: q.categoria,
      fraseOriginal: quote.trim(),
      interpretacao: 'Captura rápida em campo — aguardando revisão e classificação analítica pós-entrevista.',
      tags: ['captura-rapida', 'pendente-revisao', q.categoria.toLowerCase()],
      dorConsolidadaId: undefined // NÃO vincula dor na captura rápida
    });

    const updatedAchadosIds = activeInterview.achadosGeradosIds.includes(newFinding.id)
      ? activeInterview.achadosGeradosIds
      : [...activeInterview.achadosGeradosIds, newFinding.id];

    const updatedInterview = {
      ...activeInterview,
      achadosGeradosIds: updatedAchadosIds
    };
    setActiveInterview(updatedInterview);
    saveInterview(updatedInterview);

    setQuickCaptureToast(`Evidência capturada para revisão: "${quote.trim().slice(0, 35)}..."`);
    setTimeout(() => setQuickCaptureToast(null), 3500);
    setQuickCaptureFallbackOpen(false);
  };

  const handleQuickCaptureTrigger = (q: InterviewQuestionInstance) => {
    const textarea = textareaRef.current;
    let selectedText = '';
    if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
      selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd).trim();
    }

    if (selectedText) {
      createQuickFinding(q, selectedText);
    } else {
      setFallbackQuoteText(q.respostaQualitativa || '');
      setQuickCaptureFallbackOpen(true);
    }
  };

  const handleSaveFinding = (q: InterviewQuestionInstance) => {
    if (!activeInterview || !findingOriginalQuote.trim()) return;

    const newFinding = addFinding({
      titulo: `Achado em ${currentOrg?.nome?.slice(0, 20)}: ${findingInterpretation.slice(0, 35)}...`,
      descricao: findingInterpretation,
      origem: 'Entrevista',
      tipoEvidencia: 'evidencia_observada',
      reviewStatus: 'revisado',
      natureza: findingNature,
      organizacaoId: activeInterview.organizacaoId,
      entrevistadoId: activeInterview.entrevistadoId,
      entrevistaId: activeInterview.id,
      categoria: q.categoria,
      fraseOriginal: findingOriginalQuote.trim(),
      interpretacao: findingInterpretation.trim() || 'Evidência de rotina operacional observada.',
      tags: ['entrevista', q.categoria.toLowerCase()],
      dorConsolidadaId: findingSelectedPainId
    });

    const updatedAchadosIds = activeInterview.achadosGeradosIds.includes(newFinding.id)
      ? activeInterview.achadosGeradosIds
      : [...activeInterview.achadosGeradosIds, newFinding.id];

    const updatedInterview = {
      ...activeInterview,
      achadosGeradosIds: updatedAchadosIds
    };
    setActiveInterview(updatedInterview);
    saveInterview(updatedInterview);

    setExtractingForQuestionId(null);
    setFindingOriginalQuote('');
    setFindingInterpretation('');
  };

  const handleFinalizeInterview = () => {
    if (!activeInterview) return;
    const updated: Interview = {
      ...activeInterview,
      status: 'Concluída'
    };
    setActiveInterview(updated);
    saveInterview(updated);
    setShowReviewModal(false);
  };

  // Guard para ID de entrevista inexistente informado na URL
  if (routeInterviewId && !interviewFromRoute) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-xs">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-full">
            Entrevista não encontrada
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Nenhuma entrevista registrada para "{routeInterviewId}"
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            O identificador fornecido na URL não corresponde a nenhuma entrevista registrada no sistema.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to={ROUTES.ENTREVISTAS}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Entrevistas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Condução e Roteiro de Entrevistas
            </h1>
            <SimulacaoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Question Engine com perguntas compostas (Global + Vertical + Perfil) e extração de achados com fala original (PRD Seção 17 e 59).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeInterview?.id || ''}
            onChange={(e) => {
              const selectedId = e.target.value;
              if (selectedId) {
                const selected = entrevistas.find(ent => ent.id === selectedId);
                if (selected) {
                  setActiveInterview(selected);
                  navigate({ to: '/entrevistas/$interviewId', params: { interviewId: selectedId } });
                }
              }
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:outline-hidden"
          >
            {entrevistas.map(ent => {
              const org = organizacoes.find(o => o.id === ent.organizacaoId);
              const person = org?.entrevistados.find(p => p.id === ent.entrevistadoId);
              return (
                <option key={ent.id} value={ent.id}>
                  {ent.id} — {person?.nome || 'Entrevistado'} ({org?.nome?.slice(0, 18)})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {activeInterview ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Interview Conductor (2 Cols - PRD Seção 59) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Top Bar of active interview */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-slate-400 font-semibold">{activeInterview.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    activeInterview.status === 'Concluída' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {activeInterview.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold">
                    {activeInterview.formato || 'Individual'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                    {activeInterview.tipo}
                  </span>
                  {/* Indicador visual de Autosave (Etapa 4B.2 - PROB-05) */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                    <span>Salvo no dispositivo {lastSavedTime ? `(${lastSavedTime})` : ''}</span>
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-1">
                  {currentPerson?.nome} — {currentPerson?.cargo} ({currentPerson?.perfil})
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  Organização: <strong>{currentOrg?.nome}</strong> ({currentOrg?.numClientes} clientes PMEs)
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {pendingFindings.length > 0 && (
                  <button
                    type="button"
                    onClick={() => openPendingReview(0)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all active:scale-98 animate-pulse cursor-pointer"
                    title="Abrir painel de revisão analítica pós-entrevista para capturas pendentes"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{pendingFindings.length} captura(s) a revisar</span>
                  </button>
                )}

                <button
                  onClick={() => setShowEmergentQuestionModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Pergunta Emergente</span>
                </button>

                <button
                  onClick={() => setShowReviewModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Finalizar & Revisar</span>
                </button>
              </div>
            </div>

            {/* Roteiro Index and Progress Indicator (Etapa 4B.2) */}
            {(() => {
              const totalQuestions = activeInterview.perguntas.length;
              const safeActiveIndex = Math.min(Math.max(0, activeQuestionIndex), Math.max(0, totalQuestions - 1));
              const answeredCount = activeInterview.perguntas.filter(q => q.respostaQualitativa.trim().length > 0).length;

              return (
                <div className="space-y-4">
                  {/* Index Bar & Progress Bar */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Roteiro da Entrevista</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-semibold text-blue-700">
                          Pergunta {safeActiveIndex + 1} de {totalQuestions}
                        </span>
                      </div>
                      <div className="text-slate-500 font-medium text-[11px]">
                        <strong>{answeredCount}</strong> de {totalQuestions} respondidas ({Math.round((answeredCount / (totalQuestions || 1)) * 100)}%)
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.round(((safeActiveIndex + 1) / (totalQuestions || 1)) * 100)}%` }}
                      />
                    </div>

                    {/* Compact Index Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
                      {activeInterview.perguntas.map((q, idx) => {
                        const isActive = idx === safeActiveIndex;
                        const hasAnswer = q.respostaQualitativa.trim().length > 0;

                        let badgeClasses = "px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer shrink-0 ";
                        if (isActive) {
                          badgeClasses += "bg-blue-600 text-white shadow-xs ring-2 ring-blue-300";
                        } else if (hasAnswer) {
                          badgeClasses += "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100";
                        } else {
                          badgeClasses += "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100";
                        }

                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => setActiveQuestionIndex(idx)}
                            className={badgeClasses}
                            title={`Pergunta ${idx + 1}: ${q.texto.slice(0, 45)}...`}
                          >
                            <span>{idx + 1}</span>
                            {hasAnswer && !isActive && <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />}
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Single Active Question Conductor Card (PROB-03 & PROB-01 fix) */}
                  {activeInterview.perguntas[safeActiveIndex] && (() => {
                    const q = activeInterview.perguntas[safeActiveIndex];
                    const isFollowUpOpen = !!expandedFollowUps[q.id];
                    const isExtracting = extractingForQuestionId === q.id;

                    return (
                      <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
                        {/* Header of Active Question */}
                        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                                Pergunta {safeActiveIndex + 1} de {totalQuestions}
                              </span>
                              <span className="text-slate-300 text-xs">•</span>
                              <span className="text-slate-600 font-semibold text-xs">Categoria: {q.categoria}</span>
                              <span className="text-slate-300 text-xs">•</span>
                              <span className="uppercase font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                Escopo: {q.escopo}
                              </span>
                              {q.isEmergente && (
                                <span className="text-purple-700 font-bold bg-purple-100 px-1.5 py-0.5 rounded text-[10px]">
                                  Emergente
                                </span>
                              )}
                            </div>
                            
                            {/* Prominent Question Text */}
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-2.5">
                              {q.texto}
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleFollowUp(q.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 shrink-0 transition-colors border border-blue-200/60"
                            title="Abre perguntas de aprofundamento (Follow-ups - PRD Seção 22)"
                          >
                            <span>Aprofundar ({q.followUps.length})</span>
                            {isFollowUpOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Follow-ups Panel (PRD Seção 22) */}
                        {isFollowUpOpen && (
                          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
                            <div className="font-bold text-blue-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                              <span>Follow-ups Sugeridos para Aprofundamento:</span>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-slate-800">
                              {q.followUps.map((fText, fIdx) => (
                                <li key={fIdx} className="text-xs">
                                  <span className="font-medium text-slate-900">{fText}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Broad Qualitative Response Input (PROB-01 fix: Expanded Textarea) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="font-bold text-slate-700 block text-xs flex items-center gap-1.5">
                              <MessageSquareText className="w-4 h-4 text-blue-600" />
                              <span>Resposta Qualitativa do Entrevistado (Anotação ao Vivo):</span>
                            </label>
                            <span className="text-[11px] text-slate-400 italic">
                              {q.respostaQualitativa.length > 0 ? `${q.respostaQualitativa.length} caracteres` : 'Aguardando relato do entrevistado'}
                            </span>
                          </div>
                          <textarea
                            ref={textareaRef}
                            rows={7}
                            value={q.respostaQualitativa}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            placeholder="Digite aqui o relato completo do entrevistado durante esta pergunta... (Salvo automaticamente conforme você digita)"
                            className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-900 text-xs sm:text-sm leading-relaxed min-h-[160px] shadow-2xs font-sans transition-all"
                          />
                        </div>

                        {/* Structured Variables (PRD Seção 24) */}
                        {q.variaveisEstruturadas && (
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3 text-[11px]">
                            <span className="font-semibold text-slate-500">Variáveis Estruturadas Extraídas:</span>
                            <div className="flex items-center gap-2 flex-wrap">
                              {Object.entries(q.variaveisEstruturadas).map(([k, v]) => (
                                <span key={k} className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                                  {k} = <strong>{String(v)}</strong>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Bar for this question: Captura Rápida (Etapa 4B.3) & Estruturação Completa */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Botão de Ação Dominante: Captura Rápida sem Carga Cognitiva (Seção 4 & 7) */}
                            <button
                              type="button"
                              onClick={() => handleQuickCaptureTrigger(q)}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-2xs transition-all active:scale-98"
                              title="Captura o trecho selecionado da fala (ou abre confirmação) para análise pós-entrevista sem interromper a conversa"
                            >
                              <Zap className="w-3.5 h-3.5 fill-current" />
                              <span>⚡ Capturar Evidência Rápida</span>
                            </button>

                            <span className="text-slate-300 hidden sm:inline">•</span>

                            {/* Ação Secundária: Estruturar Achado Completo (Legado) */}
                            <button
                              type="button"
                              onClick={() => {
                                setExtractingForQuestionId(isExtracting ? null : q.id);
                                setFindingOriginalQuote(q.respostaQualitativa);
                              }}
                              className="text-slate-500 hover:text-slate-800 font-medium hover:underline flex items-center gap-1 py-1"
                            >
                              <Quote className="w-3.5 h-3.5" />
                              <span>{isExtracting ? 'Cancelar Estruturação' : 'Estruturar achado completo'}</span>
                            </button>
                          </div>

                          {/* Toast de Feedback de Captura (Seção 8) */}
                          {quickCaptureToast && (
                            <div className="bg-emerald-900 text-emerald-100 px-3 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 animate-in fade-in shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="truncate max-w-[280px]">{quickCaptureToast}</span>
                            </div>
                          )}
                        </div>

                        {/* Fallback de Captura Rápida quando não houver texto selecionado (Seção 6) */}
                        {quickCaptureFallbackOpen && (
                          <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/90 space-y-2.5 mt-2 animate-in fade-in">
                            <div className="flex items-center justify-between">
                              <div className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                                <Zap className="w-4 h-4 text-amber-600" />
                                <span>Captura Rápida de Fala (Nenhum texto selecionado)</span>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => setQuickCaptureFallbackOpen(false)} 
                                className="text-amber-700 hover:text-amber-950 text-xs font-bold px-1"
                              >
                                ✕
                              </button>
                            </div>
                            <p className="text-[11px] text-amber-800">
                              Edite ou confirme a frase exata do entrevistado que você deseja guardar para revisão posterior:
                            </p>
                            <textarea
                              rows={3}
                              value={fallbackQuoteText}
                              onChange={(e) => setFallbackQuoteText(e.target.value)}
                              placeholder="Cole ou edite a citação do entrevistado aqui..."
                              className="w-full p-2.5 bg-white rounded-lg border border-amber-300 text-xs leading-relaxed text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                            />
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                              <span className="text-amber-700 italic">
                                💡 Dica: Selecione qualquer trecho no campo principal antes de clicar em Capturar.
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setQuickCaptureFallbackOpen(false)}
                                  className="px-3 py-1.5 rounded-lg border border-amber-200 text-amber-800 hover:bg-amber-100/50 font-medium"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => createQuickFinding(q, fallbackQuoteText)}
                                  disabled={!fallbackQuoteText.trim()}
                                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs disabled:opacity-50"
                                >
                                  Confirmar Captura
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Evidências Capturadas nesta Pergunta (Seção 9) */}
                        {(() => {
                          const linkedFindings = achados.filter(f => activeInterview.achadosGeradosIds.includes(f.id));
                          const questionFindings = linkedFindings.filter(f => f.categoria === q.categoria || (f.entrevistaId === activeInterview.id && f.fraseOriginal && q.respostaQualitativa.includes(f.fraseOriginal)));

                          if (questionFindings.length === 0) return null;

                          return (
                            <div className="pt-3 border-t border-slate-100 space-y-2">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                  <span>Evidências Capturadas nesta Pergunta ({questionFindings.length}):</span>
                                </span>
                                <span className="text-slate-400">Guardado para revisão pós-entrevista</span>
                              </div>
                              <div className="space-y-1.5">
                                {questionFindings.map(f => {
                                  const isPending = f.reviewStatus === 'pendente' || (!f.natureza && f.tags.includes('pendente-revisao'));
                                  return (
                                    <div key={f.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-2 text-xs">
                                      <div className="space-y-0.5">
                                        <p className="italic text-slate-800 font-serif">"{f.fraseOriginal}"</p>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                          <span className="font-mono">{f.id}</span>
                                          <span>•</span>
                                          <span>{f.categoria}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                          isPending ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                        }`}>
                                          {isPending ? 'Pendente' : `Vinculado: ${f.dorConsolidadaId || 'Isolado'}`}
                                        </span>
                                        {isPending && (
                                          <button
                                            type="button"
                                            onClick={() => openPendingReview(f.id)}
                                            className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[10px] transition-colors cursor-pointer"
                                          >
                                            Revisar
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Finding Creation Sub-Form (PRD Seção 25 e 26) */}
                        {isExtracting && (
                          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3 mt-2">
                            <div className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-emerald-600" />
                              Extração de Achado com Preservação da Fala Original (PRD Seção 26)
                            </div>

                            <div>
                              <label className="font-semibold text-slate-700 block text-[11px] mb-1">
                                1. Fala Original Preservada (Evidência Observada):
                              </label>
                              <textarea
                                rows={2}
                                value={findingOriginalQuote}
                                onChange={(e) => setFindingOriginalQuote(e.target.value)}
                                placeholder='Ex: "Todo mês uma pessoa praticamente fica dois dias só cobrando os clientes."'
                                className="w-full p-2 bg-white rounded-lg border border-emerald-300 text-xs italic text-slate-800"
                              />
                            </div>

                            <div>
                              <label className="font-semibold text-slate-700 block text-[11px] mb-1">
                                2. Interpretação Analítica do Pesquisador:
                              </label>
                              <input
                                type="text"
                                value={findingInterpretation}
                                onChange={(e) => setFindingInterpretation(e.target.value)}
                                placeholder="Ex: Cobrança documental possui custo operacional e financeiro relevante."
                                className="w-full p-2 bg-white rounded-lg border border-emerald-300 text-xs text-slate-800"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <label className="font-semibold text-slate-700 block text-[11px] mb-1">
                                  Natureza da Evidência:
                                </label>
                                <select
                                  value={findingNature}
                                  onChange={(e) => setFindingNature(e.target.value as any)}
                                  className="w-full p-1.5 bg-white rounded-lg border border-slate-300 text-xs"
                                >
                                  <option value="favoravel">Favorável à dor</option>
                                  <option value="contraria">Contrária à dor (evidência contrária)</option>
                                  <option value="neutra">Neutra</option>
                                </select>
                              </div>

                              <div>
                                <label className="font-semibold text-slate-700 block text-[11px] mb-1">
                                  Associar à Dor Consolidada:
                                </label>
                                <select
                                  value={findingSelectedPainId}
                                  onChange={(e) => setFindingSelectedPainId(e.target.value)}
                                  className="w-full p-1.5 bg-white rounded-lg border border-slate-300 text-xs"
                                >
                                  {doresConsolidadas.map(d => (
                                    <option key={d.id} value={d.id}>{d.id} — {d.titulo.slice(0, 30)}...</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => setExtractingForQuestionId(null)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-white"
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveFinding(q)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                              >
                                Salvar Achado
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Navigation Bar for Active Question (Etapa 4B.2) */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-4">
                          <button
                            type="button"
                            onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={safeActiveIndex === 0}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                              safeActiveIndex === 0
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 shadow-2xs active:scale-98'
                            }`}
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Pergunta anterior</span>
                          </button>

                          <div className="text-xs font-bold text-slate-600 hidden sm:block">
                            Pergunta {safeActiveIndex + 1} de {totalQuestions}
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                            disabled={safeActiveIndex === totalQuestions - 1}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                              safeActiveIndex === totalQuestions - 1
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs active:scale-98'
                            }`}
                          >
                            <span>{safeActiveIndex === totalQuestions - 1 ? 'Fim do Roteiro' : 'Próxima pergunta'}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })()}
          </div>

          {/* Right Col: Summary of Interview and Linked Findings */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <h3 className="text-sm font-bold text-slate-900">Resumo da Conversa</h3>
              
              <div className="space-y-2 text-slate-600">
                <div>
                  <strong>Tipo de Entrevista:</strong> {activeInterview.tipo}
                </div>
                <div>
                  <strong>Data:</strong> {activeInterview.data}
                </div>
                <div>
                  <strong>Duração estimada:</strong> {activeInterview.duracaoMinutos} minutos
                </div>
                <div>
                  <strong>Perguntas no roteiro:</strong> {activeInterview.perguntas.length}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700 block mb-1">Notas Gerais do Entrevistador:</span>
                <textarea
                  rows={4}
                  value={activeInterview.notasGerais}
                  onChange={(e) => {
                    const updated = { ...activeInterview, notasGerais: e.target.value };
                    setActiveInterview(updated);
                    saveInterview(updated);
                  }}
                  className="w-full p-2 border border-slate-200 rounded text-xs leading-relaxed"
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Achados & Evidências</span>
                  <span className="text-[11px] font-mono font-normal text-slate-500">({activeInterview.achadosGeradosIds.length})</span>
                </h3>
                <div className="flex items-center gap-1 text-[10px] flex-wrap justify-end">
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {reviewedFindings.length} rev.
                  </span>
                  {pendingFindings.length > 0 && (
                    <span className="font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {pendingFindings.length} pend.
                    </span>
                  )}
                  {discardedFindings.length > 0 && (
                    <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {discardedFindings.length} desc.
                    </span>
                  )}
                </div>
              </div>

              {pendingFindings.length > 0 && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold">
                    <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600 shrink-0" />
                    <span>{pendingFindings.length} captura(s) aguardando revisão pós-entrevista</span>
                  </div>
                  <p className="text-[10px] text-amber-800 leading-tight">
                    As capturas rápidas precisam ser interpretadas e classificadas para integrar a matriz formal do Radar.
                  </p>
                  <button
                    type="button"
                    onClick={() => openPendingReview()}
                    className="w-full py-1.5 px-3 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Revisar Capturas Pendentes ({pendingFindings.length})</span>
                  </button>
                </div>
              )}

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {activeInterviewFindings.map(f => {
                  const isPending = f.reviewStatus === 'pendente' || (!f.reviewStatus && f.tags.includes('pendente-revisao'));
                  const isDiscarded = f.reviewStatus === 'descartado';

                  return (
                    <div key={f.id} className={`p-2.5 rounded-lg border text-[11px] space-y-1 ${
                      isDiscarded ? 'border-slate-200 bg-slate-100/70 opacity-80' : 'border-slate-200 bg-slate-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-700">{f.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isDiscarded
                            ? 'bg-slate-200 text-slate-700 border border-slate-300'
                            : isPending
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {isDiscarded ? 'Descartado' : isPending ? 'Pendente' : f.natureza ? f.natureza.toUpperCase() : 'Revisado'}
                        </span>
                      </div>
                      <p className="text-slate-700 italic font-serif text-[11px]">"{f.fraseOriginal}"</p>
                      {f.fraseRevisada && (
                        <p className="text-emerald-800 text-[10px] italic bg-emerald-50/50 p-1 rounded border border-emerald-100">
                          <strong>Versão revisada:</strong> "{f.fraseRevisada}"
                        </p>
                      )}
                      {f.interpretacao && !isPending && !isDiscarded && (
                        <p className="text-slate-600 text-[10px] bg-white p-1.5 rounded border border-slate-100">
                          <strong>Análise:</strong> {f.interpretacao}
                        </p>
                      )}
                      {isDiscarded && (
                        <p className="text-slate-600 text-[10px] bg-slate-200/60 p-1.5 rounded border border-slate-200">
                          <strong>Motivo do Descarte:</strong> {f.motivoDescarte || 'Descartado na revisão'}
                        </p>
                      )}
                      {isPending && (
                        <button
                          type="button"
                          onClick={() => openPendingReview(f.id)}
                          className="w-full mt-1 py-1 px-2 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] transition-colors cursor-pointer text-center"
                        >
                          Revisar esta captura
                        </button>
                      )}
                    </div>
                  );
                })}
                {activeInterviewFindings.length === 0 && (
                  <p className="text-slate-400 italic text-center py-2">
                    Nenhuma evidência capturada ainda nesta sessão.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs space-y-3">
          <MessageSquareText className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="text-sm font-bold text-slate-800">Nenhuma entrevista selecionada</div>
          <p className="text-slate-500 max-w-sm mx-auto">
            Selecione uma entrevista existente acima ou inicie uma nova com um dos profissionais das organizações pesquisadas.
          </p>
        </div>
      )}

      {/* Modal 1: Pergunta Emergente & Promoção (PRD Seção 23 e 50) */}
      {showEmergentQuestionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 space-y-4 text-xs border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                Nova Pergunta Emergente & Promoção (PRD Seção 23 & 50)
              </h3>
              <button onClick={() => setShowEmergentQuestionModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <p className="text-slate-600">
              Durante a entrevista surgiu uma nova linha de investigação? Registre a pergunta e decida seu alcance.
            </p>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Texto da Pergunta:</label>
              <textarea
                rows={2}
                value={emergentText}
                onChange={(e) => setEmergentText(e.target.value)}
                placeholder="Ex: Como vocês monitoram caixas postais fiscais e notificações do DTE?"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Categoria / Área:</label>
              <input
                type="text"
                value={emergentCategory}
                onChange={(e) => setEmergentCategory(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Destino da Pergunta (Promoção):</label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="promote"
                    checked={promoteTo === 'interview'}
                    onChange={() => setPromoteTo('interview')}
                  />
                  <span>Manter somente nesta entrevista (Escopo: Entrevista)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="promote"
                    checked={promoteTo === 'organizacao'}
                    onChange={() => setPromoteTo('organizacao')}
                  />
                  <span><strong>Promover para a Organização</strong> (Escopo: {currentOrg?.nome || 'Organização atual'})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="promote"
                    checked={promoteTo === 'subvertical'}
                    onChange={() => setPromoteTo('subvertical')}
                  />
                  <span><strong>Promover para a Subvertical</strong> (Escopo: {currentOrg?.subvertical || 'Subvertical'})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="promote"
                    checked={promoteTo === 'vertical'}
                    onChange={() => setPromoteTo('vertical')}
                  />
                  <span><strong>Promover para a Vertical</strong> (aparecerá nas próximas entrevistas da vertical)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="promote"
                    checked={promoteTo === 'global'}
                    onChange={() => setPromoteTo('global')}
                  />
                  <span><strong>Promover para Biblioteca Global</strong> (aplicável cross-vertical)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowEmergentQuestionModal(false)}
                className="px-3 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddEmergentQuestion}
                className="px-4 py-1.5 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Adicionar Pergunta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Finalização da Entrevista & Revisão de Achados (PRD Seção 60) */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 space-y-4 text-xs border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Revisar e Finalizar Entrevista (PRD Seção 60)
              </h3>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <p className="text-slate-600">
              Ao clicar em finalizar, o status da entrevista mudará formalmente para <strong>Concluída</strong>. Os achados associados alimentam a cadeia de evidências e o cálculo de maturidade da organização.
            </p>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="font-bold text-slate-800">Achados e Evidências vinculadas ({activeInterview.achadosGeradosIds.length}):</div>
              {activeInterview.achadosGeradosIds.length > 0 ? (
                <div className="space-y-1.5">
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    {activeInterview.achadosGeradosIds.map(id => {
                      const fObj = achados.find(a => a.id === id);
                      const isPending = fObj && (!fObj.dorConsolidadaId || fObj.tags.includes('pendente-revisao'));
                      return (
                        <li key={id} className="font-mono text-[11px] flex items-center justify-between">
                          <span>{id} {fObj ? `— "${fObj.fraseOriginal.slice(0, 30)}..."` : ''}</span>
                          {isPending && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-sans font-semibold">
                              Aguardando revisão
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {(() => {
                    const pendingCount = activeInterview.achadosGeradosIds.filter(id => {
                      const fObj = achados.find(a => a.id === id);
                      return fObj && (!fObj.dorConsolidadaId || fObj.tags.includes('pendente-revisao'));
                    }).length;
                    if (pendingCount > 0) {
                      return (
                        <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] space-y-2">
                          <div className="flex items-center gap-1.5 font-bold">
                            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600 shrink-0" />
                            <span>{pendingCount} captura(s) aguardando revisão analítica pós-entrevista.</span>
                          </div>
                          <p className="text-[10px] text-amber-800">
                            Você pode revisar agora ou marcar a entrevista como concluída e revisar mais tarde.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setShowReviewModal(false);
                              openPendingReview(0);
                            }}
                            className="w-full py-1.5 px-3 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>Revisar Capturas Pendentes Agora ({pendingCount})</span>
                          </button>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              ) : (
                <p className="text-slate-400 italic">Nenhum achado ou evidência capturada nesta sessão.</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-3 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleFinalizeInterview}
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Marcar como Concluída</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Painel de Revisão Analítica Pós-Entrevista (Etapa 4B.4) */}
      {showPendingReviewModal && (() => {
        const currentPendingFinding = pendingFindings[reviewIndex];
        if (!currentPendingFinding) return null;

        const matchingQuestion = activeInterview?.perguntas.find(q => 
          q.categoria === currentPendingFinding.categoria || 
          (q.respostaQualitativa && currentPendingFinding.fraseOriginal && q.respostaQualitativa.includes(currentPendingFinding.fraseOriginal))
        );

        const canSave = reviewInterpretacao.trim().length > 0 && reviewNatureza !== undefined;

        return (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header do Modal */}
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <h3 className="font-bold text-sm text-white">Revisão Analítica Pós-Entrevista</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    {currentPerson?.nome} ({currentOrg?.nome}) — ID: <span className="font-mono text-amber-300">{currentPendingFinding.id}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Navegação entre Capturas Pendentes */}
                  <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => loadReviewTarget(reviewIndex - 1)}
                      disabled={reviewIndex === 0}
                      className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                      title="Captura anterior"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 font-mono text-[11px] font-semibold text-amber-300">
                      {reviewIndex + 1} de {pendingFindings.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => loadReviewTarget(reviewIndex + 1)}
                      disabled={reviewIndex === pendingFindings.length - 1}
                      className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                      title="Próxima captura"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPendingReviewModal(false)}
                    className="text-slate-400 hover:text-white text-lg font-bold px-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Corpo do Modal (Scrollable) */}
              <div className="p-6 space-y-5 overflow-y-auto text-xs">
                {/* Visualização de Origem e Contexto */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span className="flex items-center gap-1 text-slate-700">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>Pergunta de Origem no Roteiro:</span>
                    </span>
                    <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                      {currentPendingFinding.categoria}
                    </span>
                  </div>
                  <p className="font-medium text-slate-900 text-xs pl-4 border-l-2 border-blue-500">
                    {matchingQuestion ? matchingQuestion.texto : 'Pergunta formulada em campo'}
                  </p>

                  {matchingQuestion?.respostaQualitativa && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Contexto do Relato do Entrevistado:
                      </span>
                      <p className="text-slate-600 italic text-[11px] line-clamp-3 bg-white p-2 rounded border border-slate-100">
                        "{matchingQuestion.respostaQualitativa}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Form 1: Fala Original Preservada (Imutável) */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Quote className="w-3.5 h-3.5 text-amber-600" />
                      <span>1. Fala Original Capturada (Citação Direta em Campo)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                      🔒 Imutável para Auditoria
                    </span>
                  </label>
                  <div className="w-full p-3 rounded-xl border border-slate-200 font-serif italic text-slate-800 bg-slate-50 text-xs leading-relaxed select-text">
                    "{currentPendingFinding.fraseOriginal}"
                  </div>
                </div>

                {/* Form 1B: Versão Revisada (Opcional - Correção de Digitação/Transcrição) */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-600" />
                      <span>1B. Versão Revisada (Correção de Transcrição/Grafia — Opcional)</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Preencha apenas se houver erro de digitação</span>
                  </label>
                  <textarea
                    rows={2}
                    value={reviewFraseRevisada}
                    onChange={(e) => setReviewFraseRevisada(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-serif italic text-slate-900 bg-amber-50/10 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs"
                    placeholder="Se necessário, digite aqui a versão corrigida da fala sem alterar a fala original acima..."
                  />
                </div>

                {/* Form 2: Interpretação Analítica (Obrigatório) */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>2. Interpretação Analítica *</span>
                    </span>
                    <span className="text-[10px] font-semibold text-rose-600">Obrigatória para confirmar</span>
                  </label>
                  <textarea
                    rows={3}
                    value={reviewInterpretacao}
                    onChange={(e) => setReviewInterpretacao(e.target.value)}
                    placeholder="Ex: A obrigatoriedade de conferência manual de guias gera redundância operacional e risco de multa fiscal."
                    className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                  {!reviewInterpretacao.trim() && (
                    <p className="text-[10px] text-rose-600 font-medium">
                      ⚠️ Forneça uma interpretação analítica antes de salvar o achado revisado.
                    </p>
                  )}
                </div>

                {/* Form 3: Natureza da Evidência (Escolha Consciente - Sem Default) */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <label className="font-bold text-slate-800 block">
                    3. Natureza da Evidência (Classificação Consciente) *
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Selecione conscientemente a natureza da evidência com base na análise do relato:
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setReviewNatureza('favoravel')}
                      className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        reviewNatureza === 'favoravel'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/30'
                      }`}
                    >
                      <span className="text-sm">👍 Favorável</span>
                      <span className="text-[10px] text-slate-500 font-normal">Valida ou confirma a tese/hipótese</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReviewNatureza('contraria')}
                      className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        reviewNatureza === 'contraria'
                          ? 'bg-rose-50 border-rose-600 text-rose-900 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:bg-rose-50/30'
                      }`}
                    >
                      <span className="text-sm">👎 Contrária</span>
                      <span className="text-[10px] text-slate-500 font-normal">Refuta ou desacredita a tese</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReviewNatureza('neutra')}
                      className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        reviewNatureza === 'neutra'
                          ? 'bg-slate-100 border-slate-600 text-slate-900 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm">⚖️ Neutra</span>
                      <span className="text-[10px] text-slate-500 font-normal">Evidência contextual, sem viés direto</span>
                    </button>
                  </div>
                  {reviewNatureza === undefined && (
                    <p className="text-[10px] text-amber-700 font-medium bg-amber-50 p-2 rounded border border-amber-200">
                      ⚠️ Nenhuma natureza selecionada. Por regra metodológica, você deve escolher explicitamente entre Favorável, Contrária ou Neutra.
                    </p>
                  )}
                </div>

                {/* Form 4: Associar à Dor Consolidada (Opcional) */}
                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  <label className="font-bold text-slate-800 block">
                    4. Associação com Dor Consolidada (Opcional)
                  </label>
                  <select
                    value={reviewDorId}
                    onChange={(e) => setReviewDorId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Sem associação — Manter como Finding isolado revisado</option>
                    {doresConsolidadas.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.id} — {d.titulo}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500">
                    Se você ainda não tiver certeza a qual dor consolidada associar esta evidência, pode manter sem associação. O achado será promovido a <strong>Revisado</strong> sem criar ocorrência prematura.
                  </p>
                </div>
              </div>

              {/* Footer do Modal */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-3 shrink-0">
                {showDiscardConfirm && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs text-rose-950 animate-fadeIn">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-rose-900">
                        <Trash2 className="w-4 h-4 text-rose-600" />
                        <span>Motivo do Descarte Metodológico (Preservação de Histórico)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowDiscardConfirm(false)}
                        className="text-slate-400 hover:text-slate-700 font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={reviewMotivoChoice}
                        onChange={(e: any) => setReviewMotivoChoice(e.target.value)}
                        className="p-2 rounded-lg border border-rose-300 bg-white text-slate-800 text-xs font-medium"
                      >
                        <option value="duplicada">Captura duplicada</option>
                        <option value="fora_de_contexto">Relato fora do escopo / contexto</option>
                        <option value="nao_representa_evidencia">Opinião vaga sem fato/evidência</option>
                        <option value="erro_de_captura">Erro de registro na entrevista</option>
                        <option value="outro">Outro motivo específico</option>
                      </select>
                      {reviewMotivoChoice === 'outro' && (
                        <input
                          type="text"
                          value={reviewMotivoOutro}
                          onChange={(e) => setReviewMotivoOutro(e.target.value)}
                          placeholder="Descreva o motivo do descarte..."
                          className="p-2 rounded-lg border border-rose-300 bg-white text-slate-800 text-xs"
                        />
                      )}
                    </div>
                    <p className="text-[10px] text-rose-800 italic">
                      A captura será marcada como <strong>descartada</strong>. Ela permanecerá visível no histórico da entrevista para auditoria, mas será excluída de todos os cálculos e composições formais de evidência.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    {!showDiscardConfirm ? (
                      <button
                        type="button"
                        onClick={() => setShowDiscardConfirm(true)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Descartar Captura</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleDiscardReview}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmar Descarte (Preservar no Histórico)</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPendingReviewModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Fechar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveReview}
                      disabled={!canSave}
                      className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                        canSave
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirmar & Promover a Finding Revisado</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
