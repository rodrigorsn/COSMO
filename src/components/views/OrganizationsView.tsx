import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useRadar } from '../../context/RadarContext';
import { SimulacaoTag } from '../common/SimulacaoBadge';
import { Building2, Plus, Filter, Users, Layers, Search, ArrowRight, ExternalLink } from 'lucide-react';
import { Organization } from '../../types/radar';

export const OrganizationsView: React.FC<{ onNewOrgClick?: () => void }> = ({ onNewOrgClick }) => {
  const { organizacoes, verticais, entrevistas, ocorrenciasDores } = useRadar();
  
  const [filterSize, setFilterSize] = useState<string>('all');
  const [filterSoftware, setFilterSoftware] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredOrgs = organizacoes.filter(org => {
    if (filterSize === 'pequeno' && org.numClientes >= 150) return false;
    if (filterSize === 'medio' && (org.numClientes < 150 || org.numClientes > 400)) return false;
    if (filterSize === 'grande' && org.numClientes <= 400) return false;

    if (filterSoftware !== 'all') {
      const hasSoftware = org.stackTecnologico.some(s => s.nome.toLowerCase().includes(filterSoftware.toLowerCase()));
      if (!hasSoftware) return false;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return org.nome.toLowerCase().includes(term) || org.cidade.toLowerCase().includes(term) || org.especializacao.toLowerCase().includes(term);
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Organizações Pesquisadas (B2B)
            </h1>
            <SimulacaoTag />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ambiente segregado por organização. Dados operacionais e de processos nunca são misturados no nível bruto (PRD Seção 9 e 10).
          </p>
        </div>

        <button
          onClick={onNewOrgClick}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nova Organização</span>
        </button>
      </div>

      {/* Filters (PRD Seção 56) */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, cidade ou especialização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent focus:outline-hidden text-slate-800 placeholder-slate-400 text-xs"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Clientes:</span>
            <select
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-800 focus:outline-hidden"
            >
              <option value="all">Todos os portes</option>
              <option value="pequeno">&lt; 150 clientes</option>
              <option value="medio">150 a 400 clientes</option>
              <option value="grande">&gt; 400 clientes</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="font-medium">ERP Principal:</span>
            <select
              value={filterSoftware}
              onChange={(e) => setFilterSoftware(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-800 focus:outline-hidden"
            >
              <option value="all">Todos os softwares</option>
              <option value="Atlas">Atlas Contábil</option>
              <option value="FiscalPro">FiscalPro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table (PRD Seção 56) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Organização</th>
                <th className="py-3 px-4">Vertical / Subvertical</th>
                <th className="py-3 px-4 text-center">Funcionários</th>
                <th className="py-3 px-4 text-center">Clientes (B2B)</th>
                <th className="py-3 px-4 text-center">Entrevistas</th>
                <th className="py-3 px-4 text-center">Processos</th>
                <th className="py-3 px-4 text-center">Dores</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrgs.map((org) => {
                const orgInterviews = entrevistas.filter(e => e.organizacaoId === org.id);
                const orgOccurrences = ocorrenciasDores.filter(o => o.organizacaoId === org.id);
                const maxPain = orgOccurrences.length > 0 
                  ? Math.max(...orgOccurrences.map(o => o.painScore.total)) 
                  : 0;

                return (
                  <tr key={org.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{org.nome}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {org.id} • {org.cidade}/{org.estado}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">Contabilidade</div>
                      <div className="text-[11px] text-slate-500">{org.subvertical}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-800">
                      {org.numFuncionarios}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {org.numClientes}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {orgInterviews.length}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {org.processos.length}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded ${
                        maxPain >= 20 ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {orgOccurrences.length} (Max: {maxPain}/25)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {org.statusPesquisa}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/organizacoes/$orgId"
                        params={{ orgId: org.id }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-xs inline-flex items-center justify-center"
                      >
                        Abrir Ambiente
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
