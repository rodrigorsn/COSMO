import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RadarProvider, useRadar } from './RadarContext';
import {
  INITIAL_ACHADOS,
  INITIAL_CONCORRENTES,
  INITIAL_DORES_CONSOLIDADAS,
  INITIAL_ENTREVISTAS,
  INITIAL_FONTES,
  INITIAL_ORGANIZACOES,
  INITIAL_OPPORTUNITIES,
  INITIAL_PAIN_OCCURRENCES,
  INITIAL_QUESTION_LIBRARY,
  INITIAL_VERTICAIS,
} from '../data/initialData';

type RadarApi = ReturnType<typeof useRadar>;

function RadarProbe({ onReady }: { onReady: (ctx: RadarApi) => void }) {
  const ctx = useRadar();
  onReady(ctx);
  return null;
}

function renderRadar(): () => RadarApi {
  let latest!: RadarApi;
  render(
    <RadarProvider>
      <RadarProbe
        onReady={(ctx) => {
          latest = ctx;
        }}
      />
    </RadarProvider>
  );
  return () => latest;
}

const FIXED_NOW = new Date('2026-09-13T10:00:00.000Z');

afterEach(() => {
  vi.useRealTimers();
});

describe('RadarContext finding lifecycle', () => {
  it('leaves existing occurrences and consolidated evidence unchanged while a finding stays pendente', () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    const getCtx = renderRadar();

    const occurrencesBefore = JSON.stringify(getCtx().ocorrenciasDores);
    const painsBefore = JSON.stringify(getCtx().doresConsolidadas);

    act(() => {
      getCtx().addFinding({
        titulo: 'Achado aguardando triagem',
        descricao: 'Captura de campo ainda não revisada.',
        origem: 'Entrevista',
        tipoEvidencia: 'evidencia_observada',
        organizacaoId: 'ORG-CONT-001',
        categoria: 'Teste',
        fraseOriginal: 'frase original de teste',
        interpretacao: 'interpretação de teste',
        tags: [],
        dorConsolidadaId: 'DOR-CONT-004',
      });
    });

    expect(JSON.stringify(getCtx().ocorrenciasDores)).toBe(occurrencesBefore);
    expect(JSON.stringify(getCtx().doresConsolidadas)).toBe(painsBefore);
  });

  it('creates then updates exactly one occurrence, without duplicating IDs, when findings become revisado for the same pain and organization', () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    const getCtx = renderRadar();

    act(() => {
      getCtx().addFinding({
        titulo: 'Primeira confirmação revisada',
        descricao: 'Confirmação inicial da dor.',
        origem: 'Entrevista',
        tipoEvidencia: 'evidencia_observada',
        reviewStatus: 'revisado',
        natureza: 'favoravel',
        organizacaoId: 'ORG-CONT-001',
        categoria: 'Teste',
        fraseOriginal: 'frase 1',
        interpretacao: 'interpretacao 1',
        tags: [],
        dorConsolidadaId: 'DOR-CONT-004',
      });
    });

    const afterFirst = getCtx().ocorrenciasDores.filter(
      (o) => o.dorConsolidadaId === 'DOR-CONT-004' && o.organizacaoId === 'ORG-CONT-001'
    );
    expect(afterFirst).toHaveLength(1);
    expect(afterFirst[0].achadosIds).toHaveLength(1);
    const occurrenceId = afterFirst[0].id;

    vi.setSystemTime(new Date(FIXED_NOW.getTime() + 1000));

    act(() => {
      getCtx().addFinding({
        titulo: 'Segunda confirmação revisada',
        descricao: 'Confirmação adicional da mesma dor.',
        origem: 'Entrevista',
        tipoEvidencia: 'evidencia_observada',
        reviewStatus: 'revisado',
        natureza: 'favoravel',
        organizacaoId: 'ORG-CONT-001',
        categoria: 'Teste',
        fraseOriginal: 'frase 2',
        interpretacao: 'interpretacao 2',
        tags: [],
        dorConsolidadaId: 'DOR-CONT-004',
      });
    });

    const afterSecond = getCtx().ocorrenciasDores.filter(
      (o) => o.dorConsolidadaId === 'DOR-CONT-004' && o.organizacaoId === 'ORG-CONT-001'
    );
    expect(afterSecond).toHaveLength(1);
    expect(afterSecond[0].id).toBe(occurrenceId);
    expect(afterSecond[0].achadosIds).toHaveLength(2);
    expect(new Set(afterSecond[0].achadosIds).size).toBe(2);
  });

  it('removes only the discarded finding contribution from occurrences and consolidated evidence', () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    const getCtx = renderRadar();

    const original = getCtx().achados.find((f) => f.id === 'ACH-001');
    if (!original) {
      throw new Error('Fixture ACH-001 not found in canonical demo data');
    }

    act(() => {
      getCtx().updateFinding({ ...original, reviewStatus: 'descartado', motivoDescarte: 'Duplicado' });
    });

    const occurrence = getCtx().ocorrenciasDores.find((o) => o.id === 'OCC-001-01');
    expect(occurrence?.achadosIds).not.toContain('ACH-001');
    expect(occurrence?.achadosIds).toEqual(expect.arrayContaining(['ACH-002', 'ACH-003', 'ACH-004']));

    const painCont001 = getCtx().doresConsolidadas.find((p) => p.id === 'DOR-CONT-001');
    expect(painCont001?.evidenciasFavoraveisIds).not.toContain('ACH-001');
    expect(painCont001?.evidenciasFavoraveisIds).toEqual(
      expect.arrayContaining(['ACH-002', 'ACH-003', 'ACH-004', 'ACH-006'])
    );

    const painCont002 = getCtx().doresConsolidadas.find((p) => p.id === 'DOR-CONT-002');
    expect(painCont002?.evidenciasFavoraveisIds).toEqual(['ACH-007']);
  });

  it('removes all ten COSMO storage keys on reset and restores canonical state before persistence effects run again', () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
    const getCtx = renderRadar();

    act(() => {
      getCtx().addFinding({
        titulo: 'Achado antes do reset',
        descricao: 'Estado mutado antes de restaurar os dados canônicos.',
        origem: 'Entrevista',
        tipoEvidencia: 'evidencia_observada',
        organizacaoId: 'ORG-CONT-001',
        categoria: 'Teste',
        fraseOriginal: 'frase de teste',
        interpretacao: 'interpretacao de teste',
        tags: [],
      });
    });

    removeItemSpy.mockClear();

    act(() => {
      getCtx().resetToDemoData();
    });

    const canonicalByKey: [string, unknown][] = [
      ['VOR_STATE_V1_VERT', INITIAL_VERTICAIS],
      ['VOR_STATE_V1_ORGS', INITIAL_ORGANIZACOES],
      ['VOR_STATE_V1_ENTR', INITIAL_ENTREVISTAS],
      ['VOR_STATE_V1_ACH', INITIAL_ACHADOS],
      ['VOR_STATE_V1_DOR', INITIAL_DORES_CONSOLIDADAS],
      ['VOR_STATE_V1_OCC', INITIAL_PAIN_OCCURRENCES],
      ['VOR_STATE_V1_OPP', INITIAL_OPPORTUNITIES],
      ['VOR_STATE_V1_PERG', INITIAL_QUESTION_LIBRARY],
      ['VOR_STATE_V1_FONT', INITIAL_FONTES],
      ['VOR_STATE_V1_CONC', INITIAL_CONCORRENTES],
    ];

    expect(removeItemSpy.mock.calls.map(([key]) => key).sort()).toEqual(
      canonicalByKey.map(([key]) => key).sort()
    );

    expect(getCtx().verticais).toEqual(INITIAL_VERTICAIS);
    expect(getCtx().organizacoes).toEqual(INITIAL_ORGANIZACOES);
    expect(getCtx().entrevistas).toEqual(INITIAL_ENTREVISTAS);
    expect(getCtx().achados).toEqual(INITIAL_ACHADOS);
    expect(getCtx().doresConsolidadas).toEqual(INITIAL_DORES_CONSOLIDADAS);
    expect(getCtx().ocorrenciasDores).toEqual(INITIAL_PAIN_OCCURRENCES);
    expect(getCtx().oportunidades).toEqual(INITIAL_OPPORTUNITIES);
    expect(getCtx().perguntasBiblioteca).toEqual(INITIAL_QUESTION_LIBRARY);
    expect(getCtx().fontes).toEqual(INITIAL_FONTES);
    expect(getCtx().concorrentes).toEqual(INITIAL_CONCORRENTES);

    // The mutated collection's persistence effect fires again after the reset
    // (its reference changed), proving the removal does not block canonical
    // data from being written back to storage.
    expect(JSON.parse(localStorage.getItem('VOR_STATE_V1_ACH') ?? 'null')).toEqual(INITIAL_ACHADOS);

    removeItemSpy.mockRestore();
  });
});
