import React, { useState } from 'react';
import { useRadar } from '../../context/RadarContext';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { BookOpen, ExternalLink, Plus, Filter, CheckCircle2 } from 'lucide-react';

export const SourcesView: React.FC = () => {
  const { fontes, addSource } = useRadar();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newInst, setNewInst] = useState('');
  const [newCat, setNewCat] = useState<'regulamentacao' | 'mercado' | 'censo' | 'tecnologia'>('mercado');
  const [newExtracted, setNewExtracted] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newUrl, setNewUrl] = useState('https://');

  const filtered = fontes.filter(f => {
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
    setShowModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Fontes Secundárias e Estatísticas de Mercado (PRD Seção 65)
            </h1>
            <SimulacaoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dados institucionais de órgãos reguladores, censos e relatórios de tecnologia para contextualizar o tamanho de mercado.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Cadastrar Fonte</span>
        </button>
      </div>

      {/* Category Filters */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 text-xs">
        <span className="font-semibold text-slate-500">Filtrar Categoria:</span>
        <div className="flex items-center gap-1">
          {['all', 'regulamentacao', 'mercado', 'censo', 'tecnologia'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors capitalize ${
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

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(src => (
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

      {/* Modal Nova Fonte */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 space-y-4 text-xs border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Cadastrar Fonte Secundária</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Título do Estudo / Relatório:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Censo Contábil Nacional 2024"
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Instituição:</label>
                <input
                  type="text"
                  value={newInst}
                  onChange={(e) => setNewInst(e.target.value)}
                  placeholder="Ex: CFC / Sebrae"
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Categoria:</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="mercado">Mercado</option>
                  <option value="censo">Censo</option>
                  <option value="regulamentacao">Regulamentação</option>
                  <option value="tecnologia">Tecnologia</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Informação Chave Extraída:</label>
              <input
                type="text"
                value={newExtracted}
                onChange={(e) => setNewExtracted(e.target.value)}
                placeholder="Ex: 82.000 organizações contábeis ativas no Brasil"
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Resumo do Contexto:</label>
              <textarea
                rows={2}
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateSource}
                className="px-4 py-1.5 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Salvar Fonte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
