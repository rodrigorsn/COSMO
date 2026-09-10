import React, { useState } from 'react';
import { useRadar } from '../../context/RadarContext';
import { MessageSquareText, X, Play } from 'lucide-react';
import { Interview, InterviewQuestionInstance } from '../../types/radar';

export const NewInterviewModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { organizacoes, perguntasBiblioteca, saveInterview, setActiveInterviewToConduct, setActiveView } = useRadar();

  const [orgId, setOrgId] = useState(organizacoes[0]?.id || '');
  const [selectedOrg, setSelectedOrg] = useState(organizacoes[0]);
  const [entrevistadoId, setEntrevistadoId] = useState(organizacoes[0]?.entrevistados[0]?.id || '');
  const [tipo, setTipo] = useState<'individual' | 'observacao_processo' | 'dupla'>('individual');
  const [duracao, setDuracao] = useState(45);
  const [notasGerais, setNotasGerais] = useState('');

  if (!isOpen) return null;

  const currentOrg = organizacoes.find(o => o.id === orgId) || organizacoes[0];
  const currentPerson = currentOrg?.entrevistados.find(p => p.id === entrevistadoId) || currentOrg?.entrevistados[0];

  const handleOrgChange = (newOrgId: string) => {
    setOrgId(newOrgId);
    const org = organizacoes.find(o => o.id === newOrgId);
    if (org && org.entrevistados.length > 0) {
      setEntrevistadoId(org.entrevistados[0].id);
    }
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrg || !currentPerson) return;

    // Compose questions from Question Engine: Global + Vertical + Perfil
    const relevantQuestions = perguntasBiblioteca.filter(q => {
      if (q.escopo === 'global') return true;
      if (q.escopo === 'vertical' && q.verticalId === currentOrg.verticalId) return true;
      if (q.escopo === 'perfil' && q.perfilAlvo === currentPerson.perfil) return true;
      return false;
    });

    const questionInstances: InterviewQuestionInstance[] = relevantQuestions.map((q, idx) => ({
      id: `INST-${idx + 1}-${Date.now().toString().slice(-4)}`,
      texto: q.texto,
      escopo: q.escopo,
      categoria: q.categoria,
      respostaQualitativa: '',
      followUps: q.followUps
    }));

    const newInterview: Interview = {
      id: `ENT-${currentOrg.id.split('-').pop()}-${Date.now().toString().slice(-3)}`,
      organizacaoId: currentOrg.id,
      verticalId: currentOrg.verticalId,
      entrevistadoId: currentPerson.id,
      data: new Date().toISOString().split('T')[0],
      tipo: 'Descoberta',
      status: 'Concluída',
      duracaoMinutos: Number(duracao),
      perguntas: questionInstances,
      achadosGeradosIds: [],
      notasGerais: notasGerais.trim() || 'Entrevista em andamento com roteiro dinâmico composto pelo Question Engine.'
    };

    saveInterview(newInterview);
    setActiveInterviewToConduct(newInterview);
    setActiveView('entrevistas');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 text-xs border border-slate-200 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-base text-slate-900">Iniciar Nova Entrevista de Campo</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-500">
          O Question Engine montará automaticamente o roteiro com base nas perguntas Globais, da Vertical e do Perfil do profissional (PRD Seção 17).
        </p>

        <form onSubmit={handleStart} className="space-y-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Organização:</label>
            <select
              value={orgId}
              onChange={(e) => handleOrgChange(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
            >
              {organizacoes.map(o => (
                <option key={o.id} value={o.id}>
                  {o.nome} ({o.id} • {o.numClientes} clientes)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Entrevistado:</label>
            <select
              value={entrevistadoId}
              onChange={(e) => setEntrevistadoId(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
            >
              {currentOrg?.entrevistados.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome} — {p.cargo} ({p.perfil})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tipo de Sessão:</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as any)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              >
                <option value="individual">Entrevista Individual</option>
                <option value="observacao_processo">Observação de Processo (Shadowing)</option>
                <option value="dupla">Entrevista em Dupla</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Duração Estimada (min):</label>
              <input
                type="number"
                value={duracao}
                onChange={(e) => setDuracao(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Objetivo / Notas Prévias:</label>
            <textarea
              rows={2}
              value={notasGerais}
              onChange={(e) => setNotasGerais(e.target.value)}
              placeholder="Ex: Investigar se a rotina de admissões gera atrasos."
              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
            />
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
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Gerar Roteiro e Abrir Sessão</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
