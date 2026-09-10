import React, { useState } from 'react';
import { useRadar } from '../../context/RadarContext';
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
  Layers
} from 'lucide-react';
import { Interview, InterviewQuestionInstance } from '../../types/radar';

export const InterviewsView: React.FC<{ onNewInterviewClick?: () => void }> = ({ onNewInterviewClick }) => {
  const { 
    entrevistas, 
    organizacoes, 
    activeInterviewToConduct, 
    setActiveInterviewToConduct,
    saveInterview,
    addFinding,
    doresConsolidadas,
    promoteQuestion
  } = useRadar();

  const [activeInterview, setActiveInterview] = useState<Interview | null>(() => {
    return activeInterviewToConduct || entrevistas[0] || null;
  });

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
          subverticalId: currentOrg?.subvertical,
          previousScope: 'Entrevista',
          originNote: `Entrevista ${activeInterview.id} (${currentOrg?.nome})`
        }
      );
    }

    setEmergentText('');
    setShowEmergentQuestionModal(false);
  };

  const handleSaveFinding = (q: InterviewQuestionInstance) => {
    if (!activeInterview || !findingOriginalQuote.trim()) return;

    const newFinding = addFinding({
      titulo: `Achado em ${currentOrg?.nome?.slice(0, 20)}: ${findingInterpretation.slice(0, 35)}...`,
      descricao: findingInterpretation,
      origem: 'Entrevista',
      tipoEvidencia: 'evidencia_observada',
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
              const selected = entrevistas.find(ent => ent.id === e.target.value);
              if (selected) setActiveInterview(selected);
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
                <div className="flex items-center gap-2">
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
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-1">
                  {currentPerson?.nome} — {currentPerson?.cargo} ({currentPerson?.perfil})
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  Organização: <strong>{currentOrg?.nome}</strong> ({currentOrg?.numClientes} clientes PMEs)
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEmergentQuestionModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Pergunta Emergente</span>
                </button>

                <button
                  onClick={() => setShowReviewModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Finalizar & Revisar</span>
                </button>
              </div>
            </div>

            {/* Questions List (PRD Seção 59) */}
            <div className="space-y-4">
              {activeInterview.perguntas.map((q, idx) => {
                const isFollowUpOpen = !!expandedFollowUps[q.id];
                const isExtracting = extractingForQuestionId === q.id;

                return (
                  <div key={q.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 text-sm leading-snug">
                            {q.texto}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>Categoria: {q.categoria}</span>
                            <span>•</span>
                            <span className="uppercase font-mono">Escopo: {q.escopo}</span>
                            {q.isEmergente && (
                              <span className="text-purple-700 font-bold bg-purple-100 px-1.5 rounded">
                                Emergente
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFollowUp(q.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 shrink-0"
                        title="Abre perguntas de aprofundamento (Follow-ups - PRD Seção 22)"
                      >
                        <span>Aprofundar ({q.followUps.length})</span>
                        {isFollowUpOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    {/* Follow-ups Panel (PRD Seção 22) */}
                    {isFollowUpOpen && (
                      <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 space-y-2 text-xs">
                        <div className="font-bold text-blue-900 text-[11px] uppercase tracking-wider">
                          Follow-ups Sugeridos para Aprofundamento:
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-slate-700">
                          {q.followUps.map((fText, fIdx) => (
                            <li key={fIdx} className="text-xs">
                              <span className="font-medium text-slate-900">{fText}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Qualitative Response Input (PRD Seção 24) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-600 block text-[11px]">
                        Resposta Qualitativa do Entrevistado:
                      </label>
                      <textarea
                        rows={3}
                        value={q.respostaQualitativa}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder="Digite aqui o que o entrevistado relatou..."
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-800 text-xs leading-relaxed"
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

                    {/* Action Bar for this question: Marcar Achado */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                      <button
                        onClick={() => {
                          setExtractingForQuestionId(isExtracting ? null : q.id);
                          setFindingOriginalQuote(q.respostaQualitativa);
                        }}
                        className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Quote className="w-3.5 h-3.5" />
                        <span>{isExtracting ? 'Cancelar Extração' : 'Marcar / Extrair Achado desta Resposta'}</span>
                      </button>
                    </div>

                    {/* Finding Creation Sub-Form (PRD Seção 25 e 26) */}
                    {isExtracting && (
                      <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-3 mt-2">
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
                            className="w-full p-2 bg-white rounded border border-emerald-300 text-xs italic text-slate-800"
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
                            className="w-full p-2 bg-white rounded border border-emerald-300 text-xs text-slate-800"
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
                              className="w-full p-1.5 bg-white rounded border border-slate-300 text-xs"
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
                              className="w-full p-1.5 bg-white rounded border border-slate-300 text-xs"
                            >
                              {doresConsolidadas.map(d => (
                                <option key={d.id} value={d.id}>{d.id} — {d.titulo.slice(0, 30)}...</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setExtractingForQuestionId(null)}
                            className="px-3 py-1.5 rounded border border-slate-200 text-xs text-slate-600 hover:bg-white"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleSaveFinding(q)}
                            className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                          >
                            Salvar Achado
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Achados Vinculados</span>
                <span className="font-mono text-slate-400">{activeInterview.achadosGeradosIds.length}</span>
              </h3>
              
              <div className="space-y-2">
                {activeInterview.achadosGeradosIds.map(achId => (
                  <div key={achId} className="p-2.5 rounded border border-slate-200 bg-slate-50 text-[11px]">
                    <span className="font-mono font-bold text-slate-700">{achId}</span>
                    <p className="text-slate-600 mt-0.5 italic">
                      Vinculado a esta sessão de entrevista.
                    </p>
                  </div>
                ))}
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
              <div className="font-bold text-slate-800">Achados vinculados a esta sessão ({activeInterview.achadosGeradosIds.length}):</div>
              {activeInterview.achadosGeradosIds.length > 0 ? (
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {activeInterview.achadosGeradosIds.map(id => (
                    <li key={id} className="font-mono">{id}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 italic">Nenhum achado marcado ainda nesta sessão.</p>
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
    </div>
  );
};
