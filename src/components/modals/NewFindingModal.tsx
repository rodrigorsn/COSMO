import React, { useState } from 'react';
import { useRadar } from '../../context/RadarContext';
import { Quote, X, Sparkles } from 'lucide-react';

export const NewFindingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { organizacoes, doresConsolidadas, addFinding } = useRadar();

  const [orgId, setOrgId] = useState(organizacoes[0]?.id || '');
  const [titulo, setTitulo] = useState('');
  const [fraseOriginal, setFraseOriginal] = useState('');
  const [interpretacao, setInterpretacao] = useState('');
  const [natureza, setNatureza] = useState<'favoravel' | 'contraria' | 'neutra'>('favoravel');
  const [categoria, setCategoria] = useState('Gestão Documental');
  const [dorId, setDorId] = useState(doresConsolidadas[0]?.id || 'DOR-CONT-001');

  if (!isOpen) return null;

  const currentOrg = organizacoes.find(o => o.id === orgId) || organizacoes[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fraseOriginal.trim() || !titulo.trim()) return;

    addFinding({
      titulo: titulo.trim(),
      descricao: interpretacao.trim() || 'Evidência de campo.',
      origem: 'Entrevista',
      tipoEvidencia: 'evidencia_observada',
      natureza,
      organizacaoId: currentOrg.id,
      entrevistadoId: currentOrg.entrevistados[0]?.id,
      categoria,
      fraseOriginal: fraseOriginal.trim(),
      interpretacao: interpretacao.trim() || 'Achado registrado na pesquisa.',
      tags: ['pesquisa', categoria.toLowerCase()],
      dorConsolidadaId: dorId
    });

    setTitulo('');
    setFraseOriginal('');
    setInterpretacao('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 text-xs border border-slate-200 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-base text-slate-900">Registrar Novo Achado de Pesquisa</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-500">
          A regra fundamental do VOR: a fala do entrevistado é sagrada e deve ser separada da interpretação analítica do pesquisador (PRD Seção 26).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Título do Achado:</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Cobrança diária por WhatsApp consome tempo integral"
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Organização de Origem:</label>
              <select
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              >
                {organizacoes.map(o => (
                  <option key={o.id} value={o.id}>{o.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Natureza da Evidência:</label>
              <select
                value={natureza}
                onChange={(e) => setNatureza(e.target.value as any)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              >
                <option value="favoravel">Favorável à dor (+)</option>
                <option value="contraria">Contrária à dor (-)</option>
                <option value="neutra">Neutra</option>
              </select>
            </div>
          </div>

          {/* Fala Original */}
          <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200 space-y-1">
            <label className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
              1. Fala Original Preservada (Verbatim):
            </label>
            <textarea
              rows={2}
              required
              value={fraseOriginal}
              onChange={(e) => setFraseOriginal(e.target.value)}
              placeholder='Ex: "A gente perde praticamente metade da primeira semana do mês só cobrando extrato de banco que o cliente esquece de mandar."'
              className="w-full p-2 bg-white rounded border border-amber-300 text-xs italic text-slate-800"
            />
          </div>

          {/* Interpretação */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              2. Interpretação Analítica do Pesquisador:
            </label>
            <textarea
              rows={2}
              value={interpretacao}
              onChange={(e) => setInterpretacao(e.target.value)}
              placeholder="Ex: Atraso de conciliação bancária gera pico de sobrecarga operacional cíclico."
              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Associar à Dor Consolidada:</label>
            <select
              value={dorId}
              onChange={(e) => setDorId(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
            >
              {doresConsolidadas.map(d => (
                <option key={d.id} value={d.id}>{d.id} — {d.titulo}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
            >
              Salvar Achado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
