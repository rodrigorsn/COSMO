import React, { useState } from 'react';
import { useRadar } from '../../context/RadarContext';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { HelpCircle, Plus, Filter, Sparkles, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { QuestionLibraryItem, HierarchyProfile } from '../../types/radar';

export const QuestionsView: React.FC = () => {
  const { perguntasBiblioteca, addQuestionToLibrary, promoteQuestion } = useRadar();
  
  const [filterScope, setFilterScope] = useState<string>('all');
  const [filterProfile, setFilterProfile] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newText, setNewText] = useState('');
  const [newScope, setNewScope] = useState<'global' | 'vertical' | 'perfil'>('vertical');
  const [newProfile, setNewProfile] = useState<HierarchyProfile | undefined>('Gestor');
  const [newCategory, setNewCategory] = useState('Processo / Foco');
  const [newFollowUps, setNewFollowUps] = useState('Quanto tempo isso leva?\nQual a frequência?');

  const filteredQuestions = perguntasBiblioteca.filter(q => {
    if (filterScope !== 'all' && q.escopo !== filterScope) return false;
    if (filterProfile !== 'all' && q.perfilAplicavel !== filterProfile) return false;
    return true;
  });

  const handleCreateQuestion = () => {
    if (!newText.trim()) return;
    const followUpsArr = newFollowUps.split('\n').map(s => s.trim()).filter(Boolean);

    addQuestionToLibrary({
      texto: newText.trim(),
      escopo: newScope,
      verticalId: newScope === 'vertical' ? 'VERT-CONT' : undefined,
      perfilAplicavel: newScope === 'perfil' ? newProfile : undefined,
      categoria: newCategory,
      followUps: followUpsArr.length > 0 ? followUpsArr : ['Pode detalhar um exemplo recente?']
    });

    setNewText('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Question Engine (Biblioteca de Perguntas)
            </h1>
            <SimulacaoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Motor de geração de roteiros de entrevistas com perguntas globais, setoriais, de perfil e emergentes promovidas (PRD Seção 17–23 e 50).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nova Pergunta no Engine</span>
        </button>
      </div>

      {/* Scope Filters (PRD Seção 64) */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Filtrar Escopo:</span>
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'global', label: 'Globais (PRD S.18)' },
              { id: 'vertical', label: 'Verticais (PRD S.19)' },
              { id: 'perfil', label: 'Por Perfil (PRD S.20)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterScope(tab.id)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  filterScope === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filterScope === 'perfil' && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Perfil:</span>
            <select
              value={filterProfile}
              onChange={(e) => setFilterProfile(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs"
            >
              <option value="all">Todos os perfis</option>
              <option value="Sócio/Proprietário">Sócio / Proprietário</option>
              <option value="Gestor">Gestor</option>
              <option value="Operacional">Operacional</option>
            </select>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.map(q => (
          <div key={q.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[11px] text-slate-400 font-semibold">{q.id}</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                    q.escopo === 'global' ? 'bg-indigo-100 text-indigo-800' :
                    q.escopo === 'vertical' ? 'bg-blue-100 text-blue-800' :
                    q.escopo === 'perfil' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {q.escopo}
                  </span>
                  {q.perfilAplicavel && (
                    <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      Alvo: {q.perfilAplicavel}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">• Categoria: {q.categoria}</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">{q.texto}</div>
              </div>

              {q.historicoPromocao && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 shrink-0">
                  Promovida
                </span>
              )}
            </div>

            {q.historicoPromocao && (
              <div className="p-2 rounded bg-purple-50 border border-purple-200 text-purple-900 text-[11px]">
                {q.historicoPromocao}
              </div>
            )}

            {/* Follow-ups */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Follow-ups de Aprofundamento (PRD Seção 22):
              </span>
              <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                {q.followUps.map((f, idx) => (
                  <li key={idx} className="text-xs">{f}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nova Pergunta */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 space-y-4 text-xs border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Adicionar Pergunta ao Question Engine</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Texto da Pergunta:</label>
              <textarea
                rows={2}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Ex: Quais são os 3 maiores gargalos da rotina fiscal?"
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Escopo da Pergunta:</label>
                <select
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="vertical">Vertical (Contabilidade)</option>
                  <option value="global">Global (Todo B2B)</option>
                  <option value="perfil">Por Perfil de Cargo</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Categoria:</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {newScope === 'perfil' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Perfil Alvo:</label>
                <select
                  value={newProfile}
                  onChange={(e) => setNewProfile(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Sócio/Proprietário">Sócio / Proprietário</option>
                  <option value="Gestor">Gestor</option>
                  <option value="Operacional">Operacional</option>
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Follow-ups (um por linha):</label>
              <textarea
                rows={3}
                value={newFollowUps}
                onChange={(e) => setNewFollowUps(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateQuestion}
                className="px-4 py-1.5 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Salvar no Engine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
