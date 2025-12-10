import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

async function main() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🌱 Iniciando seed completo...\n');

  console.log('👤 Criando usuários...');

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@governo.ms.gov.br' },
      update: {},
      create: {
        email: 'admin@governo.ms.gov.br',
        name: 'Administrador do Sistema',
        passwordHash: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        role: 'ADMIN',
        active: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'operador@sefaz.ms.gov.br' },
      update: {},
      create: {
        email: 'operador@sefaz.ms.gov.br',
        name: 'João Silva - Operador SEFAZ',
        passwordHash: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        role: 'OPERATOR',
        active: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'auditor@tce.ms.gov.br' },
      update: {},
      create: {
        email: 'auditor@tce.ms.gov.br',
        name: 'Maria Santos - Auditora TCE',
        passwordHash: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        role: 'VIEWER',
        active: true,
      },
    }),
  ]);
  console.log(`   ✅ ${users.length} usuários criados`);

  console.log('🏛️  Criando unidades gestoras...');

  const units = await Promise.all([
    prisma.unit.upsert({
      where: { code: 'SEFAZ-MS' },
      update: {},
      create: {
        code: 'SEFAZ-MS',
        name: 'Secretaria de Estado de Fazenda',
        tokenProducao: 'prod-token-sefaz-2024-xxxxx',
        tokenHomologacao: 'homolog-token-sefaz-2024-xxxxx',
        ambiente: 'HOMOLOGACAO',
        active: true,
      },
    }),
    prisma.unit.upsert({
      where: { code: 'SAD-MS' },
      update: {},
      create: {
        code: 'SAD-MS',
        name: 'Secretaria de Estado de Administração e Desburocratização',
        tokenProducao: 'prod-token-sad-2024-xxxxx',
        tokenHomologacao: 'homolog-token-sad-2024-xxxxx',
        ambiente: 'HOMOLOGACAO',
        active: true,
      },
    }),
    prisma.unit.upsert({
      where: { code: 'SES-MS' },
      update: {},
      create: {
        code: 'SES-MS',
        name: 'Secretaria de Estado de Saúde',
        tokenProducao: 'prod-token-ses-2024-xxxxx',
        tokenHomologacao: 'homolog-token-ses-2024-xxxxx',
        ambiente: 'HOMOLOGACAO',
        active: true,
      },
    }),
    prisma.unit.upsert({
      where: { code: 'SED-MS' },
      update: {},
      create: {
        code: 'SED-MS',
        name: 'Secretaria de Estado de Educação',
        tokenProducao: 'prod-token-sed-2024-xxxxx',
        tokenHomologacao: 'homolog-token-sed-2024-xxxxx',
        ambiente: 'HOMOLOGACAO',
        active: true,
      },
    }),
    prisma.unit.upsert({
      where: { code: 'SEJUSP-MS' },
      update: {},
      create: {
        code: 'SEJUSP-MS',
        name: 'Secretaria de Estado de Justiça e Segurança Pública',
        tokenProducao: 'prod-token-sejusp-2024-xxxxx',
        tokenHomologacao: 'homolog-token-sejusp-2024-xxxxx',
        ambiente: 'HOMOLOGACAO',
        active: true,
      },
    }),
  ]);
  console.log(`   ✅ ${units.length} unidades gestoras criadas`);

  console.log('🔗 Configurando endpoints...');

  const endpoints = await Promise.all([
    prisma.endpointConfig.upsert({
      where: { module: 'CONTRATO' },
      update: {},
      create: {
        module: 'CONTRATO',
        endpoint: '/api/v1/contratos',
        method: 'POST',
        description: 'Envio de dados de contratos administrativos',
        active: true,
      },
    }),
    prisma.endpointConfig.upsert({
      where: { module: 'EMPENHO' },
      update: {},
      create: {
        module: 'EMPENHO',
        endpoint: '/api/v1/empenhos',
        method: 'POST',
        description: 'Envio de notas de empenho',
        active: true,
      },
    }),
    prisma.endpointConfig.upsert({
      where: { module: 'COMPRA_DIRETA' },
      update: {},
      create: {
        module: 'COMPRA_DIRETA',
        endpoint: '/api/v1/compras-diretas',
        method: 'POST',
        description: 'Envio de compras diretas e dispensas de licitação',
        active: true,
      },
    }),
    prisma.endpointConfig.upsert({
      where: { module: 'LICITACAO' },
      update: {},
      create: {
        module: 'LICITACAO',
        endpoint: '/api/v1/licitacoes',
        method: 'POST',
        description: 'Envio de processos licitatórios',
        active: true,
      },
    }),
    prisma.endpointConfig.upsert({
      where: { module: 'PAGAMENTO' },
      update: {},
      create: {
        module: 'PAGAMENTO',
        endpoint: '/api/v1/pagamentos',
        method: 'POST',
        description: 'Envio de ordens de pagamento',
        active: true,
      },
    }),
  ]);
  console.log(`   ✅ ${endpoints.length} endpoints configurados`);

  console.log('📋 Criando regras de validação...');

  await prisma.validationRule.deleteMany({});

  const validationRules = await Promise.all([
    prisma.validationRule.create({
      data: {
        module: 'COMPRA_DIRETA',
        field: 'valor',
        operator: 'GREATER_THAN',
        value: '330000',
        level: 'IMPEDITIVA',
        code: 'CD001',
        message:
          'Valor de Compra Direta para Obra de Engenharia não pode exceder R$ 330.000,00 (Lei 14.133/2021)',
        active: true,
      },
    }),
    prisma.validationRule.create({
      data: {
        module: 'COMPRA_DIRETA',
        field: 'valor',
        operator: 'GREATER_THAN',
        value: '57208.33',
        level: 'ALERTA',
        code: 'CD002',
        message:
          'Compra Direta acima de R$ 57.208,33 requer três orçamentos documentados',
        active: true,
      },
    }),
    prisma.validationRule.create({
      data: {
        module: 'COMPRA_DIRETA',
        field: 'fornecedor.cnpj',
        operator: 'REGEX',
        value: '^\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}-\\d{2}$',
        level: 'IMPEDITIVA',
        code: 'CD003',
        message: 'CNPJ do fornecedor deve estar no formato válido',
        active: true,
      },
    }),

    prisma.validationRule.create({
      data: {
        module: 'CONTRATO',
        field: 'valor',
        operator: 'GREATER_THAN',
        value: '1000000',
        level: 'ALERTA',
        code: 'CT001',
        message:
          'Contrato com valor superior a R$ 1.000.000,00 requer aprovação do ordenador de despesas',
        active: true,
      },
    }),
    prisma.validationRule.create({
      data: {
        module: 'CONTRATO',
        field: 'valor',
        operator: 'LESS_THAN',
        value: '100',
        level: 'IMPEDITIVA',
        code: 'CT002',
        message: 'Valor do contrato não pode ser inferior a R$ 100,00',
        active: true,
      },
    }),
    prisma.validationRule.create({
      data: {
        module: 'CONTRATO',
        field: 'objeto',
        operator: 'REQUIRED',
        value: 'true',
        level: 'IMPEDITIVA',
        code: 'CT003',
        message: 'O objeto do contrato é obrigatório',
        active: true,
      },
    }),

    prisma.validationRule.create({
      data: {
        module: 'EMPENHO',
        field: 'valor',
        operator: 'GREATER_THAN',
        value: '500000',
        level: 'ALERTA',
        code: 'EM001',
        message:
          'Empenho acima de R$ 500.000,00 deve ter parecer da assessoria jurídica',
        active: true,
      },
    }),
    prisma.validationRule.create({
      data: {
        module: 'EMPENHO',
        field: 'dotacao.elemento',
        operator: 'REQUIRED',
        value: 'true',
        level: 'IMPEDITIVA',
        code: 'EM002',
        message: 'Elemento de despesa é obrigatório no empenho',
        active: true,
      },
    }),

    prisma.validationRule.create({
      data: {
        module: 'LICITACAO',
        field: 'valorEstimado',
        operator: 'GREATER_THAN',
        value: '10000000',
        level: 'ALERTA',
        code: 'LIC001',
        message:
          'Licitação acima de R$ 10.000.000,00 deve ser publicada no DOU',
        active: true,
      },
    }),
  ]);
  console.log(`   ✅ ${validationRules.length} regras de validação criadas`);

  console.log('📦 Criando dados brutos...');

  const sefaz = units[0];
  const sad = units[1];
  const ses = units[2];
  const sed = units[3];

  const contratosPayloads = [
    {
      numero: '001/2024',
      objeto:
        'Aquisição de equipamentos de informática para modernização do parque tecnológico',
      valor: 450000.0,
      dataInicio: '2024-01-15',
      dataFim: '2024-12-31',
      modalidade: 'PREGAO_ELETRONICO',
      fornecedor: {
        cnpj: '12.345.678/0001-90',
        razaoSocial: 'TechSolutions Informática LTDA',
        endereco: 'Av. Afonso Pena, 1000 - Campo Grande/MS',
      },
    },
    {
      numero: '002/2024',
      objeto: 'Serviços de manutenção predial preventiva e corretiva',
      valor: 180000.0,
      dataInicio: '2024-02-01',
      dataFim: '2025-01-31',
      modalidade: 'PREGAO_ELETRONICO',
      fornecedor: {
        cnpj: '98.765.432/0001-10',
        razaoSocial: 'Manutenção Total Engenharia LTDA',
        endereco: 'Rua 14 de Julho, 500 - Campo Grande/MS',
      },
    },
    {
      numero: '003/2024',
      objeto: 'Fornecimento de material de escritório e expediente',
      valor: 75000.0,
      dataInicio: '2024-03-01',
      dataFim: '2024-12-31',
      modalidade: 'PREGAO_ELETRONICO',
      fornecedor: {
        cnpj: '11.222.333/0001-44',
        razaoSocial: 'Papelaria Central do MS EIRELI',
        endereco: 'Rua Barão do Rio Branco, 200 - Campo Grande/MS',
      },
    },
    {
      numero: '004/2024',
      objeto: 'Consultoria em gestão pública e modernização administrativa',
      valor: 320000.0,
      dataInicio: '2024-04-01',
      dataFim: '2024-09-30',
      modalidade: 'INEXIGIBILIDADE',
      fornecedor: {
        cnpj: '44.555.666/0001-77',
        razaoSocial: 'Instituto de Gestão Pública S/A',
        endereco: 'Av. Paulista, 1500 - São Paulo/SP',
      },
    },
  ];

  const empenhosPayloads = [
    {
      numero: '2024NE00001',
      data: '2024-01-10',
      valor: 150000.0,
      tipo: 'ORDINARIO',
      credor: {
        cnpj: '12.345.678/0001-90',
        nome: 'TechSolutions Informática LTDA',
      },
      dotacao: {
        unidade: '29101',
        funcao: '04',
        subfuncao: '126',
        programa: '0042',
        acao: '2001',
        elemento: '44.90.52',
        fonte: '0100',
      },
      historico: 'Aquisição de computadores - 1ª parcela',
    },
    {
      numero: '2024NE00002',
      data: '2024-01-15',
      valor: 45000.0,
      tipo: 'ORDINARIO',
      credor: {
        cnpj: '98.765.432/0001-10',
        nome: 'Manutenção Total Engenharia LTDA',
      },
      dotacao: {
        unidade: '29101',
        funcao: '04',
        subfuncao: '122',
        programa: '0001',
        acao: '2002',
        elemento: '33.90.39',
        fonte: '0100',
      },
      historico: 'Serviços de manutenção predial - Janeiro/2024',
    },
    {
      numero: '2024NE00003',
      data: '2024-02-01',
      valor: 620000.0,
      tipo: 'GLOBAL',
      credor: {
        cnpj: '55.666.777/0001-88',
        nome: 'Distribuidora de Medicamentos Brasil LTDA',
      },
      dotacao: {
        unidade: '27101',
        funcao: '10',
        subfuncao: '302',
        programa: '0035',
        acao: '4001',
        elemento: '33.90.30',
        fonte: '0114',
      },
      historico: 'Aquisição de medicamentos para rede estadual de saúde',
    },
  ];

  const comprasDiretasPayloads = [
    {
      numero: 'CD001/2024',
      data: '2024-01-20',
      valor: 28500.0,
      tipoObjeto: 'MATERIAL',
      fundamentoLegal: 'Art. 75, II da Lei 14.133/2021',
      descricao: 'Aquisição de toner e cartuchos para impressoras',
      fornecedor: {
        cnpj: '33.444.555/0001-66',
        razaoSocial: 'Suprimentos de Informática MS LTDA',
      },
    },
    {
      numero: 'CD002/2024',
      data: '2024-02-05',
      valor: 15000.0,
      tipoObjeto: 'SERVICO',
      fundamentoLegal: 'Art. 75, II da Lei 14.133/2021',
      descricao: 'Serviço de dedetização das instalações',
      fornecedor: {
        cnpj: '77.888.999/0001-00',
        razaoSocial: 'Controle de Pragas MS EIRELI',
      },
    },
    {
      numero: 'CD003/2024',
      data: '2024-03-10',
      valor: 500000.0,
      tipoObjeto: 'OBRA_ENGENHARIA',
      fundamentoLegal: 'Art. 75, I, a da Lei 14.133/2021',
      descricao: 'Reforma emergencial do telhado do prédio anexo',
      fornecedor: {
        cnpj: '22.333.444/0001-55',
        razaoSocial: 'Construtora Rápida LTDA',
      },
    },
  ];

  const rawDataEntries: Array<{
    unitId: number;
    module: string;
    competency: string;
    payload: Prisma.InputJsonValue;
    status: string;
  }> = [];

  contratosPayloads.forEach((payload, index) => {
    rawDataEntries.push({
      unitId: [sefaz.id, sad.id, ses.id, sed.id][index % 4],
      module: 'CONTRATO',
      competency: '2024-01',
      payload: payload as Prisma.InputJsonValue,
      status: 'RECEIVED',
    });
  });

  empenhosPayloads.forEach((payload, index) => {
    rawDataEntries.push({
      unitId: [sefaz.id, sad.id, ses.id][index % 3],
      module: 'EMPENHO',
      competency: '2024-01',
      payload: payload as Prisma.InputJsonValue,
      status: 'RECEIVED',
    });
  });

  comprasDiretasPayloads.forEach((payload, index) => {
    rawDataEntries.push({
      unitId: [sefaz.id, sad.id, ses.id][index % 3],
      module: 'COMPRA_DIRETA',
      competency: '2024-01',
      payload: payload as Prisma.InputJsonValue,
      status: 'RECEIVED',
    });
  });

  const rawDataRecords = await Promise.all(
    rawDataEntries.map((entry) => prisma.rawData.create({ data: entry })),
  );
  console.log(
    `   ✅ ${rawDataRecords.length} registros de dados brutos criados`,
  );

  console.log('🔄 Criando dados transformados...');

  const transformedDataEntries: Array<{
    rawId: number;
    payload: Prisma.InputJsonValue;
  }> = [];

  rawDataRecords
    .filter((r) => r.module === 'CONTRATO')
    .forEach((raw) => {
      const payload = raw.payload as Record<string, unknown>;
      const fornecedor = payload.fornecedor as Record<string, unknown>;

      transformedDataEntries.push({
        rawId: raw.id,
        payload: {
          dadosContrato: {
            numeroContrato: payload.numero,
            objetoContrato: payload.objeto,
            valorContrato: payload.valor,
            modalidadeLicitacao: payload.modalidade,
            vigencia: {
              inicio: payload.dataInicio,
              fim: payload.dataFim,
            },
            contratado: {
              cnpj: String(fornecedor.cnpj).replace(/[^\d]/g, ''),
              nome: fornecedor.razaoSocial,
              endereco: fornecedor.endereco,
            },
          },
        } as Prisma.InputJsonValue,
      });
    });

  rawDataRecords
    .filter((r) => r.module === 'EMPENHO')
    .forEach((raw) => {
      const payload = raw.payload as Record<string, unknown>;
      const credor = payload.credor as Record<string, unknown>;
      const dotacao = payload.dotacao as Record<string, unknown>;

      transformedDataEntries.push({
        rawId: raw.id,
        payload: {
          dadosEmpenho: {
            numeroEmpenho: payload.numero,
            dataEmpenho: payload.data,
            valorEmpenho: payload.valor,
            tipoEmpenho: payload.tipo,
            historicoEmpenho: payload.historico,
            credorEmpenho: {
              cnpj: String(credor.cnpj).replace(/[^\d]/g, ''),
              nome: credor.nome,
            },
            dotacaoOrcamentaria: {
              unidadeOrcamentaria: dotacao.unidade,
              funcao: dotacao.funcao,
              subfuncao: dotacao.subfuncao,
              programa: dotacao.programa,
              acaoGovernamental: dotacao.acao,
              elementoDespesa: dotacao.elemento,
              fonteRecurso: dotacao.fonte,
            },
          },
        } as Prisma.InputJsonValue,
      });
    });

  const transformedRecords = await Promise.all(
    transformedDataEntries.map((entry) =>
      prisma.transformedData.create({ data: entry }),
    ),
  );
  console.log(
    `   ✅ ${transformedRecords.length} registros transformados criados`,
  );

  console.log('✅ Criando registros de validação...');

  const compraDiretaAlta = rawDataRecords.find((r) => {
    if (r.module !== 'COMPRA_DIRETA') return false;
    const payload = r.payload as Record<string, unknown>;
    return (payload.valor as number) > 330000;
  });

  const validationEntries: Array<{
    rawId: number;
    ruleId: number | null;
    level: string;
    code: string;
    message: string;
    field: string;
    value: string;
  }> = [];

  if (compraDiretaAlta) {
    const ruleCD001 = validationRules.find((r) => r.code === 'CD001');
    validationEntries.push({
      rawId: compraDiretaAlta.id,
      ruleId: ruleCD001?.id || null,
      level: 'IMPEDITIVA',
      code: 'CD001',
      message:
        'Valor de Compra Direta para Obra de Engenharia não pode exceder R$ 330.000,00 (Lei 14.133/2021)',
      field: 'valor',
      value: '500000',
    });
  }

  const contratosAltoValor = rawDataRecords.filter((r) => {
    if (r.module !== 'CONTRATO') return false;
    const payload = r.payload as Record<string, unknown>;
    return (payload.valor as number) > 300000;
  });

  contratosAltoValor.forEach((contrato) => {
    const payload = contrato.payload as Record<string, unknown>;
    validationEntries.push({
      rawId: contrato.id,
      ruleId: null,
      level: 'ALERTA',
      code: 'CT001',
      message: 'Contrato com valor elevado - verificar documentação de suporte',
      field: 'valor',
      value: String(payload.valor),
    });
  });

  const validationRecords = await Promise.all(
    validationEntries.map((entry) => prisma.validation.create({ data: entry })),
  );
  console.log(`   ✅ ${validationRecords.length} validações registradas`);

  console.log('📤 Criando remessas...');

  const remittanceEntries: Array<{
    unitId: number;
    module: string;
    competency: string;
    status: string;
    payload: Prisma.InputJsonValue;
    protocol?: string;
    errorMsg?: string;
    sentAt?: Date;
  }> = [];

  transformedRecords.slice(0, 3).forEach((transformed, index) => {
    const raw = rawDataRecords.find((r) => r.id === transformed.rawId);
    if (raw) {
      remittanceEntries.push({
        unitId: raw.unitId,
        module: raw.module,
        competency: raw.competency,
        status: 'SENT',
        payload: transformed.payload as Prisma.InputJsonValue,
        protocol: `TCE-MS-2024-${String(index + 1).padStart(6, '0')}`,
        sentAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000),
      });
    }
  });

  transformedRecords.slice(3, 5).forEach((transformed) => {
    const raw = rawDataRecords.find((r) => r.id === transformed.rawId);
    if (raw) {
      remittanceEntries.push({
        unitId: raw.unitId,
        module: raw.module,
        competency: raw.competency,
        status: 'READY',
        payload: transformed.payload as Prisma.InputJsonValue,
      });
    }
  });

  if (compraDiretaAlta) {
    const payload = compraDiretaAlta.payload as Record<string, unknown>;
    remittanceEntries.push({
      unitId: compraDiretaAlta.unitId,
      module: compraDiretaAlta.module,
      competency: compraDiretaAlta.competency,
      status: 'ERROR',
      payload: {
        dadosCompraDireta: {
          numero: payload.numero,
          valor: payload.valor,
          descricao: payload.descricao,
        },
      } as Prisma.InputJsonValue,
      errorMsg:
        'Validação impeditiva: Valor de Compra Direta excede o limite legal',
    });
  }

  remittanceEntries.push({
    unitId: sed.id,
    module: 'CONTRATO',
    competency: '2024-02',
    status: 'PENDING',
    payload: {
      dadosContrato: {
        numeroContrato: '005/2024',
        objetoContrato: 'Serviços de transporte escolar',
        valorContrato: 850000.0,
      },
    } as Prisma.InputJsonValue,
  });

  remittanceEntries.push({
    unitId: sefaz.id,
    module: 'EMPENHO',
    competency: '2024-01',
    status: 'CANCELLED',
    payload: {
      dadosEmpenho: {
        numeroEmpenho: '2024NE00099',
        valorEmpenho: 25000.0,
        motivo: 'Empenho cancelado por erro de digitação',
      },
    } as Prisma.InputJsonValue,
    errorMsg: 'Cancelado pelo usuário: Dados incorretos',
  });

  const remittanceRecords = await Promise.all(
    remittanceEntries.map((entry) => prisma.remittance.create({ data: entry })),
  );
  console.log(`   ✅ ${remittanceRecords.length} remessas criadas`);

  console.log('📝 Criando logs de comunicação...');

  const remittanceLogEntries: Array<{
    remittanceId: number;
    direction: string;
    url: string;
    method: string;
    headers: Prisma.InputJsonValue;
    body: Prisma.InputJsonValue;
    statusCode?: number;
    duration?: number;
  }> = [];

  remittanceRecords
    .filter((r) => r.status === 'SENT')
    .forEach((remittance) => {
      remittanceLogEntries.push({
        remittanceId: remittance.id,
        direction: 'REQUEST',
        url: `https://api.tce.ms.gov.br/esfinge/api/v1/${remittance.module.toLowerCase()}s`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer homolog-token-***',
          'X-Request-ID': `req-${Date.now()}-${remittance.id}`,
        } as Prisma.InputJsonValue,
        body: remittance.payload as Prisma.InputJsonValue,
      });

      remittanceLogEntries.push({
        remittanceId: remittance.id,
        direction: 'RESPONSE',
        url: `https://api.tce.ms.gov.br/esfinge/api/v1/${remittance.module.toLowerCase()}s`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Response-Time': '234ms',
        } as Prisma.InputJsonValue,
        body: {
          success: true,
          protocolo: remittance.protocol,
          mensagem: 'Dados recebidos com sucesso',
          dataProcessamento: new Date().toISOString(),
        } as Prisma.InputJsonValue,
        statusCode: 200,
        duration: 234,
      });
    });

  const remittanceError = remittanceRecords.find((r) => r.status === 'ERROR');
  if (remittanceError) {
    remittanceLogEntries.push({
      remittanceId: remittanceError.id,
      direction: 'REQUEST',
      url: 'https://api.tce.ms.gov.br/esfinge/api/v1/compras-diretas',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer homolog-token-***',
      } as Prisma.InputJsonValue,
      body: remittanceError.payload as Prisma.InputJsonValue,
    });

    remittanceLogEntries.push({
      remittanceId: remittanceError.id,
      direction: 'RESPONSE',
      url: 'https://api.tce.ms.gov.br/esfinge/api/v1/compras-diretas',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      } as Prisma.InputJsonValue,
      body: {
        success: false,
        erro: {
          codigo: 'VAL001',
          mensagem: 'Valor excede limite permitido para compra direta',
        },
      } as Prisma.InputJsonValue,
      statusCode: 422,
      duration: 156,
    });
  }

  const logRecords = await Promise.all(
    remittanceLogEntries.map((entry) =>
      prisma.remittanceLog.create({ data: entry }),
    ),
  );
  console.log(`   ✅ ${logRecords.length} logs de comunicação criados`);

  console.log('🔍 Criando logs de auditoria...');

  const auditLogEntries: Array<{
    userId?: number;
    action: string;
    entity: string;
    entityId?: number;
    oldValue?: Prisma.InputJsonValue;
    newValue?: Prisma.InputJsonValue;
    ip: string;
    userAgent: string;
  }> = [];

  const operadorUser = users.find((u) => u.role === 'OPERATOR');

  units.forEach((unit) => {
    auditLogEntries.push({
      userId: users[0].id,
      action: 'CREATE',
      entity: 'Unit',
      entityId: unit.id,
      newValue: { code: unit.code, name: unit.name } as Prisma.InputJsonValue,
      ip: '10.0.0.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });
  });

  rawDataRecords.slice(0, 5).forEach((raw) => {
    auditLogEntries.push({
      userId: operadorUser?.id,
      action: 'CREATE',
      entity: 'RawData',
      entityId: raw.id,
      newValue: {
        module: raw.module,
        competency: raw.competency,
      } as Prisma.InputJsonValue,
      ip: '10.0.0.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });
  });

  remittanceRecords
    .filter((r) => r.status === 'SENT')
    .forEach((remittance) => {
      auditLogEntries.push({
        userId: operadorUser?.id,
        action: 'SEND',
        entity: 'Remittance',
        entityId: remittance.id,
        oldValue: { status: 'READY' } as Prisma.InputJsonValue,
        newValue: {
          status: 'SENT',
          protocol: remittance.protocol,
        } as Prisma.InputJsonValue,
        ip: '10.0.0.101',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      });
    });

  const remittanceCancelled = remittanceRecords.find(
    (r) => r.status === 'CANCELLED',
  );
  if (remittanceCancelled) {
    auditLogEntries.push({
      userId: operadorUser?.id,
      action: 'CANCEL',
      entity: 'Remittance',
      entityId: remittanceCancelled.id,
      oldValue: { status: 'PENDING' } as Prisma.InputJsonValue,
      newValue: {
        status: 'CANCELLED',
        motivo: 'Dados incorretos',
      } as Prisma.InputJsonValue,
      ip: '10.0.0.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });
  }

  const auditRecords = await Promise.all(
    auditLogEntries.map((entry) => prisma.auditLog.create({ data: entry })),
  );
  console.log(`   ✅ ${auditRecords.length} logs de auditoria criados`);

  console.log('\n' + '='.repeat(50));
  console.log('🎉 SEED COMPLETO!');
  console.log('='.repeat(50));
  console.log(`
📊 Resumo dos dados criados:
   • Usuários:              ${users.length}
   • Unidades Gestoras:     ${units.length}
   • Endpoints:             ${endpoints.length}
   • Regras de Validação:   ${validationRules.length}
   • Dados Brutos:          ${rawDataRecords.length}
   • Dados Transformados:   ${transformedRecords.length}
   • Validações:            ${validationRecords.length}
   • Remessas:              ${remittanceRecords.length}
   • Logs de Comunicação:   ${logRecords.length}
   • Logs de Auditoria:     ${auditRecords.length}
  `);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error('❌ Erro no seed:', e);
  process.exit(1);
});
