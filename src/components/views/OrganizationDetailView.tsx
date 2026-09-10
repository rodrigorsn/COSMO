import React, { useState } from 'react';
import { useRadar } from '../../context/RadarContext';
import { calculateOrgMaturity, calculatePainScore, isPainScoreMeasured } from '../../utils/calculations';
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
  Plus
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
  onNewInterviewClick?: () => void;
  onNewFindingClick?: () => void;
}> = ({ onNewInterviewClick, onNewFindingClick }) => {
  const { 
    organizacoes, 
    selectedOrgId, 
    setActiveView, 
    entrevistas, 
    achados, 
    ocorrenciasDores, 
    doresConsolidadas,
    setActiveInterviewToConduct,
    updatePainScore
  } = useRadar();

  const [activeTab, setActiveTab] = useState<OrgTab>('resumo');
  const [editingPainId, setEditingPainId] = useState<string | null>(null);

  const org = organizacoes.find(o => o.id === selectedOrgId) || organizacoes[0];
  const orgInterviews = entrevistas.filter(e => e.organizacaoId === org.id);
  const orgFindings = achados.filter(f => f.organizacaoId === org.id);
  const orgPainOccurrences = ocorrenciasDores.filter(o => o.organizacaoId === org.id);

  const maturity = calculateOrgMaturity(org, orgInterviews.length, orgFindings.length, orgPainOccurrences.length);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Segregation Note (PRD Seção 9 e 57) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('organizacoes')}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Voltar para a lista de organizações"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {org.nome}
                </h1>
                <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                  {org.id}
                </span>
                <SimulacaoTag compact />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {org.numFuncionarios} funcionários • <strong className="text-slate-800">{org.numClientes} clientes PMEs</strong> • {org.cidade}/{org.estado} • {org.subvertical}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNewInterviewClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Conduzir Nova Entrevista</span>
            </button>
          </div>
        </div>

        {/* Maturity Progress (PRD Seção 11) */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Maturidade da Pesquisa na Organização:</span>
              <span className="font-bold text-blue-700 font-mono">{maturity.scorePercent}% estruturada</span>
            </div>
            <span className="text-[11px] text-slate-400">Progresso operacional (PRD Seção 11)</span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${maturity.scorePercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-[11px] text-slate-600">
            <div><strong>Perfil:</strong> {maturity.perfil}</div>
            <div><strong>Stack:</strong> {maturity.stack}</div>
            <div><strong>Entrevistas:</strong> {maturity.interviewsText}</div>
            <div><strong>Processos:</strong> {maturity.processesText}</div>
            <div><strong>Dores:</strong> {maturity.painsText}</div>
            <div><strong>Evidências:</strong> {maturity.findingsText}</div>
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
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-400 text-xs block">Clientes PMEs</span>
              <span className="font-bold text-slate-900 text-xl mt-1 block font-mono">{org.numClientes}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-400 text-xs block">Funcionários</span>
              <span className="font-bold text-slate-900 text-xl mt-1 block font-mono">{org.numFuncionarios}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-400 text-xs block">Entrevistados</span>
              <span className="font-bold text-slate-900 text-xl mt-1 block font-mono">{org.entrevistados.length}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-400 text-xs block">Entrevistas</span>
              <span className="font-bold text-slate-900 text-xl mt-1 block font-mono">{orgInterviews.length}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-400 text-xs block">Processos</span>
              <span className="font-bold text-slate-900 text-xl mt-1 block font-mono">{org.processos.length}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-400 text-xs block">Dores Ativas</span>
              <span className="font-bold text-orange-700 text-xl mt-1 block font-mono">{orgPainOccurrences.length}</span>
            </div>
          </div>

          {/* Seção: Principais Sinais (PRD Seção 58) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-600" />
              Principais Sinais Operacionais Detectados
            </h3>
            <p className="text-xs text-slate-500">
              Dores com Pain Score apurado nesta organização específica (PRD Seção 28 e 29).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {orgPainOccurrences.map(occ => {
                const painObj = doresConsolidadas.find(d => d.id === occ.dorConsolidadaId);
                const measured = isPainScoreMeasured(occ);
                const score = measured ? occ.painScore!.total : null;
                const occFindings = achados.filter(f => occ.achadosIds.includes(f.id));
                const favCount = occFindings.filter(f => f.natureza === 'favoravel').length;
                const conCount = occFindings.filter(f => f.natureza === 'contraria').length;
                const neuCount = occFindings.filter(f => f.natureza === 'neutra').length;

                return (
                  <div key={occ.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900">{painObj?.titulo || occ.dorConsolidadaId}</span>
                      {measured ? (
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                          score! >= 20 ? 'bg-orange-100 text-orange-900 border border-orange-200' : 'bg-slate-200 text-slate-800'
                        }`}>
                          Pain: {score}/25
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          Não mensurado
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {occ.notasEspecificas}
                    </p>

                    {/* Composição das evidências dos Achados desta ocorrência */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                      <span className="text-slate-400 font-medium">Evidências:</span>
                      <EvidenceCompositionBadge favCount={favCount} conCount={conCount} neuCount={neuCount} />
                    </div>

                    {measured ? (
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                        <span>Freq: {occ.painScore!.frequencia}/5</span>
                        <span>•</span>
                        <span>Tempo: {occ.painScore!.tempoCusto}/5</span>
                        <span>•</span>
                        <span>Severidade: {occ.painScore!.severidade}/5</span>
                        <span>•</span>
                        <span>Manual: {occ.painScore!.manualidade}/5</span>
                        <span>•</span>
                        <span>Repet: {occ.painScore!.repetibilidade}/5</span>
                      </div>
                    ) : (
                      <div className="pt-1 text-[11px] text-slate-400 italic">
                        Dimensões de dor ainda não mensuradas nesta organização.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. PERFIL DA ORGANIZAÇÃO (PRD Seção 10) */}
      {activeTab === 'perfil' && (
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
                    <button
                      onClick={() => {
                        const existing = personInterviews[0];
                        if (existing) {
                          setActiveInterviewToConduct(existing);
                          setActiveView('entrevistas');
                        } else {
                          onNewInterviewClick?.();
                        }
                      }}
                      className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
                    >
                      Acessar Roteiro <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. ENTREVISTAS (PRD Seção 16) */}
      {activeTab === 'entrevistas' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Histórico de Entrevistas Realizadas</h3>
            <button
              onClick={onNewInterviewClick}
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              + Nova Entrevista
            </button>
          </div>

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

                  <button
                    onClick={() => {
                      setActiveInterviewToConduct(ent);
                      setActiveView('entrevistas');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-xs font-semibold text-slate-700 transition-colors shrink-0"
                  >
                    Abrir Roteiro & Respostas
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. PROCESSOS MAPEADOS & FLUXO VISUAL (PRD Seção 13 e 14) */}
      {activeTab === 'processos' && (
        <div className="space-y-4">
          {org.processos.map(proc => (
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
          ))}
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
            <button
              onClick={onNewFindingClick}
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Novo Achado</span>
            </button>
          </div>

          <div className="space-y-3">
            {orgFindings.map(ach => (
              <div key={ach.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">{ach.id}</span>
                    <span className="font-bold text-slate-900 text-sm">{ach.titulo}</span>
                  </div>
                  <EvidenceNatureBadge nature={ach.natureza} />
                </div>

                {/* Fala Original (PRD Seção 26) */}
                <div className="p-3 rounded-md bg-white border border-slate-200 text-slate-800 italic flex items-start gap-2">
                  <Quote className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 not-italic uppercase tracking-wider block">
                      Fala Original Preservada (Evidência Observada):
                    </span>
                    <span>"{ach.fraseOriginal}"</span>
                  </div>
                </div>

                {/* Interpretação */}
                <div className="text-slate-600 text-[11px]">
                  <strong className="text-slate-700">Interpretação do Pesquisador:</strong> {ach.interpretacao}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                  <span>Origem: {ach.origem}</span>
                  <span>•</span>
                  <span>Categoria: {ach.categoria}</span>
                  <span>•</span>
                  <span>Data: {ach.dataRegistro}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. OCORRÊNCIAS DE DORES & PAIN SCORE (PRD Seção 28 e 29) */}
      {activeTab === 'dores' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Ocorrências de Dores & Pain Score (0–25)</h3>
            <p className="text-xs text-slate-500">
              O Pain Score é calculado por ocorrência nesta organização nas 5 dimensões: Frequência, Tempo/Custo, Severidade, Manualidade e Repetibilidade (PRD Seção 29).
            </p>
          </div>

          <div className="space-y-4">
            {orgPainOccurrences.map(occ => {
              const painObj = doresConsolidadas.find(d => d.id === occ.dorConsolidadaId);
              const isEditing = editingPainId === occ.id;
              const measured = isPainScoreMeasured(occ);
              const score = measured ? occ.painScore!.total : null;
              const occFindings = achados.filter(f => occ.achadosIds.includes(f.id));
              const favCount = occFindings.filter(f => f.natureza === 'favoravel').length;
              const conCount = occFindings.filter(f => f.natureza === 'contraria').length;
              const neuCount = occFindings.filter(f => f.natureza === 'neutra').length;

              return (
                <div key={occ.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs text-slate-400">{occ.id} • {occ.dorConsolidadaId}</span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{painObj?.titulo}</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-slate-400 text-[11px] block">Pain Score</span>
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
                        className="px-2.5 py-1 rounded text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs"
                      >
                        {isEditing ? 'Fechar Edição' : (measured ? 'Ajustar Dimensões' : 'Avaliar Dimensões')}
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-600">{occ.notasEspecificas}</p>

                  {/* Composição das evidências */}
                  <div className="flex items-center gap-2 flex-wrap p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-semibold text-[11px]">Composição de Evidências:</span>
                    <EvidenceCompositionBadge favCount={favCount} conCount={conCount} neuCount={neuCount} />
                    <span className="text-slate-400 text-[11px]">
                      ({occFindings.length} achado{occFindings.length !== 1 ? 's' : ''} associado{occFindings.length !== 1 ? 's' : ''})
                    </span>
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

                  {/* Interactive Dimension Sliders (when editing) */}
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
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
