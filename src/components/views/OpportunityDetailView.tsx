import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useRadar } from '../../context/RadarContext';
import { EvidenceLevelBadge } from '../common/Badge';
import { SimulacaoTag } from '../common/SimulacaoBadge';
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
  ExternalLink
} from 'lucide-react';
import { Opportunity, Finding } from '../../types/radar';

export const OpportunityDetailView: React.FC = () => {
  const { 
    oportunidades, 
    selectedOpportunityId, 
    setActiveView, 
    doresConsolidadas, 
    ocorrenciasDores, 
    achados, 
    entrevistas, 
    organizacoes,
    setSelectedOrgId
  } = useRadar();

  const opp = oportunidades.find(o => o.id === selectedOpportunityId) || oportunidades[0];

  // Selected node in the Evidence Chain for deep inspection
  const [selectedChainFindingId, setSelectedChainFindingId] = useState<string | null>(null);

  // Derive evidence chain items for this opportunity
  const relatedPains = doresConsolidadas.filter(d => opp.doresRelacionadasIds.includes(d.id));
  const relatedOccurrences = ocorrenciasDores.filter(occ => opp.doresRelacionadasIds.includes(occ.dorConsolidadaId));
  const relatedFindings = achados.filter(f => opp.doresRelacionadasIds.includes(f.dorConsolidadaId || ''));

  const inspectFinding = achados.find(f => f.id === selectedChainFindingId) || relatedFindings[0];
  const inspectInterview = entrevistas.find(e => e.id === inspectFinding?.entrevistaId);
  const inspectOrg = organizacoes.find(o => o.id === inspectFinding?.organizacaoId);
  const inspectPerson = inspectOrg?.entrevistados.find(p => p.id === inspectFinding?.entrevistadoId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('oportunidades')}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Voltar para lista de oportunidades"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700">{opp.id}</span>
                <EvidenceLevelBadge level={opp.evidenceLevel} />
                <SimulacaoTag compact />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                {opp.nome}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Vertical: Contabilidade • Criado em {opp.dataCriacao} • Status: <strong className="text-slate-800">{opp.status}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Opportunity Score</span>
              <span className="font-mono font-bold text-xl text-blue-700">{opp.opportunityScore.total}/100</span>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Nível de Confiança</span>
              <span className="font-mono font-bold text-xl text-emerald-700">{opp.confidenceScore}%</span>
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
      </div>

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
                <span className="font-bold text-slate-900 block mt-0.5">{inspectInterview?.id}</span>
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

      {/* Opportunity Card Details (PRD Seção 40) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Job to be Done, Solution & Gap */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Definição Estratégica do Opportunity Card</h3>

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
                "{opp.jtbd}"
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
              <p className="text-slate-700 mt-0.5 leading-relaxed">{opp.hipoteseSolucao}</p>
            </div>

            <div>
              <span className="font-semibold text-slate-500 block">Riscos Principais Identificados:</span>
              <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5">
                {opp.riscosPrincipais.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Opportunity Score (0-100) & AI Leverage (0-30) */}
        <div className="space-y-4">
          {/* Opportunity Score Breakdown (PRD Seção 41) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Opportunity Score Breakdown (0–100)</h3>
              <span className="font-mono font-bold text-base text-blue-700">{opp.opportunityScore.total}/100</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Composição objetiva ponderada conforme o PRD Seção 41:
            </p>

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
                  <span className="font-mono font-bold">{opp.opportunityScore.gap}/25</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(opp.opportunityScore.gap / 25) * 100}%` }} />
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
                <span className="font-bold text-purple-900">{opp.aiLeverage.classificacaoTriagem}/5</span>
              </div>
              <div className="p-2 bg-purple-50/50 rounded border border-purple-100">
                <span className="text-slate-500 block text-[10px]">3. Extração Dados</span>
                <span className="font-bold text-purple-900">{opp.aiLeverage.extracaoDados}/5</span>
              </div>
              <div className="p-2 bg-purple-50/50 rounded border border-purple-100">
                <span className="text-slate-500 block text-[10px]">4. Comparação</span>
                <span className="font-bold text-purple-900">{opp.aiLeverage.comparacaoConciliacao}/5</span>
              </div>
              <div className="p-2 bg-purple-50/50 rounded border border-purple-100">
                <span className="text-slate-500 block text-[10px]">5. Geração</span>
                <span className="font-bold text-purple-900">{opp.aiLeverage.geracaoPrimeiraVersao}/5</span>
              </div>
              <div className="p-2 bg-purple-50/50 rounded border border-purple-100">
                <span className="text-slate-500 block text-[10px]">6. Revisão Humana</span>
                <span className="font-bold text-purple-900">{opp.aiLeverage.reducaoEsforcoHumano}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kill Criteria & Experimentos (PRD Seção 44 e 45) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
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
                  Condição atual observada: {kc.condicaoAtual}
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
                  <span className="font-bold text-slate-900">{exp.nome}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                    {exp.tipo} • {exp.resultado}
                  </span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  <strong>Hipótese:</strong> {exp.hipotese}
                </div>
                <div className="text-slate-500 text-[11px]">
                  <strong>Aprendizado:</strong> {exp.aprendizado}
                </div>
                <div className="text-[10px] text-slate-400 pt-1">
                  Data: {exp.data}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
