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
  CrossVerticalComparison 
} from '../types/radar';

export const INITIAL_VERTICAIS: Vertical[] = [
  {
    id: 'VERT-CONT',
    nome: 'Contabilidade',
    descricao: 'Escritórios contábeis, BPO financeiro e consultorias tributárias atendendo PMEs.',
    teseInicial: 'Não substituir o ERP contábil, mas resolver o Customer Operations Gap (solicitação, cobrança e conferência de documentos e certidões que ocorrem via WhatsApp/e-mail/Excel).',
    status: 'Pesquisa de campo',
    dataCriacao: '2026-08-10',
    ultimaAtualizacao: '2026-09-08',
    responsavel: 'Equipe de Validação',
    observacoes: 'Vertical demonstrativa primária. Alta densidade de pequenas empresas clientes por escritório (multiplicador B2B de 60 a 500 empresas por CNPJ contábil).',
    subverticais: [
      { id: 'SUB-GEN', nome: 'Escritório contábil generalista', descricao: 'Atendimento contábil, fiscal e DP para carteiras mistas de comércio e serviços' },
      { id: 'SUB-BPO', nome: 'BPO financeiro', descricao: 'Terceirização de contas a pagar, receber e conciliação bancária' },
      { id: 'SUB-TRIB', nome: 'Consultoria tributária', descricao: 'Planejamento e revisão de enquadramento' },
      { id: 'SUB-DP', nome: 'Departamento Pessoal terceirizado', descricao: 'Foco exclusivo em folha, admissões, férias e benefícios' }
    ]
  },
  {
    id: 'VERT-SST',
    nome: 'SST (Saúde e Seg. Trabalho)',
    descricao: 'Clínicas e assessorias de engenharia e medicina do trabalho que elaboram PGR, PCMSO e enviam eventos ao eSocial.',
    teseInicial: 'Gap operacional de agendamento de exames clínicos em clínicas parceiras e cobrança de atestados de empresas clientes.',
    status: 'Pesquisa secundária',
    dataCriacao: '2026-08-20',
    ultimaAtualizacao: '2026-09-02',
    responsavel: 'Equipe de Validação',
    observacoes: 'Em fase de triagem secundária e mapeamento de regulamentações NR.',
    subverticais: [
      { id: 'SUB-SST-ASS', nome: 'Assessoria de Engenharia Ocupacional', descricao: 'Laudos técnicos e visitas in loco' },
      { id: 'SUB-SST-CLI', nome: 'Clínica de Medicina do Trabalho', descricao: 'Realização de ASO e exames complementares' }
    ]
  },
  {
    id: 'VERT-AMB',
    nome: 'Consultoria Ambiental',
    descricao: 'Empresas de engenharia ambiental responsáveis por licenciamento, outorgas e monitoramento.',
    teseInicial: 'Controle de condicionantes de licença ambiental que dependem de evidências enviadas pelos clientes industriais/agro.',
    status: 'Radar',
    dataCriacao: '2026-08-25',
    ultimaAtualizacao: '2026-08-30',
    responsavel: 'Equipe de Validação',
    observacoes: 'Ticket médio alto, porém menor volume de clientes por consultoria.',
    subverticais: [
      { id: 'SUB-AMB-LIC', nome: 'Licenciamento e Outorgas', descricao: 'Processos perante órgãos ambientais estaduais e municipais' }
    ]
  },
  {
    id: 'VERT-JUR',
    nome: 'Jurídico B2B / Trabalhista',
    descricao: 'Escritórios de advocacia focados em contencioso trabalhista de massa e consultoria patronal.',
    teseInicial: 'Subsídios para contestação: coleta de cartões de ponto e comprovantes com clientes corporativos antes das audiências.',
    status: 'Radar',
    dataCriacao: '2026-09-01',
    ultimaAtualizacao: '2026-09-05',
    responsavel: 'Equipe de Validação',
    observacoes: 'Forte demanda de prazo fatal e conferência de documentos.',
    subverticais: [
      { id: 'SUB-JUR-TRAB', nome: 'Contencioso Trabalhista Patronal', descricao: 'Defesa de empresas com alto volume de ações' }
    ]
  }
];

export const INITIAL_QUESTION_LIBRARY: QuestionLibraryItem[] = [
  // Nível 1: Global - Operação
  {
    id: 'Q-GLOB-01',
    texto: 'Quais são as três atividades que mais tomam tempo da equipe e se repetem para vários clientes?',
    escopo: 'global',
    categoria: 'Operação',
    followUps: [
      'Me explique uma dessas atividades do começo ao fim.',
      'Quantos clientes exigem essa rotina simultaneamente?',
      'Qual o impacto quando ocorre atraso?'
    ]
  },
  {
    id: 'Q-GLOB-02',
    texto: 'Quais sistemas são essenciais para o trabalho e o que vocês ainda precisam fazer fora desses sistemas?',
    escopo: 'global',
    categoria: 'Sistemas',
    followUps: [
      'Por que o sistema principal não absorve essa etapa?',
      'Quem decide usar as ferramentas complementares?',
      'Existe custo extra nessas ferramentas paralelas?'
    ]
  },
  {
    id: 'Q-GLOB-03',
    texto: 'O que vocês controlam por Excel, planilhas, WhatsApp, e-mail ou outras ferramentas paralelas?',
    escopo: 'global',
    categoria: 'Controles paralelos',
    followUps: [
      'Quantas planilhas ativas a equipe alimenta hoje?',
      'Como garantem que ninguém apagou uma linha ou esqueceu de atualizar?',
      'O que acontece se a pessoa responsável faltar?'
    ]
  },
  {
    id: 'Q-GLOB-04',
    texto: 'O que vocês mais precisam pedir, cobrar ou lembrar o cliente de fazer?',
    escopo: 'global',
    categoria: 'Cliente',
    followUps: [
      'Quantas vezes em média precisam cobrar o mesmo cliente?',
      'Qual canal o cliente costuma responder mais rápido?',
      'O cliente reclama de ser cobrado?'
    ]
  },
  {
    id: 'Q-GLOB-05',
    texto: 'Que documentos precisam solicitar, receber, conferir ou armazenar repetidamente?',
    escopo: 'global',
    categoria: 'Documentos',
    followUps: [
      'Como vocês sabem quem ainda não enviou?',
      'Qual a taxa média de documentos que chegam incompletos ou errados?',
      'Onde esses arquivos ficam guardados antes de entrarem no sistema final?'
    ]
  },
  {
    id: 'Q-GLOB-06',
    texto: 'Onde acontecem mais erros, atrasos, esquecimentos ou retrabalho?',
    escopo: 'global',
    categoria: 'Retrabalho',
    followUps: [
      'Qual o custo financeiro ou de estresse desse erro?',
      'O erro costuma ser gerado internamente ou pelo cliente?'
    ]
  },
  {
    id: 'Q-GLOB-07',
    texto: 'Existe algo sobre o qual você pensa: "não é possível que ainda tenhamos que fazer isso desse jeito"?',
    escopo: 'global',
    categoria: 'Trabalho invisível',
    followUps: [
      'Há quanto tempo vocês fazem dessa mesma forma?',
      'Já tentaram alguma ferramenta pronta para resolver?'
    ]
  },

  // Nível 2: Vertical Contabilidade
  {
    id: 'Q-CONT-01',
    texto: 'Como funciona o fechamento mensal e como vocês sabem quais clientes ainda possuem pendências?',
    escopo: 'vertical',
    verticalId: 'VERT-CONT',
    categoria: 'Fechamento',
    followUps: [
      'Existe uma lista central de pendências por cliente?',
      'Quantos clientes chegam no dia 15 sem extratos ou notas?',
      'Como isso afeta o cálculo do Simples Nacional ou DCTFWeb?'
    ]
  },
  {
    id: 'Q-CONT-02',
    texto: 'Como os clientes enviam os documentos mensais e quantas cobranças normalmente são necessárias?',
    escopo: 'vertical',
    verticalId: 'VERT-CONT',
    categoria: 'Documentos',
    followUps: [
      'Quantos clientes usam o portal oficial vs WhatsApp?',
      'Quem realiza essas cobranças no dia a dia?',
      'Quanto tempo leva para conferir se o extrato veio em PDF ou OFX?'
    ]
  },
  {
    id: 'Q-CONT-03',
    texto: 'Como acompanham pendências fiscais e certidões negativas (CNDs) dos clientes?',
    escopo: 'vertical',
    verticalId: 'VERT-CONT',
    categoria: 'Fiscal',
    followUps: [
      'Entram manualmente no e-CAC e prefeitura cliente por cliente?',
      'Qual a surpresa quando descobrem uma pendência na hora da emissão?'
    ]
  },
  {
    id: 'Q-CONT-04',
    texto: 'Como chegam informações de admissão, férias, rescisões e alterações no Departamento Pessoal?',
    escopo: 'vertical',
    verticalId: 'VERT-CONT',
    categoria: 'Departamento Pessoal',
    followUps: [
      'Vêm dados incompletos ou fotos ilegíveis de carteira de trabalho?',
      'Quanto tempo é gasto conferindo se a documentação do admitido está correta?'
    ]
  },

  // Nível 4: Por Perfil
  {
    id: 'Q-PERF-SOC',
    texto: 'O que mais limita a capacidade do seu escritório de dobrar o número de clientes sem dobrar a equipe na mesma proporção?',
    escopo: 'perfil',
    perfilAplicavel: 'Sócio/Proprietário',
    categoria: 'Crescimento e Capacidade',
    followUps: [
      'Qual o custo mensal com contratação e treinamento de analistas juniores?',
      'Quanto você já investe em licenças de software por mês?',
      'Seus clientes valorizam relatórios de consultoria ou exigem apenas conformidade sem multas?'
    ]
  },
  {
    id: 'Q-PERF-OP',
    texto: 'Me mostre exatamente na tela como você faz para baixar um documento do WhatsApp e lançar no ERP.',
    escopo: 'perfil',
    perfilAplicavel: 'Operacional',
    categoria: 'Processo Real e Cliques',
    followUps: [
      'Quantas vezes você precisa renomear esse arquivo?',
      'Quantos cliques e trocas de abas isso exige?',
      'Qual a parte mais cansativa desse processo?'
    ]
  },
  {
    id: 'Q-PERF-GEST',
    texto: 'Como você mede a produtividade e o cumprimento de prazos da equipe sem ter que perguntar para cada um todo dia?',
    escopo: 'perfil',
    perfilAplicavel: 'Gestor',
    categoria: 'Visibilidade e SLA',
    followUps: [
      'O ERP dá essa visão de SLA em tempo real ou você usa Trello/ClickUp/Planilha?',
      'Como você descobre quando um cliente está travando a entrega da equipe?'
    ]
  },

  // Pergunta promovida demonstrativa (Seção 50)
  {
    id: 'Q-PROM-01',
    texto: 'Como vocês monitoram a caixa postal fiscal do e-CAC e Domicílio Tributário Eletrônico (DTE) de todos os clientes?',
    escopo: 'vertical',
    verticalId: 'VERT-CONT',
    categoria: 'Fiscal / Caixa Postal',
    criadaEm: '2026-08-15 em ORG-CONT-001',
    historicoPromocao: 'Criada originalmente na entrevista com Maria (ORG-CONT-001). Promovida para a vertical Contabilidade em 18/08/2026 após repetição no Escritório 003.',
    followUps: [
      'Quantos certificados digitais precisam gerenciar?',
      'Já aconteceu de um cliente receber notificação importante e perder o prazo?'
    ]
  }
];

export const INITIAL_ORGANIZACOES: Organization[] = [
  {
    id: 'ORG-CONT-001',
    nome: 'Escritório Contábil Alfa (ORG-CONT-001)',
    verticalId: 'VERT-CONT',
    subvertical: 'Escritório contábil generalista',
    cidade: 'São Paulo',
    estado: 'SP',
    regiao: 'Sudeste',
    site: 'https://exemplo-alfa-contabil.com.br',
    dataInclusao: '2026-08-12',
    statusPesquisa: 'Concluída',
    numFuncionarios: 15,
    numClientes: 320,
    faixaFaturamento: 'R$ 150k a R$ 250k / mês',
    anosOperacao: 11,
    especializacao: 'Prestadores de serviços tributados pelo Simples e Lucro Presumido',
    perfilClientes: 'PMEs de serviços de TI, consultoria, saúde e agências de marketing',
    ticketMedioServico: 'R$ 680 / mês',
    quantidadeUnidades: 1,
    estruturaEquipe: '1 Sócio diretor, 2 coordenadores, 4 analistas fiscais, 4 analistas contábeis, 3 analistas de DP, 1 estagiário de recepção',
    observacoes: 'Organização madura, digitalizada, porém com gargalo severo de cobrança de documentos todo início de mês.',
    stackTecnologico: [
      {
        id: 'STK-01',
        nome: 'ERP Atlas Contábil',
        categoria: 'ERP',
        finalidade: 'Geração de guias fiscais, SPED, folha de pagamento e balancetes',
        quemUtiliza: 'Toda a equipe operacional (11 usuários)',
        frequencia: 'Diária',
        satisfacaoPercebida: 3,
        limitacoes: 'Módulo de portal do cliente é lento, complexo para os clientes finais e não notifica adequadamente por canais modernos',
        processosAtendidos: ['Fechamento Fiscal', 'Folha de Pagamento', 'Escrituração Contábil'],
        oQueAconteceFora: 'Todo o contato com o cliente para solicitar extratos bancários, notas de tomada de serviço e comprovantes ocorre fora do ERP (WhatsApp e e-mail). O ERP só recebe o dado quando tudo já foi cobrado e conferido.'
      },
      {
        id: 'STK-02',
        nome: 'WhatsApp Business API + Números Individuais',
        categoria: 'WhatsApp',
        finalidade: 'Comunicação diária, cobrança de pendências e esclarecimento de dúvidas',
        quemUtiliza: 'Coordenadores e analistas diretamente',
        frequencia: 'Diária',
        satisfacaoPercebida: 2,
        limitacoes: 'Histórico fragmentado em vários aparelhos celulares, falta de rastreabilidade de anexos recebidos e sem status automático de pendência',
        processosAtendidos: ['Cobrança de Documentos', 'Tira-dúvidas', 'Envio de guias tributárias'],
        oQueAconteceFora: 'Tudo. O analista precisa manualmente conferir o que chegou no zap, baixar pro computador e renomear.'
      },
      {
        id: 'STK-03',
        nome: 'Planilhas Google Sheets de Fechamento',
        categoria: 'Planilha/Excel',
        finalidade: 'Acompanhar quais dos 320 clientes já enviaram os documentos e quais faltam',
        quemUtiliza: 'Coordenadores e gerência',
        frequencia: 'Diária',
        satisfacaoPercebida: 3,
        limitacoes: 'Alimentação 100% manual, desatualizada rapidamente, risco de sobreposição de células',
        processosAtendidos: ['Painel de Controle de Fechamento'],
        oQueAconteceFora: 'A planilha é o controle paralelo onde a verdade operacional reside porque o ERP não tem visão do trabalho em andamento.'
      },
      {
        id: 'STK-04',
        nome: 'Google Drive Corporativo',
        categoria: 'Armazenamento/Drive',
        finalidade: 'Repositório de arquivos brutos enviados pelos clientes em pastas anuais/mensais',
        quemUtiliza: 'Equipe inteira',
        frequencia: 'Diária',
        satisfacaoPercebida: 4,
        limitacoes: 'Sem validação automática se o arquivo é o correto (ex: cliente sobe foto desfocada ou comprovante do mês errado)',
        processosAtendidos: ['Arquivo Morto Digital'],
        oQueAconteceFora: 'Conferência humana arquivo por arquivo.'
      }
    ],
    processos: [
      {
        id: 'PROC-01',
        organizacaoId: 'ORG-CONT-001',
        nome: 'Recebimento e Cobrança Mensal de Documentos',
        area: 'Fiscal / Contábil',
        descricao: 'Coleta de extratos bancários (OFX/PDF), notas fiscais de serviços tomados, faturas de cartão e comprovantes para fechamento do mês anterior.',
        inicioProcesso: 'Dia 01 de cada mês útil com disparo de lembretes',
        resultadoEsperado: '100% dos documentos conferidos e alocados nas pastas até dia 10 para rodar impostos até dia 15',
        frequencia: 'Mensal',
        volumeEstimado: '320 clientes (aprox. 1.200 arquivos/mês)',
        pessoasEnvolvidas: 6,
        clientesAfetados: 320,
        tempoEstimadoHorasMes: 96,
        ferramentas: ['WhatsApp', 'E-mail', 'Planilha Google', 'Google Drive', 'ERP Atlas'],
        etapas: [
          { id: 'ST-1', ordem: 1, ator: 'Analista Contábil', acao: 'Filtra na planilha os clientes que não enviaram nada no dia 05', ferramenta: 'Planilha Google', tempoGasto: '2 horas' },
          { id: 'ST-2', ordem: 2, ator: 'Analista Contábil', acao: 'Envia mensagem manual no WhatsApp de cada cliente solicitando extratos e notas', ferramenta: 'WhatsApp', gargaloOuErro: 'Mensagens ignoradas ou respostas incompletas', tempoGasto: '16 horas' },
          { id: 'ST-3', ordem: 3, ator: 'Cliente do Escritório', acao: 'Envia extrato bancário em formato PDF protegido ou fotos no WhatsApp', ferramenta: 'WhatsApp', gargaloOuErro: 'Arquivo não estruturado (não é OFX)', tempoGasto: 'Variável' },
          { id: 'ST-4', ordem: 4, ator: 'Analista Contábil', acao: 'Baixa do WhatsApp Web, renomeia arquivo com padrão e joga na pasta da empresa', ferramenta: 'Google Drive', tempoGasto: '14 horas' },
          { id: 'ST-5', ordem: 5, ator: 'Analista Contábil', acao: 'Atualiza célula da planilha como "Enviado - Pendente Conferência"', ferramenta: 'Planilha Google', tempoGasto: '4 horas' },
          { id: 'ST-6', ordem: 6, ator: 'Analista Fiscal/Contábil', acao: 'Abre extrato e notas e digita/importa as linhas no sistema ERP', ferramenta: 'ERP Atlas', gargaloOuErro: 'Falta extrato de uma conta que o cliente abriu e não avisou', tempoGasto: '60 horas' }
        ],
        gargalos: 'Cliente envia no dia 14 às 18h documentos do fechamento que vence no dia 15. Dependência de 2 a 3 cobranças por WhatsApp.',
        errosERetrabalho: 'Clientes enviam extrato da conta pessoal ao invés da jurídica; enviam print de tela ao invés de documento fiscal oficial.',
        dependenciasExternas: 'Responsabilidade e proatividade dos clientes das 320 empresas.',
        observacoes: 'Gera horas extras recorrentes entre os dias 08 e 15 de cada mês.'
      }
    ],
    entrevistados: [
      {
        id: 'ENTR-P01',
        organizacaoId: 'ORG-CONT-001',
        nome: 'Carlos Eduardo',
        cargo: 'Sócio Fundador',
        area: 'Direção Geral',
        perfil: 'Sócio/Proprietário',
        tempoFuncao: '11 anos',
        observacoes: 'Visão estratégica clara. Sofre para crescer a carteira além de 350 clientes sem inflar folha de pagamento.'
      },
      {
        id: 'ENTR-P02',
        organizacaoId: 'ORG-CONT-001',
        nome: 'Maria Fernanda',
        cargo: 'Supervisora Fiscal e Contábil',
        area: 'Fiscal',
        perfil: 'Gestor',
        tempoFuncao: '4 anos',
        observacoes: 'Vive na pele a dor de controlar entregas de 320 clientes. Muito detalhista sobre os gargalos do WhatsApp.'
      }
    ],
    operationsGapScore: {
      interacaoCliente: 5,
      trocaDocumentos: 5,
      pendencias: 5,
      prazos: 4,
      aprovacoes: 3,
      comunicacaoExterna: 5,
      trabalhoForaSoftware: 5,
      multiplicadorClientes: 5,
      total: 37
    }
  },
  {
    id: 'ORG-CONT-002',
    nome: 'Escritório Contábil Beta (ORG-CONT-002)',
    verticalId: 'VERT-CONT',
    subvertical: 'Escritório contábil generalista',
    cidade: 'Campinas',
    estado: 'SP',
    regiao: 'Sudeste',
    site: 'https://exemplo-beta-contab.com.br',
    dataInclusao: '2026-08-18',
    statusPesquisa: 'Concluída',
    numFuncionarios: 4,
    numClientes: 65,
    faixaFaturamento: 'R$ 45k a R$ 60k / mês',
    anosOperacao: 3,
    especializacao: 'Comércio varejista e pequenas franquias locais',
    perfilClientes: 'Lojas de shopping, pequenos restaurantes e padarias',
    ticketMedioServico: 'R$ 850 / mês',
    quantidadeUnidades: 1,
    estruturaEquipe: '1 Sócio-contador, 1 assistente fiscal, 1 assistente DP/contábil, 1 estagiário',
    observacoes: 'Escritório pequeno e jovem. Implantou um portal com aplicativo para os clientes no primeiro ano.',
    stackTecnologico: [
      {
        id: 'STK-B01',
        nome: 'ERP FiscalPro',
        categoria: 'ERP',
        finalidade: 'Emissão e apuração de tributos',
        quemUtiliza: 'Equipe inteira',
        frequencia: 'Diária',
        satisfacaoPercebida: 4,
        limitacoes: 'Interface tradicional',
        processosAtendidos: ['Fiscal', 'Folha'],
        oQueAconteceFora: 'Atendimento telefônico direto com donos de comércio.'
      },
      {
        id: 'STK-B02',
        nome: 'Portal do Cliente com App Mobile',
        categoria: 'Software vertical',
        finalidade: 'Upload de documentos pelo cliente e consulta de guias',
        quemUtiliza: 'Clientes e analistas',
        frequencia: 'Diária',
        satisfacaoPercebida: 4,
        limitacoes: 'Cerca de 20% dos clientes mais velhos se recusam a usar o app',
        processosAtendidos: ['Envio de Documentos'],
        oQueAconteceFora: 'Exceções para comerciantes de comércio físico que ainda entregam envelopes de papel ou mandam no WhatsApp pessoal.'
      }
    ],
    processos: [
      {
        id: 'PROC-B01',
        organizacaoId: 'ORG-CONT-002',
        nome: 'Rotina de Entrada de Notas Fiscais e Comprovantes',
        area: 'Fiscal',
        descricao: 'Coleta de cupons fiscais e notas de entrada de mercadorias.',
        inicioProcesso: 'Dia 01 do mês',
        resultadoEsperado: 'Apuração do ICMS e Simples até dia 12',
        frequencia: 'Mensal',
        volumeEstimado: '65 clientes (150 arquivos/mês)',
        pessoasEnvolvidas: 2,
        clientesAfetados: 65,
        tempoEstimadoHorasMes: 18,
        ferramentas: ['Portal do Cliente', 'ERP FiscalPro', 'WhatsApp'],
        etapas: [
          { id: 'ST-B1', ordem: 1, ator: 'Cliente', acao: 'Sobe comprovantes no aplicativo ou traz malote', ferramenta: 'Portal do Cliente' },
          { id: 'ST-B2', ordem: 2, ator: 'Assistente Fiscal', acao: 'Valida no portal e importa no FiscalPro', ferramenta: 'ERP FiscalPro' }
        ],
        gargalos: 'Clientes que não usam tecnologia e exigem cobrança via ligação telefônica.',
        errosERetrabalho: 'Baixo retrabalho documental comparado a escritórios maiores devido à carteira menor e mais controlada.',
        dependenciasExternas: 'Envio de relatórios do PDV dos comércios.',
        observacoes: 'Mostra contraste relevante: em escala pequena (65 clientes), a relação pessoal ainda segura os gargalos operacionais.'
      }
    ],
    entrevistados: [
      {
        id: 'ENTR-P03',
        organizacaoId: 'ORG-CONT-002',
        nome: 'Roberto Silva',
        cargo: 'Sócio Proprietário',
        area: 'Geral',
        perfil: 'Sócio/Proprietário',
        tempoFuncao: '3 anos',
        observacoes: 'Contador prático. Adotou portal de clientes e relata que documentação é um problema contornado em sua escala.'
      }
    ],
    operationsGapScore: {
      interacaoCliente: 2,
      trocaDocumentos: 2,
      pendencias: 2,
      prazos: 2,
      aprovacoes: 1,
      comunicacaoExterna: 3,
      trabalhoForaSoftware: 2,
      multiplicadorClientes: 2,
      total: 16
    }
  },
  {
    id: 'ORG-CONT-003',
    nome: 'Escritório Contábil Gamma (ORG-CONT-003)',
    verticalId: 'VERT-CONT',
    subvertical: 'Escritório contábil generalista',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    regiao: 'Sudeste',
    site: 'https://exemplo-gamma-bpo.com.br',
    dataInclusao: '2026-08-22',
    statusPesquisa: 'Concluída',
    numFuncionarios: 22,
    numClientes: 480,
    faixaFaturamento: 'R$ 280k a R$ 380k / mês',
    anosOperacao: 16,
    especializacao: 'PMEs prestadoras de serviço, construtoras de pequeno porte e clínicas médicas',
    perfilClientes: 'Empresas com faturamento de R$ 1M a R$ 10M anuais',
    ticketMedioServico: 'R$ 820 / mês',
    quantidadeUnidades: 2,
    estruturaEquipe: '2 Sócios, 3 coordenadores de área, 6 analistas fiscais, 5 contábeis, 4 DP, 2 atendimento',
    observacoes: 'Escritório de médio porte com alto volume operacional. Utilizam o mesmo ERP Atlas do Escritório 001 e vivenciam exatamente as mesmas dores de forma amplificada.',
    stackTecnologico: [
      {
        id: 'STK-G01',
        nome: 'ERP Atlas Contábil (Servidor Local + Nuvem)',
        categoria: 'ERP',
        finalidade: 'Sistema mestre contábil e fiscal',
        quemUtiliza: 'Toda a produção',
        frequencia: 'Diária',
        satisfacaoPercebida: 3,
        limitacoes: 'Sem fluxo integrado de follow-up de pendências de clientes',
        processosAtendidos: ['Tributos', 'Folha', 'Contabilidade'],
        oQueAconteceFora: 'A gestão do relacionamento e cobrança de documentação corre inteira por canais paralelos.'
      },
      {
        id: 'STK-G02',
        nome: 'Zendesk / HelpDesk de Atendimento',
        categoria: 'CRM',
        finalidade: 'Tentativa de centralizar chamados dos 480 clientes',
        quemUtiliza: 'Equipe de atendimento e clientes',
        frequencia: 'Diária',
        satisfacaoPercebida: 2,
        limitacoes: 'Clientes não abrem chamado formal; quando precisam enviar documento ou tirar dúvida rápida, insistem em mandar direto no WhatsApp particular do analista',
        processosAtendidos: ['Suporte formal'],
        oQueAconteceFora: '80% dos clientes contornam o sistema formal e continuam no WhatsApp.'
      }
    ],
    processos: [
      {
        id: 'PROC-G01',
        organizacaoId: 'ORG-CONT-003',
        nome: 'Controle de Admissões e Afastamentos de Funcionários de Clientes (DP)',
        area: 'Departamento Pessoal',
        descricao: 'Recepção de novos empregados contratados pelos clientes e envio do evento S-2200 ao eSocial no prazo legal.',
        inicioProcesso: 'Cliente avisa que contratou funcionário que começa no dia seguinte',
        resultadoEsperado: 'Admissão cadastrada e enviada ao eSocial 24h antes do início do trabalho',
        frequencia: 'Diária',
        volumeEstimado: 'Aprox. 120 admissões/mês somando os 480 clientes',
        pessoasEnvolvidas: 4,
        clientesAfetados: 480,
        tempoEstimadoHorasMes: 80,
        ferramentas: ['WhatsApp', 'E-mail', 'ERP Atlas', 'eSocial'],
        etapas: [
          { id: 'ST-G1', ordem: 1, ator: 'Cliente', acao: 'Manda fotos de RG, carteira e exame admissional por WhatsApp em fotos cortadas', ferramenta: 'WhatsApp' },
          { id: 'ST-G2', ordem: 2, ator: 'Analista de DP', acao: 'Digita os dados campo a campo no ERP Atlas e confere número de CPF e PIS', ferramenta: 'ERP Atlas' },
          { id: 'ST-G3', ordem: 3, ator: 'Analista de DP', acao: 'Identifica que faltou o ASO (Atestado de Saúde Ocupacional) e devolve cobrança', ferramenta: 'WhatsApp', gargaloOuErro: 'Risco de multa do eSocial por admissão retroativa' }
        ],
        gargalos: 'Clientes não entendem a obrigatoriedade do eSocial e avisam admissões depois que o empregado já começou a trabalhar.',
        errosERetrabalho: 'Erros de digitação de nomes, números de documentos e divergências cadastrais na Receita Federal.',
        dependenciasExternas: 'Clínica de SST do cliente emitir o ASO em tempo hábil.',
        observacoes: 'Processo altamente vulnerável a passivo trabalhista.'
      }
    ],
    entrevistados: [
      {
        id: 'ENTR-P04',
        organizacaoId: 'ORG-CONT-003',
        nome: 'Ana Paula Rezende',
        cargo: 'Coordenadora Geral de Operações',
        area: 'Operações',
        perfil: 'Gestor',
        tempoFuncao: '6 anos',
        observacoes: 'Responsável direta pela alocação de horas dos analistas. Mencionou explicitamente o custo financeiro de ter 2 pessoas dedicadas a cobrar documentos.'
      },
      {
        id: 'ENTR-P05',
        organizacaoId: 'ORG-CONT-003',
        nome: 'Juliana Castro',
        cargo: 'Analista Sênior de Departamento Pessoal',
        area: 'Departamento Pessoal',
        perfil: 'Operacional',
        tempoFuncao: '5 anos',
        observacoes: 'Especialista em eSocial. Detalhou o caos do recebimento de documentos de admissão via WhatsApp.'
      }
    ],
    operationsGapScore: {
      interacaoCliente: 5,
      trocaDocumentos: 5,
      pendencias: 5,
      prazos: 5,
      aprovacoes: 4,
      comunicacaoExterna: 5,
      trabalhoForaSoftware: 5,
      multiplicadorClientes: 5,
      total: 39
    }
  }
];

export const INITIAL_ENTREVISTAS: Interview[] = [
  {
    id: 'INT-001',
    organizacaoId: 'ORG-CONT-001',
    entrevistadoId: 'ENTR-P01',
    verticalId: 'VERT-CONT',
    subvertical: 'Escritório contábil generalista',
    data: '2026-08-14',
    duracaoMinutos: 45,
    tipo: 'Descoberta',
    status: 'Concluída',
    notasGerais: 'Carlos foi muito aberto sobre a trava de margem do negócio. Gastam muito com salários de analistas que passam metade do dia cobrando cliente ao invés de analisar.',
    perguntas: [
      {
        id: 'IP-01',
        libraryQuestionId: 'Q-PERF-SOC',
        texto: 'O que mais limita a capacidade do seu escritório de dobrar o número de clientes sem dobrar a equipe na mesma proporção?',
        escopo: 'perfil',
        categoria: 'Crescimento e Capacidade',
        respostaQualitativa: 'Hoje o que nos trava não é o processamento contábil dentro do Atlas, mas a fricção de conseguir as informações com o cliente. O cliente demora pra mandar, manda errado, manda no dia do vencimento. A equipe fica refém de cobrar pelo WhatsApp. Se eu trouxer mais 100 clientes hoje, eu preciso contratar no mínimo mais 3 analistas só pra atendimento e cobrança operacional.',
        variaveisEstruturadas: {
          capacidade_atual: 320,
          gargalo_principal: 'atendimento_cobranca',
          contratacao_necessaria_por_100_clientes: 3
        },
        followUps: [
          'Qual o custo mensal com contratação e treinamento de analistas juniores?',
          'Quanto você já investe em licenças de software por mês?'
        ],
        followUpRespostas: {
          'Qual o custo mensal com contratação e treinamento de analistas juniores?': 'Em média R$ 3.800 de custo total por pessoa júnior. E leva 3 a 4 meses pra aprender a lidar com cliente chato.'
        }
      },
      {
        id: 'IP-02',
        libraryQuestionId: 'Q-GLOB-04',
        texto: 'O que vocês mais precisam pedir, cobrar ou lembrar o cliente de fazer?',
        escopo: 'global',
        categoria: 'Cliente',
        respostaQualitativa: 'Extratos bancários das 3 contas que a empresa tem e notas fiscais de tomador. O cliente acha que a gente tem bola de cristal ou que o banco conecta sozinho. Todo santo mês cobramos de 3 a 5 vezes o mesmo cliente.',
        variaveisEstruturadas: {
          cobrancas_medias: 4,
          documentos_criticos: 'extratos_e_notas_tomadas'
        },
        followUps: ['Quantas vezes em média precisam cobrar o mesmo cliente?']
      }
    ],
    achadosGeradosIds: ['ACH-001', 'ACH-002']
  },
  {
    id: 'INT-002',
    organizacaoId: 'ORG-CONT-001',
    entrevistadoId: 'ENTR-P02',
    verticalId: 'VERT-CONT',
    subvertical: 'Escritório contábil generalista',
    data: '2026-08-16',
    duracaoMinutos: 40,
    tipo: 'Aprofundamento',
    status: 'Concluída',
    notasGerais: 'Maria mostrou na prática a rotina e as planilhas de controle. Frase de impacto sobre o tempo gasto.',
    perguntas: [
      {
        id: 'IP-03',
        libraryQuestionId: 'Q-CONT-02',
        texto: 'Como os clientes enviam os documentos mensais e quantas cobranças normalmente são necessárias?',
        escopo: 'vertical',
        categoria: 'Documentos',
        respostaQualitativa: 'A maioria manda por WhatsApp pessoal do analista. Todo mês uma pessoa da minha equipe praticamente fica dois dias úteis inteiros só cobrando os clientes para mandarem os extratos e as despesas. Eles mandam foto tremida de comprovante de Pix no restaurante, foto de papel amassado.',
        variaveisEstruturadas: {
          tempo_cobranca_dias_mes: 2,
          canal_predominante: 'WhatsApp'
        },
        followUps: [
          'Quem realiza essas cobranças no dia a dia?',
          'Onde isso fica registrado?'
        ],
        followUpRespostas: {
          'Onde isso fica registrado?': 'Numa planilha gigante de fechamento no Google Sheets com 320 linhas. Pintamos de verde quando chega, amarelo quando cobrou e vermelho quando está atrasado.'
        }
      }
    ],
    achadosGeradosIds: ['ACH-003', 'ACH-004']
  },
  {
    id: 'INT-003',
    organizacaoId: 'ORG-CONT-002',
    entrevistadoId: 'ENTR-P03',
    verticalId: 'VERT-CONT',
    subvertical: 'Escritório contábil generalista',
    data: '2026-08-20',
    duracaoMinutos: 35,
    tipo: 'Descoberta',
    status: 'Concluída',
    notasGerais: 'Entrevista de contraponto essencial (Evidência Contrária para o gap em pequenas carteiras).',
    perguntas: [
      {
        id: 'IP-04',
        libraryQuestionId: 'Q-CONT-02',
        texto: 'Como os clientes enviam os documentos mensais e quantas cobranças normalmente são necessárias?',
        escopo: 'vertical',
        categoria: 'Documentos',
        respostaQualitativa: 'Aqui como temos 65 clientes, implantamos desde o início o aplicativo do FiscalPro. Cerca de 80% deles sobem direto pelo app porque a gente treinou no onboarding. Não temos essa dor desesperadora de passar dias cobrando. Nosso portal já resolve razoavelmente bem a documentação para a nossa escala atual.',
        variaveisEstruturadas: {
          adotam_portal_percent: 80,
          dor_documentos: 'baixa_ou_controlada'
        },
        followUps: ['E os outros 20% que não usam?'],
        followUpRespostas: {
          'E os outros 20% que não usam?': 'São donos de padaria mais velhos, esses trazem no envelope ou a gente manda um motoboy buscar uma vez por mês.'
        }
      }
    ],
    achadosGeradosIds: ['ACH-005']
  },
  {
    id: 'INT-004',
    organizacaoId: 'ORG-CONT-003',
    entrevistadoId: 'ENTR-P04',
    verticalId: 'VERT-CONT',
    subvertical: 'Escritório contábil generalista',
    data: '2026-08-24',
    duracaoMinutos: 50,
    tipo: 'Descoberta',
    status: 'Concluída',
    notasGerais: 'Ana Paula confirmou em escala maior (480 clientes) a hipótese que surgiu no Escritório 001. A correlação com o número de clientes é altíssima.',
    perguntas: [
      {
        id: 'IP-05',
        libraryQuestionId: 'Q-GLOB-01',
        texto: 'Quais são as três atividades que mais tomam tempo da equipe e se repetem para vários clientes?',
        escopo: 'global',
        categoria: 'Operação',
        respostaQualitativa: 'Primeiro: cobrar extrato bancário de cliente que esquece de mandar. Segundo: conferir se a nota fiscal de entrada foi lançada na prefeitura. Terceiro: tirar dúvida repetitiva sobre emissão de nota ou cálculo de pró-labore. Temos duas estagiárias e uma analista praticamente exclusivas para follow-up de pendências entre os dias 01 e 10.',
        variaveisEstruturadas: {
          profissionais_dedicados_followup: 3,
          dias_pico: '01 a 10 de cada mes'
        },
        followUps: ['Quanto isso custa em horas da equipe?'],
        followUpRespostas: {
          'Quanto isso custa em horas da equipe?': 'Facilmente mais de 160 horas por mês somando todas as cobranças e checagens.'
        }
      }
    ],
    achadosGeradosIds: ['ACH-006', 'ACH-007']
  },
  {
    id: 'INT-005',
    organizacaoId: 'ORG-CONT-003',
    entrevistadoId: 'ENTR-P05',
    verticalId: 'VERT-CONT',
    subvertical: 'Escritório contábil generalista',
    data: '2026-08-26',
    duracaoMinutos: 40,
    tipo: 'Aprofundamento',
    status: 'Concluída',
    notasGerais: 'Juliana focou no Departamento Pessoal e eSocial. Dores severas com risco de autuação para o cliente.',
    perguntas: [
      {
        id: 'IP-06',
        libraryQuestionId: 'Q-CONT-04',
        texto: 'Como chegam informações de admissão, férias, rescisões e alterações no Departamento Pessoal?',
        escopo: 'vertical',
        categoria: 'Departamento Pessoal',
        respostaQualitativa: 'É um desespero. O cliente contrata alguém na sexta-feira às 18h e manda um zap dizendo: "Fulano começa na segunda, cadastra ele aí". Manda foto de RG com dedo na frente, sem CPF dos filhos para salário família, sem exame admissional. Se a gente cadastra errado ou fora do prazo de 24h do eSocial, gera advertência e multa pro cliente.',
        variaveisEstruturadas: {
          admissoes_em_cima_da_hora_percent: 60,
          documentos_com_defeito_percent: 50
        },
        followUps: ['O ERP Atlas ajuda a coletar esses documentos do funcionário?'],
        followUpRespostas: {
          'O ERP Atlas ajuda a coletar esses documentos do funcionário?': 'Não, o ERP só recebe a ficha preenchida. Toda a caça aos documentos do admitido é feita por nós no WhatsApp ou por e-mail.'
        }
      }
    ],
    achadosGeradosIds: ['ACH-008']
  }
];

export const INITIAL_ACHADOS: Finding[] = [
  {
    id: 'ACH-001',
    titulo: 'Gargalo de crescimento atrelado ao atendimento manual',
    descricao: 'Para adicionar novos clientes, o escritório precisa contratar proporcionalmente analistas focados em cobrança e suporte.',
    origem: 'Entrevista',
    tipoEvidencia: 'evidencia_observada',
    natureza: 'favoravel',
    organizacaoId: 'ORG-CONT-001',
    entrevistadoId: 'ENTR-P01',
    entrevistaId: 'INT-001',
    categoria: 'Capacidade',
    fraseOriginal: 'Se eu trouxer mais 100 clientes hoje, eu preciso contratar no mínimo mais 3 analistas só pra atendimento e cobrança operacional.',
    interpretacao: 'Existe deseconomia de escala operacional no atendimento e gestão de pendências manuais fora do ERP.',
    tags: ['crescimento', 'capacidade', 'headcount'],
    dorConsolidadaId: 'DOR-CONT-001',
    dataRegistro: '2026-08-14'
  },
  {
    id: 'ACH-002',
    titulo: 'Extratos e notas exigem 3 a 5 cobranças repetidas',
    descricao: 'A rotina de solicitação mensal não é resolvida em contato único.',
    origem: 'Entrevista',
    tipoEvidencia: 'evidencia_observada',
    natureza: 'favoravel',
    organizacaoId: 'ORG-CONT-001',
    entrevistadoId: 'ENTR-P01',
    entrevistaId: 'INT-001',
    categoria: 'Documentos',
    fraseOriginal: 'Todo santo mês cobramos de 3 a 5 vezes o mesmo cliente.',
    interpretacao: 'Processo altamente reativo com alto atrito de relacionamento e desgaste emocional.',
    tags: ['cobranca', 'frequencia', 'atrito'],
    dorConsolidadaId: 'DOR-CONT-001',
    dataRegistro: '2026-08-14'
  },
  {
    id: 'ACH-003',
    titulo: 'Custo de 2 dias inteiros de uma pessoa só cobrando clientes',
    descricao: 'Quantificação objetiva de tempo alocado exclusivamente na caça de pendências.',
    origem: 'Entrevista',
    tipoEvidencia: 'evidencia_observada',
    natureza: 'favoravel',
    organizacaoId: 'ORG-CONT-001',
    entrevistadoId: 'ENTR-P02',
    entrevistaId: 'INT-002',
    categoria: 'Tempo/Custo',
    fraseOriginal: 'Todo mês uma pessoa praticamente fica dois dias inteiros só cobrando os clientes para mandarem os extratos e as despesas.',
    interpretacao: 'Cobrança documental possui custo operacional e financeiro direto e mensurável.',
    tags: ['tempo', 'horas_gastas', 'custo'],
    dorConsolidadaId: 'DOR-CONT-001',
    dataRegistro: '2026-08-16'
  },
  {
    id: 'ACH-004',
    titulo: 'Planilha paralela de 320 linhas como controle de fechamento',
    descricao: 'Uso de Google Sheets compartilhado para contornar falta de visibilidade do ERP.',
    origem: 'Processo',
    tipoEvidencia: 'evidencia_observada',
    natureza: 'favoravel',
    organizacaoId: 'ORG-CONT-001',
    entrevistadoId: 'ENTR-P02',
    entrevistaId: 'INT-002',
    processoId: 'PROC-01',
    categoria: 'Controle Paralelo',
    fraseOriginal: 'Numa planilha gigante de fechamento no Google Sheets com 320 linhas. Pintamos de verde quando chega, amarelo quando cobrou e vermelho quando está atrasado.',
    interpretacao: 'Evidência clara de Customer Operations Gap: o ERP é o destino final, mas o controle operacional é uma planilha.',
    tags: ['planilha', 'gap', 'processo'],
    dorConsolidadaId: 'DOR-CONT-001',
    dataRegistro: '2026-08-16'
  },
  {
    id: 'ACH-005',
    titulo: 'Escritório com 65 clientes relata baixa dor graças a portal simples',
    descricao: 'Evidência contrária à tese em escritórios pequenos onde o portal existente atende 80% da carteira.',
    origem: 'Entrevista',
    tipoEvidencia: 'evidencia_observada',
    natureza: 'contraria',
    organizacaoId: 'ORG-CONT-002',
    entrevistadoId: 'ENTR-P03',
    entrevistaId: 'INT-003',
    categoria: 'Evidência Contrária',
    fraseOriginal: 'Nosso portal já resolve razoavelmente bem a documentação para a nossa escala atual. Cerca de 80% deles sobem direto pelo app porque a gente treinou no onboarding.',
    interpretacao: 'A dor é dependente da escala. Em escritórios com menos de 80 clientes, soluções de prateleira ou proximidade relacional atenuam o problema.',
    tags: ['evidencia_contraria', 'escala_pequena', 'segmentacao'],
    dorConsolidadaId: 'DOR-CONT-001',
    dataRegistro: '2026-08-20'
  },
  {
    id: 'ACH-006',
    titulo: 'Três colaboradores dedicados a follow-up no Escritório 003',
    descricao: 'Confirmação independente em escritório de 480 clientes com custo ainda mais evidente.',
    origem: 'Entrevista',
    tipoEvidencia: 'evidencia_observada',
    natureza: 'favoravel',
    organizacaoId: 'ORG-CONT-003',
    entrevistadoId: 'ENTR-P04',
    entrevistaId: 'INT-004',
    categoria: 'Tempo/Custo',
    fraseOriginal: 'Temos duas estagiárias e uma analista praticamente exclusivas para follow-up de pendências entre os dias 01 e 10. Facilmente mais de 160 horas por mês.',
    interpretacao: 'Confirmação de padrão inter-organizações (H3 e H4): dinheiro real gasto em headcount para compensar a falta de software de operações com o cliente.',
    tags: ['padrao_h3', 'custo_h4', 'horas'],
    dorConsolidadaId: 'DOR-CONT-001',
    dataRegistro: '2026-08-24'
  },
  {
    id: 'ACH-007',
    titulo: 'Dúvidas repetitivas sobre emissão de notas e impostos',
    descricao: 'Clientes perguntam repetidamente as mesmas coisas em canais informais.',
    origem: 'Entrevista',
    tipoEvidencia: 'evidencia_observada',
    natureza: 'favoravel',
    organizacaoId: 'ORG-CONT-003',
    entrevistadoId: 'ENTR-P04',
    entrevistaId: 'INT-004',
    categoria: 'Atendimento',
    fraseOriginal: 'Tirar dúvida repetitiva sobre emissão de nota ou cálculo de pró-labore consome muito tempo da equipe.',
    interpretacao: 'Falta de camada de autoatendimento inteligente ou FAQ contextualizado por cliente.',
    tags: ['duvidas', 'suporte', 'repeticao'],
    dorConsolidadaId: 'DOR-CONT-002',
    dataRegistro: '2026-08-24'
  },
  {
    id: 'ACH-008',
    titulo: 'Admissões de funcionários recebidas em canais dispersos e dados incompletos',
    descricao: 'Coleta de dados de novos colaboradores para o eSocial ocorre de forma desestruturada.',
    origem: 'Entrevista',
    tipoEvidencia: 'evidencia_observada',
    natureza: 'favoravel',
    organizacaoId: 'ORG-CONT-003',
    entrevistadoId: 'ENTR-P05',
    entrevistaId: 'INT-005',
    categoria: 'Departamento Pessoal',
    fraseOriginal: 'O cliente contrata alguém na sexta-feira às 18h e manda um zap dizendo: "Fulano começa na segunda, cadastra ele aí". Manda foto de RG com dedo na frente, sem CPF dos filhos.',
    interpretacao: 'Gargalo operacional de esteira de admissão (Onboarding de DP) vulnerável a erros cadastrais e prazos de 24h.',
    tags: ['dp', 'esocial', 'admissao'],
    dorConsolidadaId: 'DOR-CONT-003',
    dataRegistro: '2026-08-26'
  }
];

export const INITIAL_DORES_CONSOLIDADAS: PainConsolidated[] = [
  {
    id: 'DOR-CONT-001',
    verticalId: 'VERT-CONT',
    titulo: 'Gestão manual de documentos e pendências mensais dos clientes',
    descricao: 'Escritórios gastam dezenas de horas por mês cobrando extratos bancários, notas de tomada de serviço e comprovantes por WhatsApp e e-mail, controlando tudo em planilhas manuais fora do ERP.',
    categoria: 'Operações com Cliente / Fechamento',
    evidenciasFavoraveisIds: ['ACH-001', 'ACH-002', 'ACH-003', 'ACH-004', 'ACH-006'],
    evidenciasContrariasIds: ['ACH-005'],
    evidenciasNeutrasIds: []
  },
  {
    id: 'DOR-CONT-002',
    verticalId: 'VERT-CONT',
    titulo: 'Dúvidas repetitivas de clientes sobre notas, impostos e certidões',
    descricao: 'Analistas fiscais e contábeis interrompem rotinas de fechamento para responder repetidamente as mesmas perguntas de emissão de NFSe, cálculo de guia ou envio de segunda via de boleto.',
    categoria: 'Atendimento / Suporte',
    evidenciasFavoraveisIds: ['ACH-007'],
    evidenciasContrariasIds: [],
    evidenciasNeutrasIds: []
  },
  {
    id: 'DOR-CONT-003',
    verticalId: 'VERT-CONT',
    titulo: 'Coleta desestruturada de documentos de admissão para o eSocial',
    descricao: 'Informações de admissão, dependentes e atestados admissionais chegam por fotos em WhatsApp em cima do prazo legal de 24h, gerando retrabalho e risco de autuações trabalhistas.',
    categoria: 'Departamento Pessoal',
    evidenciasFavoraveisIds: ['ACH-008'],
    evidenciasContrariasIds: [],
    evidenciasNeutrasIds: []
  },
  {
    id: 'DOR-CONT-004',
    verticalId: 'VERT-CONT',
    titulo: 'Monitoramento manual de caixas postais fiscais e DTE dos clientes',
    descricao: 'Falta de automação para ler mensagens na Caixa Postal do e-CAC e prefeituras para identificar notificações com prazo peremptório antes de gerar multa.',
    categoria: 'Fiscal / Compliance',
    evidenciasFavoraveisIds: [],
    evidenciasContrariasIds: [],
    evidenciasNeutrasIds: []
  }
];

export const INITIAL_PAIN_OCCURRENCES: PainOccurrence[] = [
  // Dor 001 no Escritório 001
  {
    id: 'OCC-001-01',
    dorConsolidadaId: 'DOR-CONT-001',
    organizacaoId: 'ORG-CONT-001',
    painScore: {
      frequencia: 4, // mensal/semanal intenso
      tempoCusto: 5, // 96 horas/mês
      severidade: 5, // atrasa fechamento e gera risco de multa fiscal
      manualidade: 5, // WhatsApp + digitação
      repetibilidade: 4, // 320 clientes quase idênticos
      total: 23
    },
    achadosIds: ['ACH-001', 'ACH-002', 'ACH-003', 'ACH-004'],
    notasEspecificas: 'Severidade altíssima devido ao tamanho da carteira (320 clientes). Trava o crescimento do escritório.',
    evidenciaNatureza: 'favoravel'
  },
  // Dor 001 no Escritório 002 (Evidência contrária / baixo impacto)
  {
    id: 'OCC-001-02',
    dorConsolidadaId: 'DOR-CONT-001',
    organizacaoId: 'ORG-CONT-002',
    painScore: {
      frequencia: 2, // controlado
      tempoCusto: 2, // 18 horas/mês
      severidade: 2, // baixo
      manualidade: 2, // usam portal no app
      repetibilidade: 1, // casos excepcionais
      total: 9
    },
    achadosIds: ['ACH-005'],
    notasEspecificas: 'Pain Score muito baixo (9/25) porque possuem apenas 65 clientes e implantaram portal mobile com alta adesão.',
    evidenciaNatureza: 'contraria'
  },
  // Dor 001 no Escritório 003
  {
    id: 'OCC-001-03',
    dorConsolidadaId: 'DOR-CONT-001',
    organizacaoId: 'ORG-CONT-003',
    painScore: {
      frequencia: 5, // contínuo
      tempoCusto: 5, // mais de 160 horas/mês (3 pessoas dedicadas)
      severidade: 5, // crítico
      manualidade: 5, // planilhas e mensagens
      repetibilidade: 5, // 480 clientes em escala
      total: 25
    },
    achadosIds: ['ACH-006'],
    notasEspecificas: 'Pain Score máximo (25/25). Escritório com 480 clientes sofre com o gargalo em seu grau mais extremo.',
    evidenciaNatureza: 'favoravel'
  },
  // Dor 002 no Escritório 001
  {
    id: 'OCC-002-01',
    dorConsolidadaId: 'DOR-CONT-002',
    organizacaoId: 'ORG-CONT-001',
    painScore: {
      frequencia: 4,
      tempoCusto: 4,
      severidade: 3,
      manualidade: 4,
      repetibilidade: 4,
      total: 19
    },
    achadosIds: [],
    notasEspecificas: 'Analistas perdem a concentração no meio de apurações de impostos para tirar dúvidas de notas fiscais.',
    evidenciaNatureza: 'favoravel'
  },
  // Dor 002 no Escritório 003
  {
    id: 'OCC-002-03',
    dorConsolidadaId: 'DOR-CONT-002',
    organizacaoId: 'ORG-CONT-003',
    painScore: {
      frequencia: 4,
      tempoCusto: 4,
      severidade: 3,
      manualidade: 4,
      repetibilidade: 3,
      total: 18
    },
    achadosIds: ['ACH-007'],
    notasEspecificas: 'Tentaram Zendesk mas clientes continuam no WhatsApp dos analistas.',
    evidenciaNatureza: 'favoravel'
  },
  // Dor 003 no Escritório 003
  {
    id: 'OCC-003-03',
    dorConsolidadaId: 'DOR-CONT-003',
    organizacaoId: 'ORG-CONT-003',
    painScore: {
      frequencia: 4,
      tempoCusto: 4,
      severidade: 5, // multa de eSocial
      manualidade: 5,
      repetibilidade: 4,
      total: 22
    },
    achadosIds: ['ACH-008'],
    notasEspecificas: '120 admissões por mês. Risco legal direto para os clientes.',
    evidenciaNatureza: 'favoravel'
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'OP-CONT-001',
    verticalId: 'VERT-CONT',
    subverticalId: 'SUB-GEN',
    nome: 'Customer Operations Layer para Pendências e Fechamento Contábil',
    icpHipotetico: 'Escritórios contábeis generalistas com 150 a 600 clientes PMEs de serviços e comércio.',
    problema: 'A equipe técnica perde até 25% das horas úteis do mês solicitando, cobrando e conferindo documentos bancários e fiscais em múltiplos canais informais (WhatsApp/e-mail), gerando horas extras, estresse e impedindo o crescimento da carteira.',
    jobToBeDone: 'Garantir que 100% dos documentos necessários para o fechamento fiscal e contábil cheguem conferidos e validados aos analistas antes do prazo legal, sem exigir cobranças manuais repetitivas.',
    processoAtual: 'ERP Atlas/Domínio → Planilha Google Sheets → WhatsApp individual do analista → Cliente cobra sócio da PME → Cliente manda foto no zap → Analista baixa no Drive → Renomeia → Digita no ERP.',
    solucaoHipotetica: 'Camada de automação de operações de clientes (COG) conectada ao WhatsApp oficial com inteligência de extração: dispara solicitações programadas, confere se o extrato enviado é válido (rejeita fotos cortadas automaticamente), reconcilia com lista de pendências e entrega os arquivos prontos para conciliação no ERP.',
    doresRelacionadasIds: ['DOR-CONT-001', 'DOR-CONT-002'],
    concorrentesMapeados: ['Portais tradicionais de ERP (ex: Atlas Web)', 'Acessórias', 'Tareffa'],
    diferenciacao: 'Enquanto portais tradicionais exigem que o cliente da PME entre num site com login e senha (onde apenas 20% entram), o VOR atua no canal que o cliente já usa (WhatsApp) com validação ativa de formato e autoatendimento.',
    aiLeverage: {
      leituraNaoEstruturada: 5,
      classificacao: 5,
      extracao: 5,
      comparacao: 4,
      geracao: 3,
      revisaoHumanaDisponivel: 5,
      total: 27
    },
    integracoesNecessarias: ['WhatsApp Cloud API oficial', 'APIs de exportação de extratos Open Finance', 'Webhooks de ERPs contábeis'],
    monetizacaoHipotetica: 'R$ 490 a R$ 1.290 / mês por escritório contábil, baseado no volume de clientes ativos na carteira (ex: R$ 2 a R$ 3 por empresa monitorada).',
    riscos: [
      'Custo da API do WhatsApp para mensagens iniciadas pela empresa',
      'Resistência de contadores tradicionais em mudar a rotina da equipe',
      'Restrição de ERPs fechados para recepção de lote via API'
    ],
    evidenceLevel: 'H4', // Confirmado em múltiplas orgs independentes (ORG 001 e 003) + gasto econômico comprovado em pessoas dedicadas (estagiárias e analistas)
    confidenceScore: 78,
    opportunityScore: {
      mercado: 17, // ~80 mil escritórios no Brasil, alta fragmentação
      dor: 23, // Média altíssima nas orgs alvo (>20)
      operationsGap: 24, // OGS altíssimo (37 a 39 nas orgs 001 e 003)
      economia: 16, // ROI direto: substitui horas extras e 1 estagiário/analista
      gtm: 8, // Acesso direto via sindicatos (Sescon) e parcerias
      total: 88
    },
    proximaMelhorEvidencia: 'H4 -> H5: Desenvolver protótipo focado na validação automática de extrato via WhatsApp e propor piloto pago de 30 dias no Escritório 001 e Escritório 003 para 50 clientes de cada carteira.',
    killCriteria: [
      {
        id: 'KC-01',
        criterio: 'Adesão do cliente final da PME via WhatsApp for inferior a 40%',
        limiar: '< 40%',
        status: 'seguro',
        observacao: 'Pesquisas preliminares indicam que WhatsApp tem >85% de abertura em até 2 horas.'
      },
      {
        id: 'KC-02',
        criterio: 'Disposição a pagar dos escritórios for menor que R$ 300/mês',
        limiar: '< R$ 300/mês',
        status: 'seguro',
        observacao: 'Escritório 003 gasta mais de R$ 4.000/mês em salários alocados exclusivamente nessa rotina.'
      },
      {
        id: 'KC-03',
        criterio: 'ERP principal lançar módulo gratuito que resolva completamente cobrança conversacional',
        limiar: 'Módulo nativo eficiente',
        status: 'alerta',
        observacao: 'ERPs têm histórico de priorizar obrigações fiscais legais em detrimento de UX do cliente.'
      }
    ],
    experimentos: [
      {
        id: 'EXP-01',
        oportunidadeId: 'OP-CONT-001',
        tipo: 'entrevista',
        hipotese: 'Escritórios com mais de 200 clientes gastam no mínimo 80 horas por mês cobrando documentos.',
        publicoAlvo: 'Sócios e gestores de escritórios médios',
        data: '2026-08-25',
        resultadoEsperado: 'Confirmar gasto de mais de 80 horas em 2 escritórios independentes.',
        resultadoObservado: 'ORG-001 reportou 96 horas/mês. ORG-003 reportou mais de 160 horas/mês com 3 pessoas dedicadas.',
        conclusao: 'Confirmou'
      },
      {
        id: 'EXP-02',
        oportunidadeId: 'OP-CONT-001',
        tipo: 'protótipo',
        hipotese: 'Apresentar fluxo simulado de cobrança automática com checagem de formato para o sócio do Escritório 001.',
        publicoAlvo: 'Carlos (ORG-CONT-001)',
        data: '2026-09-02',
        resultadoEsperado: 'Aceite de avaliar proposta de piloto pago.',
        resultadoObservado: 'Sócio demonstrou alto interesse e solicitou proposta formal de teste com a carteira de serviços.',
        conclusao: 'Confirmou'
      }
    ],
    status: 'Testar'
  },
  {
    id: 'OP-CONT-002',
    verticalId: 'VERT-CONT',
    subverticalId: 'SUB-DP',
    nome: 'Esteira Inteligente de Admissão Digital para DP Contábil',
    icpHipotetico: 'Escritórios contábeis com carteiras com alto giro de funcionários (varejo, restaurantes, prestação de serviços).',
    problema: 'Admissões de novos funcionários chegam de última hora por mensagens informais, com documentos incompletos e fotos ilegíveis, expondo o cliente a multas do eSocial por admissão retroativa.',
    jobToBeDone: 'Permitir que o trabalhador contratado envie seus próprios documentos diretamente pelo celular com validação biométrica e OCR antes de enviar a carga validada ao eSocial.',
    processoAtual: 'Cliente manda foto no zap → Analista confere se faltou ASO → Pede de novo → Digita no Atlas → Transmite ao eSocial.',
    solucaoHipotetica: 'Link simples enviado ao empregado recém-contratado que orienta o upload de RG, CPF, título e ASO com validação automática de dados.',
    doresRelacionadasIds: ['DOR-CONT-003'],
    concorrentesMapeados: ['Gupy Admissão', 'Sólides', 'Feedz'],
    diferenciacao: 'Concorrentes atendem grandes RHs internos com mensalidades altas (inviáveis para pequenas empresas clientes do escritório contábil). Solução focada no escritório como canal distribuidor.',
    aiLeverage: {
      leituraNaoEstruturada: 5,
      classificacao: 5,
      extracao: 5,
      comparacao: 4,
      geracao: 2,
      revisaoHumanaDisponivel: 5,
      total: 26
    },
    integracoesNecessarias: ['OCR de documentos brasileiros', 'eSocial Web Service'],
    monetizacaoHipotetica: 'R$ 8 a R$ 15 por admissão processada.',
    riscos: ['LGPD no tratamento de dados de funcionários', 'Dependência de clínica de medicina do trabalho emitir ASO'],
    evidenceLevel: 'H2',
    confidenceScore: 48,
    opportunityScore: {
      mercado: 15,
      dor: 20,
      operationsGap: 21,
      economia: 14,
      gtm: 7,
      total: 77
    },
    proximaMelhorEvidencia: 'H2 -> H3: Validar incidência e Pain Score em pelo menos mais 3 escritórios contábeis independentes com carteira de comércio e hotelaria.',
    killCriteria: [
      {
        id: 'KC-DP-01',
        criterio: 'Volume de admissões por escritório for menor que 30/mês na média da carteira',
        limiar: '< 30/mês',
        status: 'seguro',
        observacao: 'ORG-003 possui 120 admissões/mês.'
      }
    ],
    experimentos: [
      {
        id: 'EXP-DP-01',
        oportunidadeId: 'OP-CONT-002',
        tipo: 'entrevista',
        hipotese: 'Analistas de DP gastam mais de 40 minutos por admissão quando faltam documentos.',
        publicoAlvo: 'Analistas de DP de escritórios contábeis',
        data: '2026-08-26',
        resultadoEsperado: 'Tempo médio confirmado > 40 minutos.',
        resultadoObservado: 'Juliana (ORG-003) relatou cerca de 50 minutos de idas e vindas no WhatsApp para cada admissão incompleta.',
        conclusao: 'Confirmou'
      }
    ],
    status: 'Aprofundar'
  },
  {
    id: 'OP-CONT-003',
    verticalId: 'VERT-CONT',
    subverticalId: 'SUB-GEN',
    nome: 'Monitor e Notificador Automático de Domicílio Tributário Eletrônico (DTE/e-CAC)',
    icpHipotetico: 'Escritórios contábeis com mais de 200 empresas no Lucro Presumido e Real.',
    problema: 'Contadores precisam logar manualmente com centenas de certificados digitais para checar mensagens da Receita Federal e prefeituras, correndo risco de perder intimações.',
    jobToBeDone: 'Receber alertas consolidados imediatos no momento em que qualquer órgão governamental postar intimação para qualquer CNPJ da carteira.',
    processoAtual: 'Analista entra com token certificado e-CAC e clica cliente por cliente uma vez por semana.',
    solucaoHipotetica: 'Robô de consulta periódica em nuvem com certificado em nuvem e resumo executivo via WhatsApp.',
    doresRelacionadasIds: ['DOR-CONT-004'],
    concorrentesMapeados: ['HubCount', 'Arquivei', 'SIEG'],
    diferenciacao: 'Mercado com soluções estabelecidas; pouca diferenciação se focado apenas em DTE.',
    aiLeverage: {
      leituraNaoEstruturada: 4,
      classificacao: 4,
      extracao: 4,
      comparacao: 3,
      geracao: 2,
      revisaoHumanaDisponivel: 4,
      total: 21
    },
    integracoesNecessarias: ['SERPRO e-CAC API', 'Prefeituras'],
    monetizacaoHipotetica: 'R$ 1,50 por CNPJ monitorado.',
    riscos: ['Alta competição de empresas já capitalizadas (SIEG/Arquivei)'],
    evidenceLevel: 'H1',
    confidenceScore: 32,
    opportunityScore: {
      mercado: 14,
      dor: 15,
      operationsGap: 14,
      economia: 12,
      gtm: 5,
      total: 60
    },
    proximaMelhorEvidencia: 'Entrevistar 3 sócios sobre insatisfação com as soluções de mercado atuais antes de seguir.',
    killCriteria: [
      {
        id: 'KC-DTE-01',
        criterio: 'Mais de 70% dos escritórios já usarem SIEG ou Arquivei com satisfação alta (>4/5)',
        limiar: '> 70% satisfeitos',
        status: 'alerta',
        observacao: 'Concorrência intensa nesta sub-área.'
      }
    ],
    experimentos: [],
    status: 'Investigar'
  }
];

export const INITIAL_FONTES: MarketSource[] = [
  {
    id: 'SRC-01',
    verticalId: 'VERT-CONT',
    titulo: 'Estatísticas do Conselho Federal de Contabilidade (CFC 2025/2026)',
    url: 'https://cfc.org.br/dados-estatisticos',
    instituicao: 'Conselho Federal de Contabilidade',
    data: '2026-01-15',
    categoria: 'empresas',
    informacaoExtraida: 'Existem mais de 82.000 organizações contábeis ativas no Brasil e mais de 530.000 profissionais registrados.',
    resumo: 'Mercado extremamente fragmentado, formado majoritariamente por escritórios de pequeno e médio porte geridos por sócios-contadores.',
    confiabilidade: 'Alta'
  },
  {
    id: 'SRC-02',
    verticalId: 'VERT-CONT',
    titulo: 'Censo Contábil e Maturidade Digital das PMEs',
    url: 'https://exemplo-pesquisa-contabil.com.br/relatorio',
    instituicao: 'Instituto Nacional de Gestão Contábil',
    data: '2025-11-20',
    categoria: 'tecnologia',
    informacaoExtraida: '76% dos escritórios afirmam que a comunicação com clientes via WhatsApp é a rotina com maior risco de desorganização.',
    resumo: 'Apesar de 98% dos escritórios usarem ERPs tradicionais de apuração, menos de 22% conseguem fazer seus clientes utilizarem portais web próprios com frequência.',
    confiabilidade: 'Alta'
  },
  {
    id: 'SRC-03',
    verticalId: 'VERT-CONT',
    titulo: 'Impacto da Reforma Tributária nas Obrigações Acessórias',
    url: 'https://exemplo-reforma-tributaria.org.br',
    instituicao: 'FGV Direito / Economia',
    data: '2026-03-10',
    categoria: 'regulação',
    informacaoExtraida: 'Período de transição de tributos gerará aumento temporário de 40% na demanda de esclarecimento e conciliação de notas fiscais com clientes.',
    resumo: 'Aumento de complexidade no atendimento ao cliente contábil nos próximos anos reforça a necessidade de automação de operações de contato.',
    confiabilidade: 'Média'
  }
];

export const INITIAL_CONCORRENTES: Competitor[] = [
  {
    id: 'COMP-01',
    verticalId: 'VERT-CONT',
    nome: 'ERP Atlas Contábil (Módulo Web)',
    site: 'https://atlas-contabil-demo.com.br',
    publico: 'Escritórios contábeis de qualquer porte',
    proposta: 'ERP completo de apuração fiscal, contábil e folha com portal do cliente acessível via navegador.',
    precoEstimado: 'R$ 1.200 a R$ 4.500 / mês',
    modelo: 'SaaS',
    funcionalidadesPrincipais: ['SPED Fiscal', 'Folha eSocial', 'Escrituração contábil', 'Portal web de downloads de guias'],
    integracoes: ['SEFAZ', 'Prefeituras'],
    iaPresente: false,
    pontosFortes: ['Apuração técnica confiável', 'Suporte às regras fiscais brasileiras', 'Larga base instalada'],
    limitacoes: ['Interface ultrapassada para o cliente final', 'Não engaja o cliente no WhatsApp', 'Não automatiza a cobrança proativa'],
    operationsGapObservado: 'O cliente da PME não entra no portal do ERP; o contador continua gastando horas no WhatsApp para cobrar os arquivos e jogá-los no ERP manualmente.'
  },
  {
    id: 'COMP-02',
    verticalId: 'VERT-CONT',
    nome: 'Acessórias Gestão',
    site: 'https://acessorias-demo.com.br',
    publico: 'Escritórios contábeis focados em controle de entregas e obrigações',
    proposta: 'Software de gestão de prazos, entrega de guias com protocolo e lembretes por WhatsApp.',
    precoEstimado: 'R$ 390 a R$ 990 / mês',
    modelo: 'Por usuário',
    funcionalidadesPrincipais: ['Checklist de tarefas', 'Disparo de guias por e-mail/WhatsApp', 'Protocolo de leitura'],
    integracoes: ['Principais ERPs contábeis'],
    iaPresente: false,
    pontosFortes: ['Excelente controle interno de prazos para o gestor', 'Fácil implantação'],
    limitacoes: ['Focado na saída (entrega de guias) e não na entrada inteligente de documentos com conferência de formato e OCR'],
    operationsGapObservado: 'Resolve bem o envio de guias e protocolo, mas não resolve a caça mensal a extratos e notas fiscais de entrada nem valida se o PDF enviado pelo cliente é legível.'
  }
];

export const INITIAL_CROSS_VERTICAL: CrossVerticalComparison[] = [
  {
    padraoNome: 'Cobrança de documentos e evidências dos clientes',
    descricao: 'Prestador de serviço fica travado aguardando envio de comprovantes, relatórios ou extratos periódicos que dependem do cliente.',
    dadosPorVertical: {
      'Contabilidade': { incidenciaPercent: 67, orgsConfirmadas: 8, totalOrgs: 12, painMedio: 21.0, evidenciaNivel: 'H4' },
      'SST': { incidenciaPercent: 81, orgsConfirmadas: 9, totalOrgs: 11, painMedio: 22.4, evidenciaNivel: 'H3' },
      'Consultoria Ambiental': { incidenciaPercent: 69, orgsConfirmadas: 5, totalOrgs: 7, painMedio: 19.5, evidenciaNivel: 'H2' },
      'Jurídico B2B': { incidenciaPercent: 54, orgsConfirmadas: 4, totalOrgs: 8, painMedio: 18.0, evidenciaNivel: 'H2' }
    }
  },
  {
    padraoNome: 'Controle paralelo de prazos fatais em planilhas',
    descricao: 'Uso de planilhas Excel/Google Sheets ou quadros manuais porque o software vertical central não dá visão executiva de pendências.',
    dadosPorVertical: {
      'Contabilidade': { incidenciaPercent: 75, orgsConfirmadas: 9, totalOrgs: 12, painMedio: 20.2, evidenciaNivel: 'H3' },
      'SST': { incidenciaPercent: 88, orgsConfirmadas: 10, totalOrgs: 11, painMedio: 23.1, evidenciaNivel: 'H3' },
      'Consultoria Ambiental': { incidenciaPercent: 85, orgsConfirmadas: 6, totalOrgs: 7, painMedio: 22.8, evidenciaNivel: 'H3' },
      'Jurídico B2B': { incidenciaPercent: 62, orgsConfirmadas: 5, totalOrgs: 8, painMedio: 21.0, evidenciaNivel: 'H3' }
    }
  },
  {
    padraoNome: 'Dúvidas repetitivas e atendimento fragmentado no WhatsApp',
    descricao: 'Clientes enviam dúvidas pontuais e operacionais nos aparelhos particulares de técnicos, sem histórico centralizado.',
    dadosPorVertical: {
      'Contabilidade': { incidenciaPercent: 58, orgsConfirmadas: 7, totalOrgs: 12, painMedio: 18.5, evidenciaNivel: 'H3' },
      'SST': { incidenciaPercent: 63, orgsConfirmadas: 7, totalOrgs: 11, painMedio: 17.2, evidenciaNivel: 'H2' },
      'Consultoria Ambiental': { incidenciaPercent: 42, orgsConfirmadas: 3, totalOrgs: 7, painMedio: 14.0, evidenciaNivel: 'H1' },
      'Jurídico B2B': { incidenciaPercent: 50, orgsConfirmadas: 4, totalOrgs: 8, painMedio: 16.5, evidenciaNivel: 'H2' }
    }
  },
  {
    padraoNome: 'Coleta de assinaturas e aprovações de orçamentos/laudos',
    descricao: 'Tempo decorrido entre envio de relatório técnico ou minuta e aprovação formal do decisor do cliente.',
    dadosPorVertical: {
      'Contabilidade': { incidenciaPercent: 41, orgsConfirmadas: 5, totalOrgs: 12, painMedio: 15.0, evidenciaNivel: 'H2' },
      'SST': { incidenciaPercent: 72, orgsConfirmadas: 8, totalOrgs: 11, painMedio: 20.8, evidenciaNivel: 'H3' },
      'Consultoria Ambiental': { incidenciaPercent: 85, orgsConfirmadas: 6, totalOrgs: 7, painMedio: 24.0, evidenciaNivel: 'H3' },
      'Jurídico B2B': { incidenciaPercent: 58, orgsConfirmadas: 5, totalOrgs: 8, painMedio: 19.2, evidenciaNivel: 'H2' }
    }
  }
];
