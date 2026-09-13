import { describe, expect, it } from 'vitest';
import {
  calculateOGS,
  calculateOpportunityScore,
  calculateOrgMaturity,
  calculatePainConsolidation,
  calculatePainScore,
  evaluateEvidenceLevel,
  isPainScoreMeasured,
} from './calculations';
import {
  Finding,
  Interview,
  Organization,
  PainOccurrence,
  PainScoreBreakdown,
  ProcessMap,
  TechStackItem,
} from '../types/radar';

function buildOrganization(overrides: Partial<Organization> = {}): Organization {
  return {
    id: 'ORG-TEST-001',
    nome: 'Organização de teste',
    verticalId: 'VERT-TEST',
    cidade: 'Cidade de teste',
    estado: 'UF',
    regiao: 'Região de teste',
    dataInclusao: '2026-01-01',
    statusPesquisa: 'Em contato',
    numFuncionarios: 0,
    numClientes: 0,
    anosOperacao: 0,
    especializacao: '',
    perfilClientes: '',
    quantidadeUnidades: 1,
    estruturaEquipe: '',
    observacoes: '',
    stackTecnologico: [],
    processos: [],
    entrevistados: [],
    operationsGapScore: {
      interacaoCliente: 0,
      trocaDocumentos: 0,
      pendencias: 0,
      prazos: 0,
      aprovacoes: 0,
      comunicacaoExterna: 0,
      trabalhoForaSoftware: 0,
      multiplicadorClientes: 0,
      total: 0,
    },
    ...overrides,
  };
}

function buildStackItem(id: string): TechStackItem {
  return {
    id,
    nome: 'Ferramenta de teste',
    categoria: 'Outro',
    finalidade: 'Uso de teste',
    quemUtiliza: 'Equipe de teste',
    frequencia: 'Diária',
    satisfacaoPercebida: 3,
    limitacoes: 'Nenhuma relevante para o teste',
    processosAtendidos: [],
    oQueAconteceFora: 'Nada relevante para o teste',
  };
}

function buildProcess(id: string): ProcessMap {
  return {
    id,
    organizacaoId: 'ORG-TEST-001',
    nome: 'Processo de teste',
    area: 'Operações',
    descricao: 'Processo usado apenas para exercitar o teste',
    inicioProcesso: 'Solicitação do cliente',
    resultadoEsperado: 'Conclusão do processo',
    frequencia: 'Mensal',
    volumeEstimado: 'Baixo',
    pessoasEnvolvidas: 1,
    clientesAfetados: 1,
    tempoEstimadoHorasMes: 1,
    ferramentas: [],
    etapas: [],
    gargalos: '',
    errosERetrabalho: '',
    dependenciasExternas: '',
    observacoes: '',
  };
}

function buildFinding(overrides: Partial<Finding> & Pick<Finding, 'id'>): Finding {
  return {
    titulo: 'Achado de teste',
    descricao: 'Descrição de teste',
    origem: 'Entrevista',
    tipoEvidencia: 'evidencia_observada',
    categoria: 'Teste',
    fraseOriginal: 'frase original de teste',
    interpretacao: 'interpretação de teste',
    tags: [],
    dataRegistro: '2026-01-01',
    ...overrides,
  };
}

function buildOccurrence(
  overrides: Partial<PainOccurrence> & Pick<PainOccurrence, 'id' | 'dorConsolidadaId' | 'organizacaoId'>
): PainOccurrence {
  return {
    achadosIds: [],
    notasEspecificas: '',
    ...overrides,
  };
}

function buildInterview(overrides: Partial<Interview> & Pick<Interview, 'id' | 'organizacaoId'>): Interview {
  return {
    entrevistadoId: 'ENTR-TEST',
    verticalId: 'VERT-TEST',
    data: '2026-01-01',
    duracaoMinutos: 30,
    tipo: 'Descoberta',
    formato: 'Individual',
    status: 'Concluída',
    perguntas: [],
    notasGerais: '',
    achadosGeradosIds: [],
    ...overrides,
  };
}

function measuredScore(total: number): PainScoreBreakdown {
  return { frequencia: 0, tempoCusto: 0, severidade: 0, manualidade: 0, repetibilidade: 0, total };
}

describe('calculatePainScore', () => {
  it('sums the five components for a nominal in-range breakdown', () => {
    const result = calculatePainScore({
      frequencia: 3,
      tempoCusto: 4,
      severidade: 5,
      manualidade: 2,
      repetibilidade: 1,
    });
    expect(result.total).toBe(15);
  });

  it('clamps a negative sum to the zero lower bound', () => {
    const result = calculatePainScore({
      frequencia: -10,
      tempoCusto: 0,
      severidade: 0,
      manualidade: 0,
      repetibilidade: 0,
    });
    expect(result.total).toBe(0);
  });

  it('clamps a sum above 25 to the upper bound', () => {
    const result = calculatePainScore({
      frequencia: 10,
      tempoCusto: 10,
      severidade: 10,
      manualidade: 10,
      repetibilidade: 10,
    });
    expect(result.total).toBe(25);
  });
});

describe('calculateOGS', () => {
  it('sums the eight components for a nominal in-range breakdown', () => {
    const result = calculateOGS({
      interacaoCliente: 3,
      trocaDocumentos: 2,
      pendencias: 4,
      prazos: 1,
      aprovacoes: 5,
      comunicacaoExterna: 2,
      trabalhoForaSoftware: 3,
      multiplicadorClientes: 0,
    });
    expect(result.total).toBe(20);
  });

  it('clamps a negative sum to the zero lower bound', () => {
    const result = calculateOGS({
      interacaoCliente: -5,
      trocaDocumentos: -5,
      pendencias: -5,
      prazos: -5,
      aprovacoes: -5,
      comunicacaoExterna: -5,
      trabalhoForaSoftware: -5,
      multiplicadorClientes: -5,
    });
    expect(result.total).toBe(0);
  });

  it('clamps a sum above 40 to the upper bound', () => {
    const result = calculateOGS({
      interacaoCliente: 10,
      trocaDocumentos: 10,
      pendencias: 10,
      prazos: 10,
      aprovacoes: 10,
      comunicacaoExterna: 10,
      trabalhoForaSoftware: 10,
      multiplicadorClientes: 10,
    });
    expect(result.total).toBe(40);
  });
});

describe('calculateOpportunityScore', () => {
  it('sums the five components for a nominal in-range breakdown', () => {
    const result = calculateOpportunityScore({
      mercado: 10,
      dor: 15,
      operationsGap: 15,
      economia: 10,
      gtm: 5,
    });
    expect(result.total).toBe(55);
  });

  it('clamps a negative sum to the zero lower bound', () => {
    const result = calculateOpportunityScore({
      mercado: -50,
      dor: -50,
      operationsGap: -50,
      economia: -50,
      gtm: -50,
    });
    expect(result.total).toBe(0);
  });

  it('clamps a sum above 100 to the upper bound', () => {
    const result = calculateOpportunityScore({
      mercado: 100,
      dor: 100,
      operationsGap: 100,
      economia: 100,
      gtm: 100,
    });
    expect(result.total).toBe(100);
  });
});

describe('isPainScoreMeasured', () => {
  it('returns false when isMeasured is explicitly false, regardless of the score', () => {
    const occ = buildOccurrence({
      id: 'OCC-1',
      dorConsolidadaId: 'PAIN-1',
      organizacaoId: 'ORG-1',
      isMeasured: false,
      painScore: measuredScore(20),
    });
    expect(isPainScoreMeasured(occ)).toBe(false);
  });

  it('returns false when the pain score is missing', () => {
    const occ = buildOccurrence({
      id: 'OCC-2',
      dorConsolidadaId: 'PAIN-1',
      organizacaoId: 'ORG-1',
      painScore: null,
    });
    expect(isPainScoreMeasured(occ)).toBe(false);
  });

  it('returns true for a valid score explicitly flagged as measured', () => {
    const occ = buildOccurrence({
      id: 'OCC-3',
      dorConsolidadaId: 'PAIN-1',
      organizacaoId: 'ORG-1',
      isMeasured: true,
      painScore: measuredScore(18),
    });
    expect(isPainScoreMeasured(occ)).toBe(true);
  });

  it('returns true for a valid score with no isMeasured flag (legacy occurrence)', () => {
    const occ = buildOccurrence({
      id: 'OCC-4',
      dorConsolidadaId: 'PAIN-1',
      organizacaoId: 'ORG-1',
      painScore: measuredScore(12),
    });
    expect(isPainScoreMeasured(occ)).toBe(true);
  });
});

describe('calculateOrgMaturity', () => {
  it('reports the not-started thresholds when no dimension has data', () => {
    const org = buildOrganization();
    const result = calculateOrgMaturity(org, 0, 0, 0);
    expect(result.scorePercent).toBe(0);
    expect(result.perfil).toBe('Não iniciado');
    expect(result.stack).toBe('Não iniciado');
  });

  it('reports the partial thresholds when every dimension is partially filled', () => {
    const org = buildOrganization({
      numFuncionarios: 5,
      numClientes: 0,
      especializacao: 'Especialização de teste',
      stackTecnologico: [buildStackItem('STK-1')],
      processos: [buildProcess('PROC-1')],
    });
    const result = calculateOrgMaturity(org, 1, 1, 1);
    expect(result.scorePercent).toBe(53);
    expect(result.perfil).toBe('Parcial');
    expect(result.stack).toBe('Parcial');
  });

  it('reports the complete thresholds when every dimension is fully filled', () => {
    const org = buildOrganization({
      numFuncionarios: 10,
      numClientes: 50,
      especializacao: 'Especialização de teste',
      stackTecnologico: [buildStackItem('STK-1'), buildStackItem('STK-2'), buildStackItem('STK-3')],
      processos: [buildProcess('PROC-1'), buildProcess('PROC-2')],
    });
    const result = calculateOrgMaturity(org, 2, 3, 2);
    expect(result.scorePercent).toBe(100);
    expect(result.perfil).toBe('Completo');
    expect(result.stack).toBe('Completo');
  });
});

describe('evaluateEvidenceLevel', () => {
  it('returns H5 when a commercial commitment exists, even with every other signal present', () => {
    expect(evaluateEvidenceLevel(5, true, true, true)).toBe('H5');
  });

  it('returns H4 when economic spending evidence exists without a commercial commitment', () => {
    expect(evaluateEvidenceLevel(5, true, true, false)).toBe('H4');
  });

  it('returns H3 when two or more independent organizations confirm without economic evidence', () => {
    expect(evaluateEvidenceLevel(2, true, false, false)).toBe('H3');
  });

  it('returns H2 when exactly one independent organization confirms', () => {
    expect(evaluateEvidenceLevel(1, true, false, false)).toBe('H2');
  });

  it('returns H1 when only an external source supports the claim', () => {
    expect(evaluateEvidenceLevel(0, true, false, false)).toBe('H1');
  });

  it('returns H0 when no evidence signal is present', () => {
    expect(evaluateEvidenceLevel(0, false, false, false)).toBe('H0');
  });
});

describe('calculatePainConsolidation', () => {
  it('returns the documented zero-sample fallback when the vertical has no organizations', () => {
    const result = calculatePainConsolidation('PAIN-EMPTY', [], 0, []);
    expect(result).toEqual({
      totalOrgsVertical: 0,
      totalAmostraInvestigada: 0,
      orgsComDor: 0,
      orgsFavoraveisCount: 0,
      orgsContrariasCount: 0,
      orgsNeutrasCount: 0,
      incidenciaPercent: 0,
      incidenciaFavoravelPercent: 0,
      incidenciaContrariaPercent: 0,
      incidenciaNeutraPercent: 0,
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
      alertaAmostra: 'Nenhuma organização registrada na amostra desta vertical.',
    });
  });

  it('falls back to the vertical organization count when no interviews are supplied', () => {
    const occurrence = buildOccurrence({ id: 'OCC-FB', dorConsolidadaId: 'PAIN-FB', organizacaoId: 'ORG-A' });
    const result = calculatePainConsolidation('PAIN-FB', [occurrence], 4, []);
    expect(result.totalAmostraInvestigada).toBe(4);
    expect(result.orgsComDor).toBe(1);
    expect(result.incidenciaPercent).toBe(25);
  });

  it('derives the investigated sample from concluded interviews inside the vertical', () => {
    const verticalOrgs = [buildOrganization({ id: 'ORG-A' }), buildOrganization({ id: 'ORG-B' })];
    const interviews: Interview[] = [
      buildInterview({ id: 'INT-1', organizacaoId: 'ORG-A', status: 'Concluída' }),
      buildInterview({ id: 'INT-2', organizacaoId: 'ORG-B', status: 'Concluída' }),
      buildInterview({ id: 'INT-3', organizacaoId: 'ORG-C', status: 'Concluída' }),
      buildInterview({ id: 'INT-4', organizacaoId: 'ORG-A', status: 'Agendada' }),
    ];
    const result = calculatePainConsolidation('PAIN-INV', [], 10, [], interviews, verticalOrgs);
    expect(result.totalAmostraInvestigada).toBe(2);
  });

  it('counts only revisado findings with a defined natureza as evidence', () => {
    const findings: Finding[] = [
      buildFinding({ id: 'ACH-OK', reviewStatus: 'revisado', natureza: 'favoravel', dorConsolidadaId: 'PAIN-EV', organizacaoId: 'ORG-A' }),
      buildFinding({ id: 'ACH-PEND', reviewStatus: 'pendente', natureza: 'favoravel', dorConsolidadaId: 'PAIN-EV', organizacaoId: 'ORG-B' }),
      buildFinding({ id: 'ACH-DISC', reviewStatus: 'descartado', natureza: 'favoravel', dorConsolidadaId: 'PAIN-EV', organizacaoId: 'ORG-C' }),
      buildFinding({ id: 'ACH-NONATURE', reviewStatus: 'revisado', dorConsolidadaId: 'PAIN-EV', organizacaoId: 'ORG-D' }),
    ];
    const result = calculatePainConsolidation('PAIN-EV', [], 4, findings);
    expect(result.totalEvidencias).toBe(1);
    expect(result.evidenciasFavoraveis).toBe(1);
  });

  it('counts organizations with the pain once, even with multiple occurrences from the same organization', () => {
    const occurrences: PainOccurrence[] = [
      buildOccurrence({ id: 'OCC-1', dorConsolidadaId: 'PAIN-UNIQ', organizacaoId: 'ORG-A' }),
      buildOccurrence({ id: 'OCC-2', dorConsolidadaId: 'PAIN-UNIQ', organizacaoId: 'ORG-A' }),
      buildOccurrence({ id: 'OCC-3', dorConsolidadaId: 'PAIN-UNIQ', organizacaoId: 'ORG-B' }),
    ];
    const result = calculatePainConsolidation('PAIN-UNIQ', occurrences, 5, []);
    expect(result.orgsComDor).toBe(2);
  });

  it('computes the median as the average of the two middle values for an even sample', () => {
    const occurrences = [10, 20, 14, 16].map((total, index) =>
      buildOccurrence({
        id: `OCC-EVEN-${index}`,
        dorConsolidadaId: 'PAIN-MED-EVEN',
        organizacaoId: `ORG-${index}`,
        isMeasured: true,
        painScore: measuredScore(total),
      })
    );
    const result = calculatePainConsolidation('PAIN-MED-EVEN', occurrences, 4, []);
    expect(result.mediana).toBe(15);
    expect(result.media).toBe(15);
  });

  it('computes the median as the middle value for an odd sample', () => {
    const occurrences = [5, 25, 15].map((total, index) =>
      buildOccurrence({
        id: `OCC-ODD-${index}`,
        dorConsolidadaId: 'PAIN-MED-ODD',
        organizacaoId: `ORG-${index}`,
        isMeasured: true,
        painScore: measuredScore(total),
      })
    );
    const result = calculatePainConsolidation('PAIN-MED-ODD', occurrences, 3, []);
    expect(result.mediana).toBe(15);
    expect(result.media).toBe(15);
  });

  it('marks data as sufficient and not sample-limited once thresholds are met', () => {
    const painId = 'PAIN-SUFF';
    const orgs = ['A', 'B', 'C', 'D', 'E'].map((letter) => buildOrganization({ id: `ORG-${letter}` }));
    const interviews = orgs.map((org) =>
      buildInterview({ id: `INT-${org.id}`, organizacaoId: org.id, status: 'Concluída' })
    );
    const findings = ['A', 'B', 'C'].map((letter) =>
      buildFinding({
        id: `ACH-${letter}`,
        reviewStatus: 'revisado',
        natureza: 'favoravel',
        organizacaoId: `ORG-${letter}`,
        dorConsolidadaId: painId,
      })
    );
    const occurrences = [
      buildOccurrence({
        id: 'OCC-SUFF-A',
        dorConsolidadaId: painId,
        organizacaoId: 'ORG-A',
        isMeasured: true,
        painScore: measuredScore(12),
      }),
    ];

    const result = calculatePainConsolidation(painId, occurrences, 5, findings, interviews, orgs);

    expect(result.dadosSuficientes).toBe(true);
    expect(result.amostraLimitada).toBe(false);
  });
});
