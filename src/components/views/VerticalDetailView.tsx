import React, { useState } from 'react';
import { useRadar } from '../../context/RadarContext';
import { VerticalStatusBadge, EvidenceLevelBadge, EvidenceNatureBadge } from '../common/Badge';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { 
  Building2, 
  Users, 
  MessageSquareText, 
  Flame, 
  Sparkles, 
  ArrowLeft, 
  Database, 
  GitFork, 
  ExternalLink,
  BookOpen,
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

type VerticalTab = 
  | 'visao-geral' 
  | 'mercado' 
  | 'ecossistema' 
  | 'organizacoes' 
  | 'concorrentes' 
  | 'dores' 
  | 'oportunidades' 
  | 'perguntas';

export const VerticalDetailView: React.FC = () => {
  const { 
    verticais, 
    selectedVerticalId, 
    setActiveView, 
    setSelectedOrgId,
    setSelectedPainId,
    setSelectedOpportunityId,
    organizacoes, 
    entrevistas, 
    doresConsolidadas, 
    oportunidades, 
    fontes, 
    concorrentes,
    perguntasBiblioteca
  } = useRadar();

  const [activeTab, setActiveTab] = useState<VerticalTab>('visao-geral');

  const vertical = verticais.find(v => v.id === selectedVerticalId) || verticais[0];
  const isContabilidade = vertical.id === 'VERT-CONT';

  const verticalOrgs = isContabilidade ? organizacoes : [];
  const verticalInterviews = isContabilidade ? entrevistas : [];
  const verticalPains = isContabilidade ? doresConsolidadas : [];
  const verticalOpportunities = isContabilidade ? oportunidades : [];
  const verticalSources = fontes.filter(f => f.verticalId === vertical.id);
  const verticalCompetitors = concorrentes.filter(c => c.verticalId === vertical.id);
  const verticalQuestions = perguntasBiblioteca.filter(q => q.escopo === 'global' || q.verticalId === vertical.id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header (Seção 55) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('verticais')}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Voltar para lista de verticais"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {vertical.nome}
                </h1>
                <VerticalStatusBadge status={vertical.status} />
                <SimulacaoTag compact />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ID: <span className="font-mono text-slate-700">{vertical.id}</span> • Atualizado em {vertical.ultimaAtualizacao} • Responsável: {vertical.responsavel}
              </p>
            </div>
          </div>
        </div>

        {/* Resumo da Amostra (Seção 46 do PRD) */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center text-xs">
          <div>
            <span className="text-slate-400 text-[11px] block">Organizações</span>
            <span className="font-bold text-slate-900 text-sm">{verticalOrgs.length} pesquisadas</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Entrevistados</span>
            <span className="font-bold text-slate-900 text-sm">
              {verticalOrgs.reduce((acc, o) => acc + o.entrevistados.length, 0)} mapeados
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Entrevistas</span>
            <span className="font-bold text-slate-900 text-sm">{verticalInterviews.length} realizadas</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Processos</span>
            <span className="font-bold text-slate-900 text-sm">
              {verticalOrgs.reduce((acc, o) => acc + o.processos.length, 0)} mapeados
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Achados</span>
            <span className="font-bold text-slate-900 text-sm">8 evidências</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Dores</span>
            <span className="font-bold text-slate-900 text-sm">{verticalPains.length} consolidadas</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Oportunidades</span>
            <span className="font-bold text-blue-700 text-sm">{verticalOpportunities.length} avaliadas</span>
          </div>
        </div>

        {/* Tabs Bar (Seção 55) */}
        <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto text-xs font-semibold pt-1">
          {[
            { id: 'visao-geral', label: 'Visão Geral' },
            { id: 'mercado', label: `Mercado (${verticalSources.length})` },
            { id: 'ecossistema', label: 'Ecossistema & Multiplicador B2B' },
            { id: 'organizacoes', label: `Organizações (${verticalOrgs.length})` },
            { id: 'concorrentes', label: `Concorrentes & Gap (${verticalCompetitors.length})` },
            { id: 'dores', label: `Dores (${verticalPains.length})` },
            { id: 'oportunidades', label: `Oportunidades (${verticalOpportunities.length})` },
            { id: 'perguntas', label: `Perguntas (${verticalQuestions.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as VerticalTab)}
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

      {/* TAB CONTENT */}

      {/* 1. Visão Geral */}
      {activeTab === 'visao-geral' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
                Tese Central de Investigação (Customer Operations Gap)
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {vertical.teseInicial}
              </p>
              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs text-blue-900 space-y-1">
                <span className="font-semibold block">Hipótese Operacional Verificada:</span>
                <p className="text-blue-800">
                  O ERP é o sistema legal onde a apuração é salva, mas o trabalho de solicitação, cobrança e triagem de documentos é realizado via WhatsApp, telefone e planilhas paralelas de fechamento.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
                Multiplicador B2B em Destaque (PRD Seção 33)
              </h3>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-mono font-bold text-2xl">
                  60 a 500
                </div>
                <div className="text-xs text-slate-600">
                  <strong>PMEs atendidas por cada escritório contábil:</strong>
                  <p className="text-slate-500 mt-0.5">
                    Cada potencial cliente do software (o escritório) traz consigo um volume indireto de centenas de usuários finais (empresas clientes), potencializando viralidade e valor por assinatura.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sinais Mais Fortes */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Principais Padrões Observados na Vertical (PRD Seção 47)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Gestão Documental</span>
                  <span className="font-mono text-xs font-bold text-emerald-700">67% incidência</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">2 de 3 organizações confirmam dor severa (Pain mediano: 23/25).</div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Dúvidas Repetitivas</span>
                  <span className="font-mono text-xs font-bold text-slate-700">67% incidência</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">Atendimento no WhatsApp fragmentado em celulares pessoais (Pain mediano: 18.5).</div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Admissão e DP</span>
                  <span className="font-mono text-xs font-bold text-amber-700">33% incidência</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">Identificado no Escritório 003 (120 admissões/mês com fotos ilegíveis).</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Mercado (Fontes Externas) */}
      {activeTab === 'mercado' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Fontes Secundárias e Estatísticas de Mercado (PRD Seção 65)</h3>
              <p className="text-xs text-slate-500">Dados externos com fontes institucionais verificáveis (FATO).</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {verticalSources.map(source => (
              <div key={source.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{source.titulo}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                    {source.categoria.toUpperCase()}
                  </span>
                </div>
                <div className="text-slate-600">
                  <strong>Informação Extraída:</strong> {source.informacaoExtraida}
                </div>
                <div className="text-slate-500">
                  <strong>Resumo:</strong> {source.resumo}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                  <span>Instituição: {source.instituicao}</span>
                  <span>•</span>
                  <span>Data: {source.data}</span>
                  <span>•</span>
                  <span>Confiabilidade: {source.confiabilidade}</span>
                  <span>•</span>
                  <a href={source.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                    Fonte original <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Ecossistema */}
      {activeTab === 'ecossistema' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Subverticais Identificadas (PRD Seção 8)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {vertical.subverticais.map(sub => (
                <div key={sub.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                  <div className="font-bold text-slate-900">{sub.nome}</div>
                  <p className="text-slate-600 text-[11px] mt-1">{sub.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Organizações */}
      {activeTab === 'organizacoes' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Organizações Pesquisadas nesta Vertical</h3>
              <p className="text-xs text-slate-500">Cada empresa tem ambiente e dados estritamente segregados (PRD Seção 9).</p>
            </div>
            <button
              onClick={() => setActiveView('organizacoes')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Abrir Visão Completa de Organizações →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {verticalOrgs.map(org => (
              <div key={org.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-xs text-slate-900">{org.nome}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {org.numFuncionarios} funcionários • {org.numClientes} clientes • {org.cidade}/{org.estado} • {org.subvertical}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedOrgId(org.id);
                    setActiveView('organizacao-detail');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                >
                  Abrir Detalhe
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Concorrentes */}
      {activeTab === 'concorrentes' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Mapeamento de Concorrentes & Gap Operacional (PRD Seção 66)</h3>
            <p className="text-xs text-slate-500 mb-4">
              A pergunta central do VOR: <em>"O que os usuários continuam fazendo fora desta solução?"</em>
            </p>

            <div className="space-y-4">
              {verticalCompetitors.map(comp => (
                <div key={comp.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{comp.nome}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-800">
                      {comp.modelo} • {comp.precoEstimado}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <strong>Proposta:</strong> {comp.proposta}
                  </div>
                  <div className="p-3 bg-amber-50 rounded-md border border-amber-200 text-amber-950">
                    <strong>Customer Operations Gap Observado:</strong> {comp.operationsGapObservado}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Dores */}
      {activeTab === 'dores' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Dores Consolidadas da Vertical</h3>
          <div className="space-y-3">
            {verticalPains.map(pain => (
              <div key={pain.id} className="p-3.5 rounded-lg border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-[11px] text-slate-400">{pain.id}</span>
                  <div className="font-bold text-xs text-slate-900 mt-0.5">{pain.titulo}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{pain.categoria}</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedPainId(pain.id);
                    setActiveView('dor-detail');
                  }}
                  className="px-2.5 py-1.5 rounded text-xs font-semibold text-blue-700 hover:bg-blue-50 border border-blue-200"
                >
                  Ver Estatísticas
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Oportunidades */}
      {activeTab === 'oportunidades' && (
        <div className="space-y-3">
          {verticalOpportunities.map(opp => (
            <div key={opp.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700">{opp.id}</span>
                  <EvidenceLevelBadge level={opp.evidenceLevel} />
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-slate-900">Score {opp.opportunityScore.total}/100</span>
                  <span className="text-[11px] text-slate-500 block">Confidence: {opp.confidenceScore}%</span>
                </div>
              </div>

              <h4 className="font-bold text-sm text-slate-900">{opp.nome}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{opp.problema}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">Próxima evidência: <em>{opp.proximaMelhorEvidencia}</em></span>
                <button
                  onClick={() => {
                    setSelectedOpportunityId(opp.id);
                    setActiveView('oportunidade-detail');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Abrir Opportunity Card
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 8. Perguntas */}
      {activeTab === 'perguntas' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Biblioteca de Perguntas da Vertical (Question Engine)</h3>
          <div className="divide-y divide-slate-100">
            {verticalQuestions.map(q => (
              <div key={q.id} className="py-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{q.texto}</span>
                  <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                    Escopo: {q.escopo}
                  </span>
                </div>
                {q.historicoPromocao && (
                  <p className="text-[11px] text-purple-700 font-medium bg-purple-50 p-1.5 rounded">
                    {q.historicoPromocao}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
