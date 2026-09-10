import React, { useState } from 'react';
import { useRadar } from '../../context/RadarContext';
import { Building2, X } from 'lucide-react';
import { Organization } from '../../types/radar';

export const NewOrganizationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addOrganization, verticais } = useRadar();

  const [nome, setNome] = useState('');
  const [verticalId, setVerticalId] = useState('VERT-CONT');
  const [subverticalId, setSubverticalId] = useState('SUB-GEN');
  const [cidade, setCidade] = useState('Curitiba');
  const [estado, setEstado] = useState('PR');
  const [regiao, setRegiao] = useState('Sul');
  const [numFuncionarios, setNumFuncionarios] = useState<number>(20);
  const [numClientes, setNumClientes] = useState<number>(280);
  const [especializacao, setEspecializacao] = useState('Serviços e Comércio Geral');
  const [perfilClientes, setPerfilClientes] = useState('PMEs Simples Nacional e Lucro Presumido');
  const [anosOperacao, setAnosOperacao] = useState<number>(12);
  const [estruturaEquipe, setEstruturaEquipe] = useState('2 sócios, 6 fiscais, 6 DP, 6 contábeis');

  if (!isOpen) return null;

  const currentVert = verticais.find(v => v.id === verticalId) || verticais[0];
  const selectedSub = currentVert?.subverticais.find(s => s.id === subverticalId) || currentVert?.subverticais[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    addOrganization({
      nome: nome.trim(),
      verticalId,
      subverticalId: selectedSub?.id || 'SUB-GEN',
      subvertical: selectedSub?.nome || 'Escritório contábil generalista',
      cidade,
      estado,
      regiao,
      numFuncionarios: Number(numFuncionarios),
      numClientes: Number(numClientes),
      especializacao,
      perfilClientes,
      anosOperacao: Number(anosOperacao),
      faixaFaturamento: 'R$ 80k - R$ 150k / mês',
      ticketMedioServico: 'R$ 1.100 / cliente',
      estruturaEquipe,
      observacoes: 'Cadastrada para validação em campo.',
      statusPesquisa: 'Em andamento',
      stackTecnologico: [
        {
          id: `STK-${Date.now().toString().slice(-4)}`,
          nome: 'ERP Fiscal / Contábil',
          categoria: 'ERP',
          quemUtiliza: 'Toda a equipe',
          frequencia: 'Diária',
          processosAtendidos: ['Escrituração', 'Folha'],
          satisfacaoPercebida: 3,
          limitacoes: 'Não automatiza cobrança nem comunicação com cliente.',
          oQueAconteceFora: 'Toda a cobrança de documentos e envio de guias é feita por WhatsApp e e-mail com conferência em planilhas manuais.'
        }
      ],
      processos: [
        {
          id: `PROC-${Date.now().toString().slice(-4)}`,
          nome: 'Fechamento Fiscal Mensal',
          area: 'Fiscal',
          descricao: 'Coleta de notas e apuração dos tributos',
          frequencia: 'Mensal',
          pessoasEnvolvidas: 3,
          tempoEstimadoHorasMes: 60,
          etapas: [
            { id: '1', ordem: 1, ator: 'Cliente', acao: 'Envia notas', ferramenta: 'WhatsApp / E-mail' },
            { id: '2', ordem: 2, ator: 'Analista', acao: 'Baixa arquivos e confere em planilha', ferramenta: 'Planilha Excel', gargaloOuErro: 'Arquivos corrompidos ou incompletos' },
            { id: '3', ordem: 3, ator: 'Analista', acao: 'Importa para o ERP', ferramenta: 'ERP' }
          ],
          gargalos: 'Atraso crônico no recebimento de comprovantes.',
          errosERetrabalho: 'Necessidade de refazer guias com multas.'
        }
      ],
      entrevistados: [
        {
          id: `ENTV-${Date.now().toString().slice(-4)}`,
          nome: 'Responsável Operacional',
          cargo: 'Gerente Operacional',
          perfil: 'gestor_operacao',
          area: 'Operação',
          tempoNaFuncao: '5 anos',
          observacoes: 'Contato direto com a equipe e gargalos diários.'
        }
      ]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 space-y-4 text-xs border border-slate-200 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-base text-slate-900">Cadastrar Nova Organização B2B</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-500">
          Crie um ambiente isolado e seguro para uma nova empresa participante da pesquisa de campo (PRD Seção 9 e 10).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nome da Organização:</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Delta Soluções Contábeis"
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Vertical:</label>
              <select
                value={verticalId}
                onChange={(e) => {
                  const newVId = e.target.value;
                  setVerticalId(newVId);
                  const newV = verticais.find(v => v.id === newVId);
                  if (newV && newV.subverticais.length > 0) {
                    setSubverticalId(newV.subverticais[0].id);
                  }
                }}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              >
                {verticais.map(v => (
                  <option key={v.id} value={v.id}>{v.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Subvertical:</label>
              <select
                value={subverticalId}
                onChange={(e) => setSubverticalId(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              >
                {currentVert?.subverticais.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nome} ({s.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Cidade:</label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Estado (UF):</label>
              <input
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Região:</label>
              <input
                type="text"
                value={regiao}
                onChange={(e) => setRegiao(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Funcionários:</label>
              <input
                type="number"
                value={numFuncionarios}
                onChange={(e) => setNumFuncionarios(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Clientes Atendidos (B2B):</label>
              <input
                type="number"
                value={numClientes}
                onChange={(e) => setNumClientes(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold text-blue-700"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Anos Operação:</label>
              <input
                type="number"
                value={anosOperacao}
                onChange={(e) => setAnosOperacao(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Perfil dos Clientes / Carteira:</label>
            <input
              type="text"
              value={perfilClientes}
              onChange={(e) => setPerfilClientes(e.target.value)}
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
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
            >
              Criar Organização
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
