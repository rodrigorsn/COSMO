import React from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const UnknownRouteFallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800 antialiased">
      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-md w-full shadow-xs text-center">
        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900 mb-1">Rota não reconhecida</h2>
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          O endereço <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[11px]">{location.pathname}</code> não faz parte do mapa de rotas principais do COSMO nesta etapa.
        </p>
        <p className="text-[11px] text-slate-500 mb-5">
          Nenhuma alteração de estado foi aplicada para evitar exibição de tela incorreta.
        </p>
        <button
          onClick={() => navigate({ to: '/' as any })}
          className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retornar à Visão Geral (Dashboard)
        </button>
      </div>
    </div>
  );
};
