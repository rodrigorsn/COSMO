import React, { useState } from 'react';
import { useRadar } from '../../context/RadarContext';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { 
  Database, 
  BookOpen, 
  Building, 
  Plus, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle, 
  Filter 
} from 'lucide-react';

export const FontesEMercadoView: React.FC<{ defaultTab?: 'fontes' | 'concorrentes' }> = ({ 
  defaultTab = 'fontes' 
}) => {
  const { 
    fontes, 
    addSource, 
    concorrentes, 
    addCompetitor 
  } = useRadar();

  const [activeTab, setActiveTab] = useState<'fontes' | 'concorrentes'>(defaultTab);

  // Sources tab state
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newInst, setNewInst] = useState('');
  const [newCat, setNewCat] = useState<'regulamentacao' | 'mercado' | 'censo' | 'tecnologia'>('mercado');
  const [newExtracted, setNewExtracted] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newUrl, setNewUrl] = useState('https://');

  // Competitors tab state
  const [showCompModal, setShowCompModal] = useState(false);
  const [compNome, setCompNome] = useState('');
  const [compModelo, setCompModelo] = useState('SaaS B2B Mensal');
  const [compPreco, setCompPreco] = useState('');
  const [compProposta, setCompProposta] = useState('');
  const [compGap, setCompGap] = useState('');
  const [compPontosFortes, setCompPontosFortes] = useState('');
  const [compPontosFracos, setCompPontosFracos] = useState('');

  const filteredSources = fontes.filter(f => {
    if (filterCategory !== 'all' && f.categoria !== filterCategory) return false;
    return true;
  });

  const handleCreateSource = () => {
    if (!newTitle.trim()) return;
    addSource({
      verticalId: 'VERT-CONT',
      titulo: newTitle.trim(),
      instituicao: newInst.trim() || 'Instituto de Pesquisa',
      data: new Date().toISOString().split('T')[0],
      url: newUrl,
      categoria: newCat,
      confiabilidade: 'alta',
      informacaoExtraida: newExtracted.trim(),
      resumo: newSummary.trim()
    });
    setNewTitle('');
    setNewInst('');
    setNewExtracted('');
    setNewSummary('');
    setShowSourceModal(false);
  };

  const handleCreateCompetitor = () => {
    if (!compNome.trim()) return;
    addCompetitor({
      verticalId: 'VERT-CONT',
      nome: compNome.trim(),
      modelo: compModelo.trim(),
      precoEstimado: compPreco.trim() || 'R$ 800 - R$ 2.500 / mês',
      proposta: compProposta.trim(),
      operationsGapObservado: compGap.trim(),
      pontosFortes: compPontosFortes.split('\n').filter(Boolean),
      pontosFracos: compPontosFracos.split('\n').filter(Boolean)
    });
    setCompNome('');
    setCompPreco('');
    setCompProposta('');
    setCompGap('');
    setCompPontosFortes('');
    setCompPontosFracos('');
    setShowCompModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Fontes Secundárias, Estatísticas & Mercado (PRD Seções 65 e 66)
            </h1>
            <SimulacaoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evidências de contexto macro: censos setoriais, relatórios regulatórios e mapeamento de concorrentes sob a ótica do Customer Operations Gap.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/80 p-1 rounded-lg text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('fontes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'fontes'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Fontes Secundárias ({fontes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('concorrentes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'concorrentes'
                ? 'bg-white text-rose-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-rose-600" />
            <span>Concorrentes & Gap ({concorrentes.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'fontes' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            {/* Category Filters */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500 text-[11px]">Filtrar:</span>
              <div className="flex items-center gap-1">
                {['all', 'regulamentacao', 'mercado', 'censo', 'tecnologia'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors capitalize ${
                      filterCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'Todas' : cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowSourceModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Cadastrar Fonte</span>
            </button>
          </div>

          {/* Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSources.map(src => (
              <div key={src.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400 text-[11px] font-semibold">{src.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200">
                      {src.categoria}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{src.titulo}</h3>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-slate-800">
                    <strong className="text-slate-900 block mb-0.5">Informação Extraída:</strong>
                    {src.informacaoExtraida}
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {src.resumo}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <div>
                    <span>{src.instituicao}</span> • <span>{src.data}</span>
                  </div>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Link oficial <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Mapeamento sob a ótica metodológica: <em>"O que os clientes continuam fazendo fora dessa ferramenta?"</em> (PRD Seção 66).
            </p>

            <button
              onClick={() => setShowCompModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Mapear Concorrente</span>
            </button>
          </div>

          {/* Competitors List */}
          <div className="grid grid-cols-1 gap-4">
            {concorrentes.map(comp => (
              <div key={comp.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[11px] font-semibold">{comp.id}</span>
                      <h3 className="font-bold text-base text-slate-900">{comp.nome}</h3>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">{comp.proposta}</p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-800 text-xs bg-slate-100 px-2 py-0.5 rounded">
                      {comp.modelo} • {comp.precoEstimado}
                    </span>
                  </div>
                </div>

                {/* THE OPERATIONS GAP CALLOUT (PRD Seção 66) */}
                <div className="p-3.5 rounded-lg bg-rose-50/70 border border-rose-200 text-rose-950 space-y-1">
                  <div className="font-bold text-xs flex items-center gap-1.5 text-rose-900">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    Customer Operations Gap Observado em Campo:
                  </div>
                  <p className="text-xs leading-relaxed text-rose-900/90">
                    {comp.operationsGapObservado}
                  </p>
                </div>

                {/* Pontos Fortes vs Fracos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="font-bold text-slate-700 block text-[11px] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Pontos Fortes:
                    </span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {comp.pontosFortes.map((pf, idx) => (
                        <li key={idx}>{pf}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="font-bold text-slate-700 block text-[11px] flex items-center gap-1">
                      <span className="text-rose-600 font-bold">✕</span>
                      Limitações e Pontos Fracos:
                    </span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {comp.pontosFracos.map((pfr, idx) => (
                        <li key={idx}>{pfr}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Nova Fonte */}
      {showSourceModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 space-y-4 text-xs border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Cadastrar Fonte Secundária</h3>
              <button onClick={() => setShowSourceModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Título do Estudo / Relatório:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Censo CFC 2026 sobre escritórios contábeis"
                className="w-full p-2 border border-slate-200 rounded text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Instituição:</label>
                <input
                  type="text"
                  value={newInst}
                  onChange={(e) => setNewInst(e.target.value)}
                  placeholder="Ex: CFC, Fenacon, FGV"
                  className="w-full p-2 border border-slate-200 rounded text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Categoria:</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded text-xs"
                >
                  <option value="censo">Censo</option>
                  <option value="mercado">Mercado</option>
                  <option value="regulamentacao">Regulamentação</option>
                  <option value="tecnologia">Tecnologia</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Informação Extraída (Dado-chave):</label>
              <textarea
                rows={2}
                value={newExtracted}
                onChange={(e) => setNewExtracted(e.target.value)}
                placeholder="Ex: 83% dos escritórios declaram dificuldade em obter dados dos clientes."
                className="w-full p-2 border border-slate-200 rounded text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Resumo Contextual:</label>
              <textarea
                rows={2}
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">URL da Fonte Oficial:</label>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded text-xs font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowSourceModal(false)}
                className="px-3 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateSource}
                className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Salvar Fonte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Concorrente */}
      {showCompModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 space-y-4 text-xs border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Mapear Concorrente / Solução Existente</h3>
              <button onClick={() => setShowCompModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Nome do Concorrente / Solução:</label>
              <input
                type="text"
                value={compNome}
                onChange={(e) => setCompNome(e.target.value)}
                placeholder="Ex: Atlas ERP, Acessórias Gestão, etc."
                className="w-full p-2 border border-slate-200 rounded text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Modelo de Preço:</label>
                <input
                  type="text"
                  value={compModelo}
                  onChange={(e) => setCompModelo(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Preço Estimado:</label>
                <input
                  type="text"
                  value={compPreco}
                  onChange={(e) => setCompPreco(e.target.value)}
                  placeholder="Ex: R$ 500 a R$ 2.000 / mês"
                  className="w-full p-2 border border-slate-200 rounded text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Proposta de Valor Declarada:</label>
              <input
                type="text"
                value={compProposta}
                onChange={(e) => setCompProposta(e.target.value)}
                placeholder="Ex: Gestão contábil e fiscal integrada para escritórios"
                className="w-full p-2 border border-slate-200 rounded text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-rose-900 block">Customer Operations Gap Observado em Campo:</label>
              <textarea
                rows={2}
                value={compGap}
                onChange={(e) => setCompGap(e.target.value)}
                placeholder="Ex: Não resolve a entrada nem validação de documentos, forçando o uso de WhatsApp e planilhas."
                className="w-full p-2 border border-rose-300 rounded text-xs bg-rose-50/40 text-rose-950"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pontos Fortes (um por linha):</label>
                <textarea
                  rows={2}
                  value={compPontosFortes}
                  onChange={(e) => setCompPontosFortes(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pontos Fracos (um por linha):</label>
                <textarea
                  rows={2}
                  value={compPontosFracos}
                  onChange={(e) => setCompPontosFracos(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowCompModal(false)}
                className="px-3 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCompetitor}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                Salvar Concorrente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
