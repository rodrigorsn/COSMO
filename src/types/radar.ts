// Types for Vertical Opportunity Radar (VOR)

export type EvidenceType = 'fato' | 'evidencia_observada' | 'hipotese' | 'evidencia_comercial';
export type EvidenceNature = 'favoravel' | 'contraria' | 'neutra';
export type EvidenceLevel = 'H0' | 'H1' | 'H2' | 'H3' | 'H4' | 'H5';

export type VerticalStatus = 
  | 'Radar' 
  | 'Pesquisa secundária' 
  | 'Pesquisa de campo' 
  | 'Análise' 
  | 'Validação' 
  | 'Promissora' 
  | 'Pausada' 
  | 'Descartada';

export type InterviewType = 
  | 'Descoberta' 
  | 'Aprofundamento' 
  | 'Validação' 
  | 'Demonstração' 
  | 'Piloto' 
  | 'Follow-up';

export type InterviewFormat = 
  | 'Individual' 
  | 'Dupla' 
  | 'Observação de processo';

export type InterviewStatus = 'Agendada' | 'Em andamento' | 'Concluída' | 'Cancelada';

export type HierarchyProfile = 
  | 'Sócio/Proprietário' 
  | 'Gestor' 
  | 'Operacional' 
  | 'Administrativo' 
  | 'Comercial' 
  | 'Atendimento' 
  | 'Especialista' 
  | 'Outro';

export type QuestionScope = 
  | 'global' 
  | 'vertical' 
  | 'subvertical' 
  | 'perfil' 
  | 'organizacao' 
  | 'entrevista';

export type QuestionTargetScope = 'organizacao' | 'subvertical' | 'vertical' | 'global';

export interface QuestionPromotionContext {
  interviewId?: string;
  organizacaoId?: string;
  subverticalId?: string;
  verticalId?: string;
  previousScope?: string;
  originNote?: string;
}

export interface TechStackItem {
  id: string;
  nome: string;
  categoria: 'ERP' | 'Software vertical' | 'CRM' | 'WhatsApp' | 'E-mail' | 'Planilha/Excel' | 'Armazenamento/Drive' | 'Gestão de tarefas' | 'Automação' | 'Outro';
  finalidade: string;
  quemUtiliza: string;
  frequencia: 'Diária' | 'Semanal' | 'Mensal' | 'Sob demanda';
  satisfacaoPercebida: 1 | 2 | 3 | 4 | 5;
  limitacoes: string;
  processosAtendidos: string[];
  oQueAconteceFora: string; // Pergunta obrigatória do PRD
}

export interface ProcessStep {
  id: string;
  ordem: number;
  ator: string;
  acao: string;
  ferramenta: string;
  gargaloOuErro?: string;
  tempoGasto?: string;
}

export interface ProcessMap {
  id: string;
  organizacaoId: string;
  nome: string;
  area: string;
  descricao: string;
  inicioProcesso: string;
  resultadoEsperado: string;
  frequencia: 'Diária' | 'Semanal' | 'Mensal' | 'Anual';
  volumeEstimado: string;
  pessoasEnvolvidas: number;
  clientesAfetados: number;
  tempoEstimadoHorasMes: number;
  ferramentas: string[];
  etapas: ProcessStep[];
  gargalos: string;
  errosERetrabalho: string;
  dependenciasExternas: string;
  observacoes: string;
}

export interface Interviewee {
  id: string;
  organizacaoId: string;
  nome: string;
  cargo: string;
  area: string;
  perfil: HierarchyProfile;
  tempoFuncao: string;
  observacoes?: string;
}

export interface QuestionFollowUp {
  id: string;
  texto: string;
}

export interface QuestionLibraryItem {
  id: string;
  texto: string;
  escopo: QuestionScope;
  verticalId?: string;
  subverticalId?: string;
  perfilAplicavel?: HierarchyProfile;
  organizacaoId?: string;
  categoria: string;
  followUps: string[];
  criadaEm?: string;
  historicoPromocao?: string;
}

export interface InterviewQuestionInstance {
  id: string;
  libraryQuestionId?: string;
  texto: string;
  escopo: QuestionScope;
  categoria: string;
  respostaQualitativa: string;
  variaveisEstruturadas?: Record<string, string | number>;
  followUps: string[];
  followUpRespostas?: Record<string, string>;
  pular?: boolean;
  notas?: string;
  achadoIds?: string[];
  isEmergente?: boolean;
}

export interface Finding {
  id: string;
  titulo: string;
  descricao: string;
  origem: 'Entrevista' | 'Processo' | 'Observação direta' | 'Fonte externa';
  tipoEvidencia: EvidenceType;
  natureza: EvidenceNature; // favoravel | contraria | neutra
  organizacaoId?: string; // Obrigatório em Entrevista/Processo/Observação, opcional em Fonte externa (PRD)
  fonteId?: string; // Rastreabilidade de fonte secundária quando aplicável
  entrevistadoId?: string;
  entrevistaId?: string;
  processoId?: string;
  categoria: string;
  fraseOriginal: string; // Preservação da fala original ou citação da fonte (Seção 26)
  interpretacao: string; // Interpretação analítica separada
  tags: string[];
  dorConsolidadaId?: string;
  dataRegistro: string;
}

export interface PainScoreBreakdown {
  frequencia: number; // 0-5
  tempoCusto: number; // 0-5
  severidade: number; // 0-5
  manualidade: number; // 0-5
  repetibilidade: number; // 0-5
  total: number; // 0-25
}

export interface PainOccurrence {
  id: string;
  dorConsolidadaId: string;
  organizacaoId: string;
  painScore?: PainScoreBreakdown | null; // null/undefined quando não mensurado (Seção 29)
  isMeasured?: boolean; // Flag explícita: true quando avaliado conscientemente, false quando não mensurado
  achadosIds: string[];
  notasEspecificas: string;
  evidenciaNatureza?: EvidenceNature; // Mantido apenas para compatibilidade legada; a verdade está em Finding.natureza
}

export interface PainConsolidated {
  id: string;
  verticalId: string;
  subverticalId?: string;
  titulo: string;
  descricao: string;
  categoria: string;
  evidenciasFavoraveisIds: string[];
  evidenciasContrariasIds: string[];
  evidenciasNeutrasIds: string[];
}

export interface OperationsGapScoreBreakdown {
  interacaoCliente: number; // 0-5
  trocaDocumentos: number; // 0-5
  pendencias: number; // 0-5
  prazos: number; // 0-5
  aprovacoes: number; // 0-5
  comunicacaoExterna: number; // 0-5
  trabalhoForaSoftware: number; // 0-5
  multiplicadorClientes: number; // 0-5
  total: number; // max 40
}

export interface AILeverageBreakdown {
  leituraNaoEstruturada: number; // 0-5
  classificacao: number; // 0-5
  extracao: number; // 0-5
  comparacao: number; // 0-5
  geracao: number; // 0-5
  revisaoHumanaDisponivel: number; // 0-5
  total: number; // max 30
}

export interface OpportunityScoreBreakdown {
  mercado: number; // max 20
  dor: number; // max 25
  operationsGap: number; // max 25
  economia: number; // max 20
  gtm: number; // max 10
  total: number; // max 100
}

export interface KillCriterion {
  id: string;
  criterio: string;
  limiar: string;
  status: 'seguro' | 'alerta' | 'atingido';
  observacao: string;
}

export interface Experiment {
  id: string;
  oportunidadeId: string;
  tipo: 'entrevista' | 'pesquisa' | 'demonstração' | 'landing page' | 'concierge' | 'protótipo' | 'piloto gratuito' | 'piloto pago' | 'proposta comercial';
  hipotese: string;
  publicoAlvo: string;
  data: string;
  resultadoEsperado: string;
  resultadoObservado: string;
  conclusao: 'Confirmou' | 'Inconclusivo' | 'Refutou';
}

export interface Opportunity {
  id: string;
  verticalId: string;
  subverticalId?: string;
  nome: string;
  icpHipotetico: string;
  problema: string;
  jobToBeDone: string;
  processoAtual: string;
  solucaoHipotetica: string;
  doresRelacionadasIds: string[];
  concorrentesMapeados: string[];
  diferenciacao: string;
  aiLeverage: AILeverageBreakdown;
  integracoesNecessarias: string[];
  monetizacaoHipotetica: string;
  riscos: string[];
  evidenceLevel: EvidenceLevel;
  confidenceScore: number; // 0-100%
  opportunityScore: OpportunityScoreBreakdown;
  proximaMelhorEvidencia: string; // Next Evidence (Seção 43)
  killCriteria: KillCriterion[];
  experimentos: Experiment[];
  status: 'Investigar' | 'Aprofundar' | 'Testar' | 'Construir' | 'Descartada';
}

export interface MarketSource {
  id: string;
  verticalId: string;
  titulo: string;
  url: string;
  instituicao: string;
  data: string;
  categoria: 'tamanho' | 'crescimento' | 'empresas' | 'profissionais' | 'formação' | 'regulação' | 'tecnologia' | 'comportamento' | 'tendência';
  informacaoExtraida: string;
  resumo: string;
  confiabilidade: 'Alta' | 'Média' | 'Preliminar';
}

export interface Competitor {
  id: string;
  verticalId: string;
  nome: string;
  site: string;
  publico: string;
  proposta: string;
  precoEstimado: string;
  modelo: 'SaaS' | 'Sob consulta' | 'Por usuário' | 'Freemium';
  funcionalidadesPrincipais: string[];
  integracoes: string[];
  iaPresente: boolean;
  pontosFortes: string[];
  limitacoes: string[];
  operationsGapObservado: string; // O que continuam fazendo fora? (Seção 66)
}

export interface Organization {
  id: string;
  nome: string; // ou anonimizado: "Escritório Contábil 001"
  verticalId: string;
  subverticalId?: string; // ID canônico da Subvertical (ex: "SUB-GEN")
  subvertical?: string; // Rótulo descritivo para exibição e compatibilidade
  cidade: string;
  estado: string;
  regiao: string;
  site?: string;
  dataInclusao: string;
  statusPesquisa: 'Em contato' | 'Pesquisando' | 'Concluída' | 'Pausada';
  
  // Características
  numFuncionarios: number;
  numClientes: number;
  faixaFaturamento?: string;
  anosOperacao: number;
  especializacao: string;
  perfilClientes: string;
  ticketMedioServico?: string;
  quantidadeUnidades: number;
  estruturaEquipe: string;
  observacoes: string;
  
  // Entidades filhas
  stackTecnologico: TechStackItem[];
  processos: ProcessMap[];
  entrevistados: Interviewee[];
  operationsGapScore: OperationsGapScoreBreakdown;
}

export interface Interview {
  id: string;
  organizacaoId: string;
  entrevistadoId: string;
  verticalId: string;
  subvertical?: string;
  data: string;
  duracaoMinutos: number;
  tipo: InterviewType;
  formato: InterviewFormat;
  status: InterviewStatus;
  perguntas: InterviewQuestionInstance[];
  notasGerais: string;
  achadosGeradosIds: string[];
}

export interface Subvertical {
  id: string;
  nome: string;
  descricao: string;
}

export interface Vertical {
  id: string;
  nome: string;
  descricao: string;
  teseInicial: string;
  status: VerticalStatus;
  dataCriacao: string;
  ultimaAtualizacao: string;
  responsavel: string;
  observacoes: string;
  subverticais: Subvertical[];
}

export interface CrossVerticalComparison {
  padraoNome: string;
  descricao: string;
  dadosPorVertical: Record<string, {
    incidenciaPercent: number;
    orgsConfirmadas: number;
    totalOrgs: number;
    painMedio: number;
    evidenciaNivel: EvidenceLevel;
  }>;
}
