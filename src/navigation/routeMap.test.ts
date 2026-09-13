import { describe, expect, it } from 'vitest';
import {
  getInterviewDetailRoute,
  getOpportunityDetailRoute,
  getOrganizacaoDetailRoute,
  getPainDetailRoute,
  getVerticalDetailRoute,
  isInterviewDetailRoute,
  isOpportunityDetailRoute,
  isOrganizacaoDetailRoute,
  isPainDetailRoute,
  isVerticalDetailRoute,
} from './routeMap';

describe('getOpportunityDetailRoute / isOpportunityDetailRoute', () => {
  it('builds the canonical path and encodes special characters in the ID', () => {
    expect(getOpportunityDetailRoute('OPP-001')).toBe('/oportunidades/OPP-001');
    expect(getOpportunityDetailRoute('OPP 01/A')).toBe('/oportunidades/OPP%2001%2FA');
  });

  it('matches a valid opportunity detail path', () => {
    expect(isOpportunityDetailRoute('/oportunidades/OPP-001')).toBe(true);
  });

  it('rejects a path with a missing ID segment', () => {
    expect(isOpportunityDetailRoute('/oportunidades/')).toBe(false);
  });

  it('rejects a path with an extra trailing segment', () => {
    expect(isOpportunityDetailRoute('/oportunidades/OPP-001/detalhes')).toBe(false);
  });

  it('rejects an unrelated path', () => {
    expect(isOpportunityDetailRoute('/dores/OPP-001')).toBe(false);
  });
});

describe('getInterviewDetailRoute / isInterviewDetailRoute', () => {
  it('builds the canonical path and encodes special characters in the ID', () => {
    expect(getInterviewDetailRoute('INT-001')).toBe('/entrevistas/INT-001');
    expect(getInterviewDetailRoute('INT 01/A')).toBe('/entrevistas/INT%2001%2FA');
  });

  it('matches a valid interview detail path', () => {
    expect(isInterviewDetailRoute('/entrevistas/INT-001')).toBe(true);
  });

  it('rejects a path with a missing ID segment', () => {
    expect(isInterviewDetailRoute('/entrevistas/')).toBe(false);
  });

  it('rejects a path with an extra trailing segment', () => {
    expect(isInterviewDetailRoute('/entrevistas/INT-001/notas')).toBe(false);
  });

  it('rejects an unrelated path', () => {
    expect(isInterviewDetailRoute('/organizacoes/INT-001')).toBe(false);
  });
});

describe('getVerticalDetailRoute / isVerticalDetailRoute', () => {
  it('builds the canonical path and encodes special characters in the ID', () => {
    expect(getVerticalDetailRoute('VERT-CONT')).toBe('/verticais/VERT-CONT');
    expect(getVerticalDetailRoute('VERT CONT/A')).toBe('/verticais/VERT%20CONT%2FA');
  });

  it('matches a valid vertical detail path', () => {
    expect(isVerticalDetailRoute('/verticais/VERT-CONT')).toBe(true);
  });

  it('rejects a path with a missing ID segment', () => {
    expect(isVerticalDetailRoute('/verticais/')).toBe(false);
  });

  it('rejects a path with an extra trailing segment', () => {
    expect(isVerticalDetailRoute('/verticais/VERT-CONT/subverticais')).toBe(false);
  });

  it('rejects an unrelated path', () => {
    expect(isVerticalDetailRoute('/organizacoes/VERT-CONT')).toBe(false);
  });
});

describe('getOrganizacaoDetailRoute / isOrganizacaoDetailRoute', () => {
  it('builds the canonical path and encodes special characters in the ID', () => {
    expect(getOrganizacaoDetailRoute('ORG-CONT-001')).toBe('/organizacoes/ORG-CONT-001');
    expect(getOrganizacaoDetailRoute('ORG CONT/001')).toBe('/organizacoes/ORG%20CONT%2F001');
  });

  it('matches a valid organization detail path', () => {
    expect(isOrganizacaoDetailRoute('/organizacoes/ORG-CONT-001')).toBe(true);
  });

  it('rejects a path with a missing ID segment', () => {
    expect(isOrganizacaoDetailRoute('/organizacoes/')).toBe(false);
  });

  it('rejects a path with an extra trailing segment', () => {
    expect(isOrganizacaoDetailRoute('/organizacoes/ORG-CONT-001/entrevistas')).toBe(false);
  });

  it('rejects an unrelated path', () => {
    expect(isOrganizacaoDetailRoute('/verticais/ORG-CONT-001')).toBe(false);
  });
});

describe('getPainDetailRoute / isPainDetailRoute', () => {
  it('builds the canonical path and encodes special characters in the ID', () => {
    expect(getPainDetailRoute('DOR-CONT-001')).toBe('/dores/DOR-CONT-001');
    expect(getPainDetailRoute('DOR CONT/001')).toBe('/dores/DOR%20CONT%2F001');
  });

  it('matches a valid pain detail path', () => {
    expect(isPainDetailRoute('/dores/DOR-CONT-001')).toBe(true);
  });

  it('rejects a path with a missing ID segment', () => {
    expect(isPainDetailRoute('/dores/')).toBe(false);
  });

  it('rejects a path with an extra trailing segment', () => {
    expect(isPainDetailRoute('/dores/DOR-CONT-001/ranking')).toBe(false);
  });

  it('rejects an unrelated path', () => {
    expect(isPainDetailRoute('/oportunidades/DOR-CONT-001')).toBe(false);
  });
});
