import {
  ModuleMapper,
  TransformResult,
  cleanCnpjCpf,
  formatDate,
} from './base.mapper';

export class ContratoMapper implements ModuleMapper {
  transform(input: Record<string, unknown>): TransformResult {
    const fornecedor = input.fornecedor as Record<string, unknown> | undefined;

    const payload: Record<string, unknown> = {
      dadosContrato: {
        numeroContrato: input.numero ?? input.numeroContrato,
        objetoContrato: input.objeto ?? input.objetoContrato,
        valorContrato: input.valor ?? input.valorContrato,
        vigencia: {
          inicio: formatDate((input.dataInicio as string) ?? ''),
          fim: formatDate((input.dataFim as string) ?? ''),
        },
        contratado: fornecedor
          ? {
              cnpj: cleanCnpjCpf((fornecedor.cnpj as string) ?? ''),
              nome: fornecedor.razaoSocial ?? fornecedor.nome,
            }
          : null,
      },
    };

    if (input.campoNovo !== undefined) {
      (payload.dadosContrato as Record<string, unknown>).campoAdicional =
        input.campoNovo;
    }

    this.copyExtraFields(
      input,
      payload.dadosContrato as Record<string, unknown>,
    );

    return { success: true, payload };
  }

  private copyExtraFields(
    input: Record<string, unknown>,
    target: Record<string, unknown>,
  ): void {
    const knownFields = [
      'numero',
      'numeroContrato',
      'objeto',
      'objetoContrato',
      'valor',
      'valorContrato',
      'dataInicio',
      'dataFim',
      'fornecedor',
      'campoNovo',
    ];

    for (const key of Object.keys(input)) {
      if (!knownFields.includes(key)) {
        target[key] = input[key];
      }
    }
  }
}
