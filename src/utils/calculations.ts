import { 
  PainScoreBreakdown, 
  OperationsGapScoreBreakdown, 
  OpportunityScoreBreakdown, 
  PainOccurrence, 
  Finding,
  EvidenceLevel,
  Organization
} from '../types/radar';

export function calculatePainScore(breakdown: Omit<PainScoreBreakdown, 'total'>): PainScoreBreakdown {
  const total = Math.min(
    25,
    Math.max(
      0,
      breakdown.frequencia +
      breakdown.tempoCusto +
      breakdown.severidade +
      breakdown.manualidade +
      breakdown.repetibilidade
    )
  );
  return {
    ...breakdown,
    total,
  };
}

export function calculateOGS(breakdown: Omit<OperationsGapScoreBreakdown, 'total'>): OperationsGapScoreBreakdown {
  const total = Math.min(
    40,
    Math.max(
      0,
      breakdown.interacaoCliente +
      breakdown.trocaDocumentos +
      breakdown.pendencias +
      breakdown.prazos +
      breakdown.aprovacoes +
      breakdown.comunicacaoExterna +
      breakdown.trabalhoForaSoftware +
      breakdown.multiplicadorClientes
    )
  );
  return {
    ...breakdown,
    total,
  };
}

export function calculateOpportunityScore(breakdown: Omit<OpportunityScoreBreakdown, 'total'>): OpportunityScoreBreakdown {
  const total = Math.min(
    100,
    Math.max(
      0,
      breakdown.mercado +
      breakdown.dor +
      breakdown.operationsGap +
      breakdown.economia +
      breakdown.gtm
    )
  );
  return {
    ...breakdown,
    total,
  };
}

export function isPainScoreMeasured(occ: PainOccurrence): boolean {
  if (occ.isMeasured === false) return false;
  if (!occ.painScore) return false;
  return typeof occ.painScore.total === 'number';
}

export interface PainConsolidationStats {
  totalOrgsVertical: number;
  orgsComDor: number;
  incidenciaPercent: number;
  media: number;
  mediana: number;
  minimo: number;
  maximo: number;
  ocorrenciasMensuradasCount: number;
  totalEvidencias: number;
  evidenciasFavoraveis: number;
  evidenciasContrarias: number;
  evidenciasNeutras: number;
  dadosSuficientes: boolean;
  amostraLimitada: boolean;
  alertaAmostra?: string;
}

export function calculatePainConsolidation(
  painId: string,
  occurrences: PainOccurrence[],
  verticalOrgsCount: number,
  findings: Finding[]
): PainConsolidationStats {
  const relevantOccurrences = occurrences.filter(o => o.dorConsolidadaId === painId);
  // Cálculo rigoroso da incidência: contagem de organizações ÚNICAS (PRD Seção 30)
  const uniqueOrgIds = Array.from(new Set(relevantOccurrences.map(o => o.organizacaoId).filter(Boolean)));
  const orgsComDor = uniqueOrgIds.length;

  const relevantFindings = findings.filter(f => f.dorConsolidadaId === painId);
  const fav = relevantFindings.filter(f => f.natureza === 'favoravel').length;
  const con = relevantFindings.filter(f => f.natureza === 'contraria').length;
  const neu = relevantFindings.filter(f => f.natureza === 'neutra').length;
  
  if (verticalOrgsCount === 0 || orgsComDor === 0) {
    return {
      totalOrgsVertical: verticalOrgsCount,
      orgsComDor: 0,
      incidenciaPercent: 0,
      media: 0,
      mediana: 0,
      minimo: 0,
      maximo: 0,
      ocorrenciasMensuradasCount: 0,
      totalEvidencias: 0,
      evidenciasFavoraveis: 0,
      evidenciasContrarias: 0,
      evidenciasNeutras: 0,
      dadosSuficientes: false,
      amostraLimitada: true,
      alertaAmostra: 'Nenhuma organização registrada com esta dor na vertical.',
    };
  }

  // Filtrar APENAS ocorrências com Pain Score conscientemente mensurado (Seção 29)
  const measuredOccurrences = relevantOccurrences.filter(isPainScoreMeasured);
  const scores = measuredOccurrences.map(o => o.painScore!.total).sort((a, b) => a - b);
  const hasMeasured = scores.length > 0;

  let media = 0;
  let mediana = 0;
  let minimo = 0;
  let maximo = 0;

  if (hasMeasured) {
    const sum = scores.reduce((acc, s) => acc + s, 0);
    media = parseFloat((sum / scores.length).toFixed(1));
    
    const mid = Math.floor(scores.length / 2);
    if (scores.length % 2 === 0) {
      mediana = parseFloat(((scores[mid - 1] + scores[mid]) / 2).toFixed(1));
    } else {
      mediana = scores[mid];
    }

    minimo = scores[0];
    maximo = scores[scores.length - 1];
  }

  const amostraLimitada = verticalOrgsCount < 5 || orgsComDor < 3;
  const dadosSuficientes = verticalOrgsCount >= 3 && orgsComDor >= 2 && hasMeasured;
  const alertaAmostra = amostraLimitada
    ? `Amostra limitada: ${orgsComDor} de ${verticalOrgsCount} organização(ões) pesquisada(s). Percentual preliminar sujeito a validação em campo.`
    : undefined;

  return {
    totalOrgsVertical: verticalOrgsCount,
    orgsComDor,
    incidenciaPercent: Math.round((orgsComDor / verticalOrgsCount) * 100),
    media,
    mediana,
    minimo,
    maximo,
    ocorrenciasMensuradasCount: scores.length,
    totalEvidencias: relevantFindings.length,
    evidenciasFavoraveis: fav,
    evidenciasContrarias: con,
    evidenciasNeutras: neu,
    dadosSuficientes,
    amostraLimitada,
    alertaAmostra,
  };
}

export function calculateOrgMaturity(org: Organization, interviewsCount: number, findingsCount: number, painsCount: number): {
  scorePercent: number;
  perfil: 'Completo' | 'Parcial' | 'Não iniciado';
  stack: 'Completo' | 'Parcial' | 'Não iniciado';
  interviewsText: string;
  processesText: string;
  painsText: string;
  findingsText: string;
} {
  let score = 0;
  
  // Perfil (max 20)
  const hasProfile = org.numFuncionarios > 0 && org.numClientes > 0 && org.especializacao;
  const perfilStatus = hasProfile ? 'Completo' : (org.numFuncionarios > 0 ? 'Parcial' : 'Não iniciado');
  if (perfilStatus === 'Completo') score += 20;
  else if (perfilStatus === 'Parcial') score += 10;

  // Stack (max 20)
  const stackStatus = org.stackTecnologico.length >= 3 ? 'Completo' : (org.stackTecnologico.length > 0 ? 'Parcial' : 'Não iniciado');
  if (stackStatus === 'Completo') score += 20;
  else if (stackStatus === 'Parcial') score += 10;

  // Entrevistas (max 20)
  if (interviewsCount >= 2) score += 20;
  else if (interviewsCount === 1) score += 12;

  // Processos (max 15)
  if (org.processos.length >= 2) score += 15;
  else if (org.processos.length === 1) score += 8;

  // Dores (max 15)
  if (painsCount >= 2) score += 15;
  else if (painsCount === 1) score += 8;

  // Evidências/Achados (max 10)
  if (findingsCount >= 3) score += 10;
  else if (findingsCount > 0) score += 5;

  return {
    scorePercent: Math.min(100, score),
    perfil: perfilStatus,
    stack: stackStatus,
    interviewsText: `${interviewsCount} realizadas`,
    processesText: `${org.processos.length} mapeados`,
    painsText: `${painsCount} identificadas`,
    findingsText: `${findingsCount} registradas`,
  };
}

/**
 * Evaluates Evidence Level adhering to Section 35 and Section 36 of PRD:
 * H0 - Suposição (nenhuma evidência externa)
 * H1 - Evidência externa (pesquisa, review)
 * H2 - Evidência individual (1 organização confirma)
 * H3 - Padrão (MÚLTIPLAS organizações INDEPENDENTES confirmam)
 * H4 - Evidência econômica (gastam tempo/dinheiro/pessoas)
 * H5 - Evidência comercial (piloto pago / teste concreto aceito)
 */
export function evaluateEvidenceLevel(
  independentOrgsCount: number,
  hasExternalSource: boolean,
  hasEconomicSpendingEvidence: boolean,
  hasCommercialCommitment: boolean
): EvidenceLevel {
  if (hasCommercialCommitment) return 'H5';
  if (hasEconomicSpendingEvidence) return 'H4';
  if (independentOrgsCount >= 2) return 'H3';
  if (independentOrgsCount === 1) return 'H2';
  if (hasExternalSource) return 'H1';
  return 'H0';
}
