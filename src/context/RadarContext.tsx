import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Vertical, 
  Organization, 
  Interview, 
  Finding, 
  PainConsolidated, 
  PainOccurrence, 
  Opportunity, 
  QuestionLibraryItem, 
  MarketSource, 
  Competitor, 
  CrossVerticalComparison,
  InterviewQuestionInstance,
  PainScoreBreakdown,
  QuestionTargetScope,
  QuestionPromotionContext
} from '../types/radar';
import { 
  INITIAL_VERTICAIS, 
  INITIAL_ORGANIZACOES, 
  INITIAL_ENTREVISTAS, 
  INITIAL_ACHADOS, 
  INITIAL_DORES_CONSOLIDADAS, 
  INITIAL_PAIN_OCCURRENCES, 
  INITIAL_OPPORTUNITIES, 
  INITIAL_QUESTION_LIBRARY, 
  INITIAL_FONTES, 
  INITIAL_CONCORRENTES, 
  INITIAL_CROSS_VERTICAL 
} from '../data/initialData';
import { calculatePainScore } from '../utils/calculations';

interface RadarContextType {
  verticais: Vertical[];
  organizacoes: Organization[];
  entrevistas: Interview[];
  achados: Finding[];
  doresConsolidadas: PainConsolidated[];
  ocorrenciasDores: PainOccurrence[];
  oportunidades: Opportunity[];
  perguntasBiblioteca: QuestionLibraryItem[];
  fontes: MarketSource[];
  concorrentes: Competitor[];
  crossVertical: CrossVerticalComparison[];
  
  // Guided Journey State (18 steps from Section 81)
  currentJourneyStep: number;
  setCurrentJourneyStep: (step: number) => void;
  jumpToJourneyStep: (step: number) => void;

  // Actions
  addFinding: (finding: Omit<Finding, 'id' | 'dataRegistro'>) => Finding;
  updateFinding: (finding: Finding) => void;
  deleteFinding: (id: string) => void;
  addPainOccurrence: (occurrence: Omit<PainOccurrence, 'id'>) => void;
  updatePainScore: (occurrenceId: string, breakdown: Omit<PainScoreBreakdown, 'total'>) => void;
  addOrganization: (org: Organization) => void;
  saveInterview: (interview: Interview) => void;
  addQuestionToLibrary: (question: Omit<QuestionLibraryItem, 'id'>) => void;
  addSource: (source: Omit<MarketSource, 'id'>) => void;
  addCompetitor: (competitor: Omit<Competitor, 'id'>) => void;
  promoteQuestion: (texto: string, categoria: string, followUps: string[], targetScope: QuestionTargetScope, contextData?: QuestionPromotionContext) => void;
  resetToDemoData: () => void;
}

const RadarContext = createContext<RadarContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'VOR_STATE_V1';

export const RadarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [verticais, setVerticais] = useState<Vertical[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_VERT`);
    return saved ? JSON.parse(saved) : INITIAL_VERTICAIS;
  });

  const [organizacoes, setOrganizacoes] = useState<Organization[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ORGS`);
    return saved ? JSON.parse(saved) : INITIAL_ORGANIZACOES;
  });

  const [entrevistas, setEntrevistas] = useState<Interview[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ENTR`);
    return saved ? JSON.parse(saved) : INITIAL_ENTREVISTAS;
  });

  const [achados, setAchados] = useState<Finding[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ACH`);
    return saved ? JSON.parse(saved) : INITIAL_ACHADOS;
  });

  const [doresConsolidadas, setDoresConsolidadas] = useState<PainConsolidated[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_DOR`);
    return saved ? JSON.parse(saved) : INITIAL_DORES_CONSOLIDADAS;
  });

  const [ocorrenciasDores, setOcorrenciasDores] = useState<PainOccurrence[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_OCC`);
    return saved ? JSON.parse(saved) : INITIAL_PAIN_OCCURRENCES;
  });

  const [oportunidades, setOportunidades] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_OPP`);
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });

  const [perguntasBiblioteca, setPerguntasBiblioteca] = useState<QuestionLibraryItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_PERG`);
    return saved ? JSON.parse(saved) : INITIAL_QUESTION_LIBRARY;
  });

  const [fontes, setFontes] = useState<MarketSource[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_FONT`);
    return saved ? JSON.parse(saved) : INITIAL_FONTES;
  });

  const [concorrentes, setConcorrentes] = useState<Competitor[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_CONC`);
    return saved ? JSON.parse(saved) : INITIAL_CONCORRENTES;
  });

  const [crossVertical] = useState<CrossVerticalComparison[]>(INITIAL_CROSS_VERTICAL);

  // Guided Journey (1 to 18)
  const [currentJourneyStep, setCurrentJourneyStep] = useState<number>(1);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_VERT`, JSON.stringify(verticais));
  }, [verticais]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_ORGS`, JSON.stringify(organizacoes));
  }, [organizacoes]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_ENTR`, JSON.stringify(entrevistas));
  }, [entrevistas]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_ACH`, JSON.stringify(achados));
  }, [achados]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_DOR`, JSON.stringify(doresConsolidadas));
  }, [doresConsolidadas]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_OCC`, JSON.stringify(ocorrenciasDores));
  }, [ocorrenciasDores]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_OPP`, JSON.stringify(oportunidades));
  }, [oportunidades]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_PERG`, JSON.stringify(perguntasBiblioteca));
  }, [perguntasBiblioteca]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_FONT`, JSON.stringify(fontes));
  }, [fontes]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_CONC`, JSON.stringify(concorrentes));
  }, [concorrentes]);

  const addFinding = (f: Omit<Finding, 'id' | 'dataRegistro'>): Finding => {
    const newId = `ACH-${Date.now().toString().slice(-4)}`;
    const reviewStatus = f.reviewStatus || (f.natureza ? 'revisado' : 'pendente');
    const newFinding: Finding = {
      ...f,
      id: newId,
      reviewStatus,
      dataRegistro: new Date().toISOString().split('T')[0]
    };
    setAchados(prev => [newFinding, ...prev]);

    // Reforçar Evidence Chain (PRD Seção 4, 28, 29):
    // Achado REVISADO -> Ocorrência de Dor da Organização -> Dor Consolidada
    // Capturas PENDENTES (reviewStatus === 'pendente') NÃO geram nem alteram Ocorrência de Dor
    if (reviewStatus === 'revisado' && f.dorConsolidadaId && f.organizacaoId && f.natureza) {
      setOcorrenciasDores(prevOcc => {
        const existingIdx = prevOcc.findIndex(
          o => o.dorConsolidadaId === f.dorConsolidadaId && o.organizacaoId === f.organizacaoId
        );

        if (existingIdx >= 0) {
          const existing = prevOcc[existingIdx];
          const updatedAchados = existing.achadosIds.includes(newId)
            ? existing.achadosIds
            : [...existing.achadosIds, newId];

          const updatedOcc: PainOccurrence = {
            ...existing,
            achadosIds: updatedAchados
          };
          const copy = [...prevOcc];
          copy[existingIdx] = updatedOcc;
          return copy;
        } else {
          const newOcc: PainOccurrence = {
            id: `OCC-${Date.now().toString().slice(-4)}`,
            organizacaoId: f.organizacaoId!,
            dorConsolidadaId: f.dorConsolidadaId!,
            painScore: null,
            isMeasured: false,
            notasEspecificas: `Ocorrência registrada a partir do achado: ${f.titulo}`,
            achadosIds: [newId]
          };
          return [...prevOcc, newOcc];
        }
      });
    }

    // Se REVISADO e associado a uma dor consolidada com natureza definida, atualiza as referências da dor
    if (reviewStatus === 'revisado' && f.dorConsolidadaId && f.natureza) {
      setDoresConsolidadas(prev => prev.map(p => {
        if (p.id === f.dorConsolidadaId) {
          if (f.natureza === 'favoravel' && !p.evidenciasFavoraveisIds.includes(newId)) {
            return { ...p, evidenciasFavoraveisIds: [...p.evidenciasFavoraveisIds, newId] };
          }
          if (f.natureza === 'contraria' && !p.evidenciasContrariasIds.includes(newId)) {
            return { ...p, evidenciasContrariasIds: [...p.evidenciasContrariasIds, newId] };
          }
          if (f.natureza === 'neutra' && !p.evidenciasNeutrasIds.includes(newId)) {
            return { ...p, evidenciasNeutrasIds: [...p.evidenciasNeutrasIds, newId] };
          }
        }
        return p;
      }));
    }

    return newFinding;
  };

  const updateFinding = (updated: Finding) => {
    setAchados(prev => prev.map(f => f.id === updated.id ? updated : f));

    // Quando um Achado é promovido de Pendente para Revisado e possui Dor e Natureza, vincular na Ocorrência e Dor
    if (updated.reviewStatus === 'revisado' && updated.dorConsolidadaId && updated.organizacaoId && updated.natureza) {
      setOcorrenciasDores(prevOcc => {
        const existingIdx = prevOcc.findIndex(
          o => o.dorConsolidadaId === updated.dorConsolidadaId && o.organizacaoId === updated.organizacaoId
        );

        if (existingIdx >= 0) {
          const existing = prevOcc[existingIdx];
          const updatedAchados = existing.achadosIds.includes(updated.id)
            ? existing.achadosIds
            : [...existing.achadosIds, updated.id];

          const updatedOcc: PainOccurrence = {
            ...existing,
            achadosIds: updatedAchados
          };
          const copy = [...prevOcc];
          copy[existingIdx] = updatedOcc;
          return copy;
        } else {
          const newOcc: PainOccurrence = {
            id: `OCC-${Date.now().toString().slice(-4)}`,
            organizacaoId: updated.organizacaoId!,
            dorConsolidadaId: updated.dorConsolidadaId!,
            painScore: null,
            isMeasured: false,
            notasEspecificas: `Ocorrência registrada a partir do achado revisado: ${updated.titulo}`,
            achadosIds: [updated.id]
          };
          return [...prevOcc, newOcc];
        }
      });

      setDoresConsolidadas(prev => prev.map(p => {
        if (p.id === updated.dorConsolidadaId) {
          if (updated.natureza === 'favoravel' && !p.evidenciasFavoraveisIds.includes(updated.id)) {
            return { ...p, evidenciasFavoraveisIds: [...p.evidenciasFavoraveisIds, updated.id] };
          }
          if (updated.natureza === 'contraria' && !p.evidenciasContrariasIds.includes(updated.id)) {
            return { ...p, evidenciasContrariasIds: [...p.evidenciasContrariasIds, updated.id] };
          }
          if (updated.natureza === 'neutra' && !p.evidenciasNeutrasIds.includes(updated.id)) {
            return { ...p, evidenciasNeutrasIds: [...p.evidenciasNeutrasIds, updated.id] };
          }
        }
        return p;
      }));
    } else if (updated.reviewStatus === 'descartado') {
      // Garantir que captura descartada não permanece em ocorrências de dor nem evidencia composição
      setOcorrenciasDores(prevOcc => prevOcc.map(occ => ({
        ...occ,
        achadosIds: occ.achadosIds.filter(fId => fId !== updated.id)
      })));

      setDoresConsolidadas(prevDores => prevDores.map(p => ({
        ...p,
        evidenciasFavoraveisIds: p.evidenciasFavoraveisIds.filter(fId => fId !== updated.id),
        evidenciasContrariasIds: p.evidenciasContrariasIds.filter(fId => fId !== updated.id),
        evidenciasNeutrasIds: p.evidenciasNeutrasIds.filter(fId => fId !== updated.id)
      })));
    }
  };

  const deleteFinding = (id: string) => {
    setAchados(prev => prev.filter(f => f.id !== id));
    setEntrevistas(prev => prev.map(ent => ({
      ...ent,
      achadosGeradosIds: ent.achadosGeradosIds.filter(fId => fId !== id)
    })));
    setOcorrenciasDores(prev => prev.map(occ => ({
      ...occ,
      achadosIds: occ.achadosIds.filter(fId => fId !== id)
    })));
    setDoresConsolidadas(prev => prev.map(p => ({
      ...p,
      evidenciasFavoraveisIds: p.evidenciasFavoraveisIds.filter(fId => fId !== id),
      evidenciasContrariasIds: p.evidenciasContrariasIds.filter(fId => fId !== id),
      evidenciasNeutrasIds: p.evidenciasNeutrasIds.filter(fId => fId !== id)
    })));
  };

  const addPainOccurrence = (occ: Omit<PainOccurrence, 'id'>) => {
    const newId = `OCC-${Date.now().toString().slice(-4)}`;
    const newOcc: PainOccurrence = {
      ...occ,
      id: newId
    };
    setOcorrenciasDores(prev => [...prev, newOcc]);
  };

  const updatePainScore = (occurrenceId: string, breakdown: Omit<PainScoreBreakdown, 'total'>) => {
    const fullScore = calculatePainScore(breakdown);
    setOcorrenciasDores(prev => prev.map(occ => {
      if (occ.id === occurrenceId) {
        return {
          ...occ,
          painScore: fullScore,
          isMeasured: true
        };
      }
      return occ;
    }));
  };

  const addOrganization = (newOrg: Organization) => {
    setOrganizacoes(prev => [...prev, newOrg]);
  };

  const saveInterview = (saved: Interview) => {
    setEntrevistas(prev => {
      const idx = prev.findIndex(e => e.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  };

  const addQuestionToLibrary = (question: Omit<QuestionLibraryItem, 'id'>) => {
    const newQ: QuestionLibraryItem = {
      ...question,
      id: `Q-USR-${Date.now().toString().slice(-4)}`,
      criadaEm: new Date().toISOString().split('T')[0]
    };
    setPerguntasBiblioteca(prev => [newQ, ...prev]);
  };

  const addSource = (source: Omit<MarketSource, 'id'>) => {
    const newSrc: MarketSource = {
      ...source,
      id: `SRC-${Date.now().toString().slice(-4)}`
    };
    setFontes(prev => [newSrc, ...prev]);
  };

  const addCompetitor = (competitor: Omit<Competitor, 'id'>) => {
    const newComp: Competitor = {
      ...competitor,
      id: `COMP-${Date.now().toString().slice(-4)}`
    };
    setConcorrentes(prev => [newComp, ...prev]);
  };

  const promoteQuestion = (
    texto: string, 
    categoria: string, 
    followUps: string[], 
    targetScope: QuestionTargetScope, 
    contextData?: QuestionPromotionContext
  ) => {
    const orig = contextData?.originNote || (contextData?.interviewId ? `Entrevista ${contextData.interviewId}` : 'Pesquisa de campo');
    const prev = contextData?.previousScope || 'Entrevista';
    const dataStr = new Date().toLocaleDateString('pt-BR');

    const newQuestion: QuestionLibraryItem = {
      id: `Q-PROM-${Date.now().toString().slice(-4)}`,
      texto,
      categoria,
      escopo: targetScope,
      verticalId: (targetScope === 'vertical' || targetScope === 'subvertical' || targetScope === 'organizacao')
        ? contextData?.verticalId
        : undefined,
      subverticalId: targetScope === 'subvertical' ? contextData?.subverticalId : undefined,
      organizacaoId: targetScope === 'organizacao' ? contextData?.organizacaoId : undefined,
      followUps,
      criadaEm: new Date().toISOString().split('T')[0],
      historicoPromocao: `Criada em ${orig}. Promovida de ${prev} para ${targetScope.toUpperCase()} em ${dataStr}.`
    };
    setPerguntasBiblioteca(prev => [newQuestion, ...prev]);
  };

  const resetToDemoData = () => {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_VERT`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_ORGS`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_ENTR`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_ACH`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_DOR`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_OCC`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_OPP`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_PERG`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_FONT`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_CONC`);

    setVerticais(INITIAL_VERTICAIS);
    setOrganizacoes(INITIAL_ORGANIZACOES);
    setEntrevistas(INITIAL_ENTREVISTAS);
    setAchados(INITIAL_ACHADOS);
    setDoresConsolidadas(INITIAL_DORES_CONSOLIDADAS);
    setOcorrenciasDores(INITIAL_PAIN_OCCURRENCES);
    setOportunidades(INITIAL_OPPORTUNITIES);
    setPerguntasBiblioteca(INITIAL_QUESTION_LIBRARY);
    setFontes(INITIAL_FONTES);
    setConcorrentes(INITIAL_CONCORRENTES);
    setCurrentJourneyStep(1);
  };

  const jumpToJourneyStep = (step: number) => {
    setCurrentJourneyStep(step);
  };

  return (
    <RadarContext.Provider value={{
      verticais,
      organizacoes,
      entrevistas,
      achados,
      doresConsolidadas,
      ocorrenciasDores,
      oportunidades,
      perguntasBiblioteca,
      fontes,
      concorrentes,
      crossVertical,
      currentJourneyStep,
      setCurrentJourneyStep,
      jumpToJourneyStep,
      addFinding,
      updateFinding,
      deleteFinding,
      addPainOccurrence,
      updatePainScore,
      addOrganization,
      saveInterview,
      addQuestionToLibrary,
      addSource,
      addCompetitor,
      promoteQuestion,
      resetToDemoData,
    }}>
      {children}
    </RadarContext.Provider>
  );
};

export const useRadar = () => {
  const context = useContext(RadarContext);
  if (!context) {
    throw new Error('useRadar must be used within a RadarProvider');
  }
  return context;
};
