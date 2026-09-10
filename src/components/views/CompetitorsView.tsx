import React, { useState } from 'react';
import { useRadar } from '../../context/RadarContext';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { AlertTriangle, Plus, CheckCircle, XCircle } from 'lucide-react';

export const CompetitorsView: React.FC = () => {
  const { concorrentes, addCompetitor } = useRadar();
  const [showModal, setShowModal] = useState(false);

  const [nome, setNome] = useState('');
  const [modelo, setModelo] = useState('SaaS B2B Mensal');
  const [preco, setPreco] = useState('');
  const [proposta, setProposta] = useState('');
  const [gap, setGap] = useState('');
  const [pontosFortes, setPontosFortes] = useState('');
  const [pontosFracos, setPontosFracos] = useState('');

  const handleCreate = () => {
    if (!nome.trim()) return;
    addCompetitor({
      verticalId: 'VERT-CONT',
      nome: nome.trim(),
      modelo: modelo.trim(),
      precoEstimado: preco.trim() || 'R$ 800 - R$ 2.500 / mês',
      proposta: proposta.trim(),
      operationsGapObservado: gap.trim(),
      pontosFortes: pontosFortes.split('\n').filter(Boolean),
      pontosFracos: pontosFracos.split('\n').filter(Boolean)
    });
    setNome('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Mapeamento de Concorrentes & Customer Operations Gap
            </h1>
            <SimulacaoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mapeamento de ERPs, ferramentas pontuais e soluções caseiras sob a ótica: <em>"O que os clientes continuam fazendo fora dessa ferramenta?"</em> (PRD Seção 66).
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
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
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  Pontos Fracos:
                </span>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  {comp.pontosFracos.map((pf, idx) => (
                    <li key={idx}>{pf}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Novo Concorrente */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 space-y-4 text-xs border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Mapear Solução Concorrente ou Alternativa</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Nome da Solução:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: ERP Omega Fiscal"
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Modelo de Negócio:</label>
                <input
                  type="text"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Preço Estimado:</label>
                <input
                  type="text"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="Ex: R$ 1.200 / mês"
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Proposta Principal:</label>
              <input
                type="text"
                value={proposta}
                onChange={(e) => setProposta(e.target.value)}
                placeholder="Ex: Emissão e guarda fiscal voltada para médias empresas."
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-rose-900 block">
                Customer Operations Gap (O que os clientes continuam fazendo fora dessa ferramenta?):
              </label>
              <textarea
                rows={2}
                value={gap}
                onChange={(e) => setGap(e.target.value)}
                placeholder="Ex: Não faz a cobrança ativa de documentos atrasados, obrigando uso de WhatsApp e planilhas paralelas."
                className="w-full p-2 border border-rose-300 rounded-lg text-xs"
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
                onClick={handleCreate}
                className="px-4 py-1.5 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
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
